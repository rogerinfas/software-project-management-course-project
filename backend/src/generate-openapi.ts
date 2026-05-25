// Suppress pg driver client.query deprecation warning programmatically
const originalEmitWarning = process.emitWarning;
process.emitWarning = function (warning, ...args: any[]) {
  if (typeof warning === 'string' && warning.includes('client.query()')) {
    return;
  }
  if (warning instanceof Error && warning.message && warning.message.includes('client.query()')) {
    return;
  }
  return originalEmitWarning.call(process, warning, ...args as any);
};

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { auth } from './infrastructure/config/better-auth/better-auth.config';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('School Management API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  let combinedDocument = document;
  try {
    const openAPISchema = await auth.api.generateOpenAPISchema();
    if (openAPISchema) {
      const betterAuthPaths = (openAPISchema as any).paths || {};
      const betterAuthComponents = (openAPISchema as any).components || {};
      const betterAuthSchemas = betterAuthComponents.schemas || {};
      const betterAuthSecuritySchemes =
        betterAuthComponents.securitySchemes || {};
      const betterAuthTags = (openAPISchema as any).tags || [];

      const prefixedBetterAuthPaths: Record<string, any> = {};
      for (const [path, value] of Object.entries(betterAuthPaths)) {
        prefixedBetterAuthPaths[`/api/auth${path}`] = value;
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
  } catch (e) {}

  // Asegurar que todos los operationId sean únicos
  try {
    const operationIdCounts = new Map<string, number>();
    for (const [path, pathItem] of Object.entries(
      combinedDocument.paths || {},
    )) {
      if (typeof pathItem === 'object' && pathItem !== null) {
        for (const [method, operation] of Object.entries(pathItem)) {
          if (
            typeof operation === 'object' &&
            operation !== null &&
            'operationId' in operation
          ) {
            const op = operation;
            const opId = op.operationId;
            if (opId) {
              const count = operationIdCounts.get(opId) || 0;
              operationIdCounts.set(opId, count + 1);
              if (count > 0) {
                op.operationId = `${opId}_${method}`;
              }
            }
          }
        }
      }
    }
  } catch (error) {}

  const outputDir = join(process.cwd(), 'generated');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  writeFileSync(join(outputDir, 'openapi-schema.json'), JSON.stringify(combinedDocument, null, 2));
  console.log('✅ Generated openapi-schema.json successfully!');
  await app.close();
  process.exit(0);
}
generate();
