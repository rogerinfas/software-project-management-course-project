import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const firstNames = ['Carlos', 'Ana', 'Luis', 'María', 'Jorge', 'Elena', 'Pedro', 'Laura', 'Miguel', 'Sofía', 'Fernando', 'Lucía', 'David', 'Carmen', 'Raúl', 'Paula'];
const lastNames = ['García', 'Fernández', 'López', 'Martínez', 'González', 'Pérez', 'Rodríguez', 'Sánchez', 'Gómez', 'Díaz', 'Torres', 'Ramírez', 'Flores', 'Vargas'];

function getRandomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}

function getRandomPhone() {
  return '9' + Math.floor(Math.random() * 90000000 + 10000000).toString();
}

function getRandomDni() {
  return Math.floor(Math.random() * 90000000 + 10000000).toString();
}

async function main() {
  console.log('🌱 Iniciando vaciado de la base de datos (Teardown)...');

  // Teardown en orden inverso a las dependencias
  await prisma.payment.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.tariff.deleteMany();
  await prisma.communication.deleteMany();
  await prisma.evaluationResult.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.prospectInteraction.deleteMany();
  await prisma.prospect.deleteMany();
  // Se deja intactos a los usuarios administradores por defecto (si es necesario) pero vamos a limpiar para ser estrictos
  // await prisma.user.deleteMany(); // Cuidado: esto borra tus usuarios de login. Te crearé 2 de prueba.
  
  // Limpiar usuarios que no sean admin por precaución
  await prisma.user.deleteMany({
    where: { NOT: { email: 'admin@santabeatriz.com' } }
  });

  console.log('✅ Teardown completado.');
  console.log('🌱 Iniciando Seed de datos...');

  // ────────────────────────────────────────────────────────────────────────
  // 1. USUARIOS (TEACHERS & STAFF)
  // ────────────────────────────────────────────────────────────────────────
  const teacher = await prisma.user.create({
    data: {
      email: 'teacher@santabeatriz.com',
      name: 'Profesor Principal',
      role: 'TEACHER',
      emailVerified: true,
    }
  });

  // ────────────────────────────────────────────────────────────────────────
  // 2. GESTIÓN ACADÉMICA (M3)
  // ────────────────────────────────────────────────────────────────────────
  const courses = await Promise.all([
    prisma.course.create({ data: { name: 'Matemáticas', description: 'Curso de ciencias exactas' } }),
    prisma.course.create({ data: { name: 'Comunicación', description: 'Lectura y redacción' } }),
    prisma.course.create({ data: { name: 'Ciencias', description: 'CTA' } }),
  ]);

  const sectionsData = [
    { name: 'A', grade: '1° primaria', level: 'PRIMARY', capacity: 25 },
    { name: 'B', grade: '1° primaria', level: 'PRIMARY', capacity: 25 },
    { name: 'A', grade: '2° primaria', level: 'PRIMARY', capacity: 25 },
    { name: 'A', grade: '4° secundaria', level: 'SECONDARY', capacity: 30 },
  ];

  const sections = await Promise.all(
    sectionsData.map(s => prisma.section.create({ data: { ...s as any } }))
  );

  // Crear algunos horarios
  for (const section of sections) {
    await prisma.schedule.create({
      data: {
        sectionId: section.id,
        courseId: courses[0].id,
        staffId: teacher.id,
        day: 1, // Lunes
        startTime: '08:00',
        endTime: '09:30',
      }
    });
  }

  // Comunicados
  await prisma.communication.create({
    data: {
      title: 'Inicio de Matrículas 2026',
      content: 'Estimados padres, las matrículas están abiertas.',
      category: 'Informativo',
    }
  });

  // ────────────────────────────────────────────────────────────────────────
  // 3. TESORERÍA (M4)
  // ────────────────────────────────────────────────────────────────────────
  const tariffs = await Promise.all([
    prisma.tariff.create({ data: { concept: 'Matrícula Anual - Primaria', amount: 350.0, type: 'ONE_TIME', level: 'PRIMARY' } }),
    prisma.tariff.create({ data: { concept: 'Pensión - Primaria', amount: 450.0, type: 'MONTHLY', level: 'PRIMARY' } }),
    prisma.tariff.create({ data: { concept: 'Matrícula Anual - Secundaria', amount: 400.0, type: 'ONE_TIME', level: 'SECONDARY' } }),
    prisma.tariff.create({ data: { concept: 'Pensión - Secundaria', amount: 500.0, type: 'MONTHLY', level: 'SECONDARY' } }),
  ]);

  // ────────────────────────────────────────────────────────────────────────
  // 4. ADMISIÓN (M1)
  // ────────────────────────────────────────────────────────────────────────
  const prospects = [];
  for (let i = 0; i < 40; i++) {
    const isPrimary = Math.random() > 0.5;
    const level = isPrimary ? 'PRIMARY' : 'SECONDARY';
    const grade = isPrimary ? '1° primaria' : '4° secundaria';

    const isFit = Math.random() > 0.4;
    const stage = isFit ? 'EVALUACION_ACADEMICA' : (Math.random() > 0.5 ? 'ENTREVISTA' : 'EVALUACION_PSICOLOGICA');

    const prospect = await prisma.prospect.create({
      data: {
        name: getRandomName(),
        phone: getRandomPhone(),
        level: level,
        targetGrade: grade,
        priority: 'MEDIUM',
        stage: stage,
      }
    });

    // Agregar evaluación a algunos (FIT o PENDING)
    await prisma.evaluationResult.create({
      data: {
        prospectId: prospect.id,
        aptitude: isFit ? 'FIT' : 'PENDING',
        comments: isFit ? 'Cumple con el perfil de la institución.' : 'Pendiente de entregar documentos.',
      }
    });

    // Agregar interacción
    await prisma.prospectInteraction.create({
      data: {
        prospectId: prospect.id,
        type: 'llamada',
        summary: 'Se contactó a la familia interesada.',
        author: 'Admin',
      }
    });

    prospects.push({ ...prospect, isFit });
  }

  // ────────────────────────────────────────────────────────────────────────
  // 5. MATRÍCULA (M2)
  // ────────────────────────────────────────────────────────────────────────
  const fitProspects = prospects.filter(p => p.isFit);
  const studentsToFormalize = fitProspects.slice(0, 10); // Matricular 10 alumnos
  
  for (const prospect of studentsToFormalize) {
    const guardian = await prisma.guardian.create({
      data: {
        name: getRandomName(),
        dni: getRandomDni(),
        phone: getRandomPhone(),
        email: `apoderado_${prospect.id.substring(0,4)}@mail.com`,
        occupation: 'Profesional',
      }
    });

    const nameParts = prospect.name.split(' ');
    const student = await prisma.student.create({
      data: {
        prospectId: prospect.id, // ¡Enlace establecido!
        code: `ALU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || 'Apellidos',
        dni: getRandomDni(),
        level: prospect.level,
        grade: prospect.targetGrade,
        guardianId: guardian.id,
        sectionId: sections.find(s => s.grade === prospect.targetGrade)?.id,
      }
    });

    // Generar matrícula activa
    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        year: new Date().getFullYear(),
        status: 'ACTIVE',
      }
    });

    // Generar cargos (Charges) en Tesorería
    const matchingTariff = tariffs.find(t => t.level === prospect.level && t.type === 'ONE_TIME');
    if (matchingTariff) {
      const charge = await prisma.charge.create({
        data: {
          studentId: student.id,
          tariffId: matchingTariff.id,
          originalAmount: matchingTariff.amount,
          pendingAmount: matchingTariff.amount,
          status: 'PENDING',
          dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        }
      });

      // Simular que algunos pagan la mitad
      if (Math.random() > 0.5) {
        const paymentAmount = matchingTariff.amount / 2;
        await prisma.payment.create({
          data: {
            chargeId: charge.id,
            totalAmount: paymentAmount,
            method: 'TRANSFER',
          }
        });
        await prisma.charge.update({
          where: { id: charge.id },
          data: {
            pendingAmount: matchingTariff.amount - paymentAmount,
            status: 'PARTIAL',
          }
        });
      }
    }
  }

  console.log(`✅ Seed completado con éxito:`);
  console.log(`- ${sections.length} secciones creadas`);
  console.log(`- ${courses.length} cursos creados`);
  console.log(`- ${tariffs.length} tarifas creadas`);
  console.log(`- ${prospects.length} prospectos (10 de ellos matriculados oficialmente)`);
  console.log(`- Pagos y Cargos de Tesorería generados exitosamente.`);
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
