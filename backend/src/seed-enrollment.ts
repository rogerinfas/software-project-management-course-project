import { PrismaClient, EducationalLevel } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de matrícula...');

  const guardian = await prisma.guardian.upsert({
    where: { dni: '12345678' },
    update: {},
    create: {
      dni: '12345678',
      name: 'Padre Ejemplo',
      phone: '999888777',
      email: 'padre@ejemplo.com',
    },
  });

  await prisma.student.upsert({
    where: { dni: '87654321' },
    update: {},
    create: {
      code: 'STU001',
      firstName: 'Alumno1',
      lastName: 'Ejemplo',
      dni: '87654321',
      level: EducationalLevel.PRIMARY,
      grade: '1ro de Primaria',
      guardianId: guardian.id,
    },
  });

  await prisma.student.upsert({
    where: { dni: '87654322' },
    update: {},
    create: {
      code: 'STU002',
      firstName: 'Alumno2',
      lastName: 'Ejemplo',
      dni: '87654322',
      level: EducationalLevel.SECONDARY,
      grade: '1ro de Secundaria',
      guardianId: guardian.id,
    },
  });

  console.log('🎉 Seed de matrícula completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
