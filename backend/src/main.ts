import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  Logger,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { auth } from './infrastructure/config/better-auth/better-auth.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Better Auth handles body parsing
  });

  const port = process.env.PORT || 5000;

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('School Management API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // Generar esquema OpenAPI de Better Auth y fusionarlo dinámicamente
  let combinedDocument = document;
  try {
    const openAPISchema = await auth.api.generateOpenAPISchema();
    if (openAPISchema) {
      const betterAuthPaths = (openAPISchema as any).paths || {};
      const betterAuthComponents = (openAPISchema as any).components || {};
      const betterAuthSchemas = betterAuthComponents.schemas || {};
      const betterAuthSecuritySchemes = betterAuthComponents.securitySchemes || {};
      const betterAuthTags = (openAPISchema as any).tags || [];

      // Agregar prefijo /api/auth a los paths de Better Auth
      const prefixedBetterAuthPaths: Record<string, any> = {};
      for (const [path, value] of Object.entries(betterAuthPaths)) {
        const prefixedPath = `/api/auth${path}`;
        prefixedBetterAuthPaths[prefixedPath] = value;
      }

      combinedDocument = {
        ...document,
        paths: {
          ...document.paths,
          ...prefixedBetterAuthPaths,
        },
        components: {
          ...document.components,
          schemas: {
            ...(document.components?.schemas || {}),
            ...betterAuthSchemas,
          },
          securitySchemes: {
            ...(document.components?.securitySchemes || {}),
            ...betterAuthSecuritySchemes,
          },
        },
        tags: [...(document.tags || []), ...betterAuthTags],
      } as any;
    }
  } catch (error) {
    Logger.error('❌ Error generating Better Auth OpenAPI schema', error);
  }

  // Swagger clásico
  SwaggerModule.setup('api/swagger', app, combinedDocument);

  // Scalar interactivo premium
  app.use(
    '/api/docs',
    apiReference({
      theme: 'elysiajs',
      spec: {
        content: combinedDocument,
      },
      customCss: `
        @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        @font-face {
          font-family: 'Iosevka';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url(https://cdn.jsdelivr.net/fontsource/fonts/iosevka@latest/latin-400-normal.woff2) format('woff2'), url(https://cdn.jsdelivr.net/fontsource/fonts/iosevka@latest/latin-400-normal.woff) format('woff');
        }
        :root { --scalar-font: "Atkinson Hyperlegible"; --scalar-font-code: Iosevka, "JetBrains Mono", monospace; }
        #scalar-client-0 {max-width: 100% !important}
      `,
    }),
  );

  app.enableCors({
    origin: [process.env.WEB_URL || 'http://localhost:3000'],
    credentials: true,
  });

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
  Logger.log(`📚 Scalar API Documentation available at: http://localhost:${port}/api/docs`);
  Logger.log(`📖 Swagger legacy documentation available at: http://localhost:${port}/api/swagger`);
}
bootstrap().catch((err) => {
  Logger.error('❌ Error starting application', err);
  process.exit(1);
});
