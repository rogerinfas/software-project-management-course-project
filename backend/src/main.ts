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
  
  // Swagger clásico
  SwaggerModule.setup('api/swagger', app, document);

  // Scalar interactivo premium
  app.use(
    '/api/docs',
    apiReference({
      theme: 'elysiajs',
      spec: {
        content: document,
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
