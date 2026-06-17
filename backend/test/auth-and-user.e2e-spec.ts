import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';
import { PrismaService } from '../src/infrastructure/persistence/prisma/prisma.service';
import { HttpExceptionFilter } from '../src/presentation/filters/http-exception.filter';

describe('🚀 Auth & User Module Integration Tests (Jest E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let cookie: string;
  let userId: string;

  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User Integration';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    prismaService = app.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    // Limpiar usuario creado en los tests
    if (userId) {
      try {
        await prismaService.user.deleteMany({
          where: { email: testEmail },
        });
      } catch (err) {
        console.error('⚠️ Error cleaning up test user:', err);
      }
    }
    await app.close();
  });

  describe('Better Auth Endpoints', () => {
    it('POST /api/auth/sign-up/email - should register a new user and return user info', async () => {
      try {
        const res = await request(app.getHttpServer())
          .post('/api/auth/sign-up/email')
          .set('Origin', 'http://localhost:5000')
          .send({
            email: testEmail,
            password: testPassword,
            name: testName,
          });

        console.log('DEBUG sign-up: Status is:', res.status);
        console.log(
          'DEBUG sign-up: Body is:',
          JSON.stringify(res.body, null, 2),
        );
        console.log('DEBUG sign-up: Cookies are:', res.headers['set-cookie']);

        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe(testEmail);
        expect(res.body.user.name).toBe(testName);

        userId = res.body.user.id;

        // Extraer cookie si se configuró en el registro
        const cookies = res.headers['set-cookie'] as any as string[];
        if (cookies) {
          const foundCookie = cookies.find((c: string) =>
            c.startsWith('better-auth.session_token'),
          );
          if (foundCookie) {
            cookie = foundCookie;
          }
        }
      } catch (err: any) {
        console.error(
          '💥 Test sign-up crashed with error:',
          err.message,
          err.stack,
        );
        throw err;
      }
    });

    it('POST /api/auth/sign-in/email - should authenticate and return session cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .set('Origin', 'http://localhost:5000')
        .send({
          email: testEmail,
          password: testPassword,
        });

      console.log('DEBUG sign-in: Status is:', res.status);
      console.log('DEBUG sign-in: Body is:', JSON.stringify(res.body, null, 2));

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();

      const cookies = res.headers['set-cookie'] as any as string[];
      expect(cookies).toBeDefined();
      const foundCookie = cookies.find((c: string) =>
        c.startsWith('better-auth.session_token'),
      );
      expect(foundCookie).toBeDefined();
      cookie = foundCookie!;
    });

    it('GET /api/auth/get-session - should return session info when cookie is supplied', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/get-session')
        .set('Cookie', [cookie]);

      console.log('DEBUG get-session: Status is:', res.status);
      console.log(
        'DEBUG get-session: Body is:',
        JSON.stringify(res.body, null, 2),
      );

      expect(res.status).toBe(200);
      expect(res.body.session).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
    });
  });

  describe('User Administration Endpoints (CRUD)', () => {
    it('GET /api/users - should reject unauthorized requests (no session cookie)', async () => {
      await request(app.getHttpServer()).get('/api/users').expect(401);
    });

    it('GET /api/users - should fetch users list when authenticated', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users')
        .set('Cookie', [cookie])
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.meta).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);

      const user = res.body.data.find((u: any) => u.id === userId);
      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
    });

    it('GET /api/users - should fetch paginated users list when page and size are supplied', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users?page=1&size=5')
        .set('Cookie', [cookie])
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.meta).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.pageSize).toBe(5);
      expect(typeof res.body.meta.total).toBe('number');
    });

    it('GET /api/users/:id - should fetch a single user by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Cookie', [cookie])
        .expect(200);

      expect(res.body.id).toBe(userId);
      expect(res.body.email).toBe(testEmail);
    });

    it('PUT /api/users/:id - should update user name', async () => {
      const updatedName = 'Updated Test Name Integration';
      const res = await request(app.getHttpServer())
        .put(`/api/users/${userId}`)
        .set('Cookie', [cookie])
        .send({
          name: updatedName,
        })
        .expect(200);

      expect(res.body.name).toBe(updatedName);
    });

    it('DELETE /api/users/:id - should delete a user', async () => {
      try {
        const tempEmail = `temp-${Date.now()}@example.com`;
        const signUpRes = await request(app.getHttpServer())
          .post('/api/auth/sign-up/email')
          .set('Origin', 'http://localhost:5000')
          .send({
            email: tempEmail,
            password: testPassword,
            name: 'Temp User',
          });

        console.log('DEBUG delete signup: Status is:', signUpRes.status);
        console.log(
          'DEBUG delete signup: Body is:',
          JSON.stringify(signUpRes.body, null, 2),
        );

        expect(signUpRes.status).toBe(200);
        const tempId = signUpRes.body.user.id;

        const deleteRes = await request(app.getHttpServer())
          .delete(`/api/users/${tempId}`)
          .set('Cookie', [cookie]);

        console.log('DEBUG delete: Status is:', deleteRes.status);
        console.log(
          'DEBUG delete: Body is:',
          JSON.stringify(deleteRes.body, null, 2),
        );

        expect(deleteRes.status).toBe(200);

        const getRes = await request(app.getHttpServer())
          .get(`/api/users/${tempId}`)
          .set('Cookie', [cookie]);

        console.log('DEBUG delete verify: Status is:', getRes.status);

        expect(getRes.status).toBe(404);
      } catch (err: any) {
        console.error(
          '💥 Test delete user crashed with error:',
          err.message,
          err.stack,
        );
        throw err;
      }
    });
  });

  describe('Sign Out Endpoint', () => {
    it('POST /api/auth/sign-out - should destroy session', async () => {
      try {
        const res = await request(app.getHttpServer())
          .post('/api/auth/sign-out')
          .set('Origin', 'http://localhost:5000')
          .set('Cookie', [cookie]);

        console.log('DEBUG sign-out: Status is:', res.status);
        console.log(
          'DEBUG sign-out: Body is:',
          JSON.stringify(res.body, null, 2),
        );

        expect(res.status).toBe(200);

        const sessionRes = await request(app.getHttpServer())
          .get('/api/auth/get-session')
          .set('Cookie', [cookie]);

        console.log('DEBUG sign-out verify: Status is:', sessionRes.status);
        console.log(
          'DEBUG sign-out verify: Body is:',
          JSON.stringify(sessionRes.body, null, 2),
        );

        expect(sessionRes.body).toBeNull();
      } catch (err: any) {
        console.error(
          '💥 Test sign-out crashed with error:',
          err.message,
          err.stack,
        );
        throw err;
      }
    });
  });
});
