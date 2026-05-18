import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';
import { PrismaService } from '../src/infrastructure/persistence/prisma/prisma.service';

describe('🚀 Auth & User Module Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let cookie: string;
  let userId: string;

  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User Integration';

  before(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    prismaService = app.get(PrismaService);
    await app.init();
  });

  after(async () => {
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
    test('POST /api/auth/sign-up/email - should register a new user and return user info', async () => {
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
        console.log('DEBUG sign-up: Body is:', JSON.stringify(res.body, null, 2));
        console.log('DEBUG sign-up: Cookies are:', res.headers['set-cookie']);

        assert.strictEqual(res.status, 200);
        assert.ok(res.body.user, 'User object should be returned');
        assert.strictEqual(res.body.user.email, testEmail, 'Email should match');
        assert.strictEqual(res.body.user.name, testName, 'Name should match');
        
        userId = res.body.user.id;

        // Extraer cookie si se configuró en el registro
        const cookies = res.headers['set-cookie'] as any as string[];
        if (cookies) {
          const foundCookie = cookies.find((c: string) => c.startsWith('better-auth.session_token'));
          if (foundCookie) {
            cookie = foundCookie;
          }
        }
      } catch (err: any) {
        console.error('💥 Test sign-up crashed with error:', err.message, err.stack);
        throw err;
      }
    });

    test('POST /api/auth/sign-in/email - should authenticate and return session cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/sign-in/email')
        .set('Origin', 'http://localhost:5000')
        .send({
          email: testEmail,
          password: testPassword,
        });

      console.log('DEBUG sign-in: Status is:', res.status);
      console.log('DEBUG sign-in: Body is:', JSON.stringify(res.body, null, 2));

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.user, 'User object should be returned');

      const cookies = res.headers['set-cookie'] as any as string[];
      assert.ok(cookies, 'Cookies should be set');
      const foundCookie = cookies.find((c: string) => c.startsWith('better-auth.session_token'));
      assert.ok(foundCookie, 'Better Auth session cookie should be found');
      cookie = foundCookie;
    });

    test('GET /api/auth/get-session - should return session info when cookie is supplied', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/get-session')
        .set('Cookie', [cookie]);

      console.log('DEBUG get-session: Status is:', res.status);
      console.log('DEBUG get-session: Body is:', JSON.stringify(res.body, null, 2));

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.session, 'Session object should be returned');
      assert.ok(res.body.user, 'User object should be returned');
      assert.strictEqual(res.body.user.email, testEmail, 'Email should match');
    });
  });

  describe('User Administration Endpoints (CRUD)', () => {
    test('GET /api/users - should reject unauthorized requests (no session cookie)', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .expect(401);
    });

    test('GET /api/users - should fetch users list when authenticated', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users')
        .set('Cookie', [cookie])
        .expect(200);

      assert.ok(Array.isArray(res.body), 'Response should be an array');
      assert.ok(res.body.length >= 1, 'Array should have at least 1 element');
      const user = res.body.find((u: any) => u.id === userId);
      assert.ok(user, 'User should be in the list');
      assert.strictEqual(user.email, testEmail);
    });

    test('GET /api/users/:id - should fetch a single user by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Cookie', [cookie])
        .expect(200);

      assert.strictEqual(res.body.id, userId);
      assert.strictEqual(res.body.email, testEmail);
    });

    test('PUT /api/users/:id - should update user name', async () => {
      const updatedName = 'Updated Test Name Integration';
      const res = await request(app.getHttpServer())
        .put(`/api/users/${userId}`)
        .set('Cookie', [cookie])
        .send({
          name: updatedName,
        })
        .expect(200);

      assert.strictEqual(res.body.name, updatedName);
    });

    test('DELETE /api/users/:id - should delete a user', async () => {
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
        console.log('DEBUG delete signup: Body is:', JSON.stringify(signUpRes.body, null, 2));

        assert.strictEqual(signUpRes.status, 200);
        const tempId = signUpRes.body.user.id;

        const deleteRes = await request(app.getHttpServer())
          .delete(`/api/users/${tempId}`)
          .set('Cookie', [cookie]);

        console.log('DEBUG delete: Status is:', deleteRes.status);
        console.log('DEBUG delete: Body is:', JSON.stringify(deleteRes.body, null, 2));

        assert.strictEqual(deleteRes.status, 200);

        const getRes = await request(app.getHttpServer())
          .get(`/api/users/${tempId}`)
          .set('Cookie', [cookie]);

        console.log('DEBUG delete verify: Status is:', getRes.status);

        assert.strictEqual(getRes.status, 404);
      } catch (err: any) {
        console.error('💥 Test delete user crashed with error:', err.message, err.stack);
        throw err;
      }
    });
  });

  describe('Sign Out Endpoint', () => {
    test('POST /api/auth/sign-out - should destroy session', async () => {
      try {
        const res = await request(app.getHttpServer())
          .post('/api/auth/sign-out')
          .set('Origin', 'http://localhost:5000')
          .set('Cookie', [cookie]);

        console.log('DEBUG sign-out: Status is:', res.status);
        console.log('DEBUG sign-out: Body is:', JSON.stringify(res.body, null, 2));

        assert.strictEqual(res.status, 200);

        const sessionRes = await request(app.getHttpServer())
          .get('/api/auth/get-session')
          .set('Cookie', [cookie]);

        console.log('DEBUG sign-out verify: Status is:', sessionRes.status);
        console.log('DEBUG sign-out verify: Body is:', JSON.stringify(sessionRes.body, null, 2));

        assert.strictEqual(sessionRes.body, null, 'Session should be null after sign-out');
      } catch (err: any) {
        console.error('💥 Test sign-out crashed with error:', err.message, err.stack);
        throw err;
      }
    });
  });
});
