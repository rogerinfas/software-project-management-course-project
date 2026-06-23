import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prismaClient, {
    provider: 'postgresql',
  }),
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    'http://localhost:2000',
    'http://127.0.0.1:2000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...(process.env.WEB_URL ? [process.env.WEB_URL] : []),
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'ADMIN',
      },
      image: {
        type: 'string',
        required: false,
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    cookies: {
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      sameSite: 'none', // requerido para cross-site/cross-subdomain
      secure: true, // requerido para sameSite none
      // Extrae el dominio raíz de WEB_URL en producción para compartir cookies entre subdominios
      domain: process.env.WEB_URL && process.env.WEB_URL.includes('celebrali.com') 
        ? '.celebrali.com' 
        : undefined,
    }
  }
});
