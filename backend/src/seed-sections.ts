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
  console.log('🌱 Creando secciones académicas iniciales...');

  const sectionsToCreate = [
    // primaria
    { name: 'A', grade: '1ro de Primaria', level: EducationalLevel.PRIMARY, capacity: 25 },
    { name: 'A', grade: '2do de Primaria', level: EducationalLevel.PRIMARY, capacity: 25 },
    { name: 'A', grade: '3ro de Primaria', level: EducationalLevel.PRIMARY, capacity: 25 },
    { name: 'A', grade: '4to de Primaria', level: EducationalLevel.PRIMARY, capacity: 25 },
    { name: 'A', grade: '5to de Primaria', level: EducationalLevel.PRIMARY, capacity: 25 },
    { name: 'A', grade: '6to de Primaria', level: EducationalLevel.PRIMARY, capacity: 25 },
    // secundaria
    { name: 'A', grade: '1ro de Secundaria', level: EducationalLevel.SECONDARY, capacity: 30 },
    { name: 'A', grade: '2do de Secundaria', level: EducationalLevel.SECONDARY, capacity: 30 },
    { name: 'A', grade: '3ro de Secundaria', level: EducationalLevel.SECONDARY, capacity: 30 },
    { name: 'A', grade: '4to de Secundaria', level: EducationalLevel.SECONDARY, capacity: 30 },
    { name: 'A', grade: '5to de Secundaria', level: EducationalLevel.SECONDARY, capacity: 30 },
  ];

  for (const item of sectionsToCreate) {
    const existing = await prisma.section.findFirst({
      where: { grade: item.grade, name: item.name },
    });

    if (!existing) {
      const created = await prisma.section.create({ data: item });
      console.log(`✅ Sección creada: ${created.grade} - ${created.name}`);
    } else {
      console.log(`ℹ️ Sección ya existe: ${existing.grade} - ${existing.name}`);
    }
  }

  console.log('🌱 Inicialización de secciones finalizada con éxito.');
}

main()
  .catch((e) => {
    console.error('💥 Error al inicializar secciones:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
