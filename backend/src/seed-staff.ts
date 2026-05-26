import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando la inicialización de datos de personal y asistencia (M5)...');

  // 1. Crear Regla Global de Asistencia
  let rule = await prisma.attendanceRule.findFirst();
  if (!rule) {
    rule = await prisma.attendanceRule.create({
      data: {
        gracePeriodMinutes: 5,
        finePerMinute: 0.5,
      },
    });
    console.log('✅ Regla global de asistencia creada.');
  } else {
    console.log('ℹ️ Regla global de asistencia ya existe.');
  }

  // 2. Crear perfiles administrativos (STAFF) adicionales
  const staffToCreate = [
    {
      email: 'lucia.torres@school.edu',
      name: 'Lucía Torres',
      specialty: 'Asistente de Recursos Humanos',
      entryTime: '08:00',
      exitTime: '16:00',
      role: Role.STAFF,
    },
    {
      email: 'marcos.diaz@school.edu',
      name: 'Marcos Díaz',
      specialty: 'Administrador de Sistemas',
      entryTime: '08:00',
      exitTime: '16:00',
      role: Role.STAFF,
    },
  ];

  for (const item of staffToCreate) {
    let user = await prisma.user.findUnique({
      where: { email: item.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: item.email,
          name: item.name,
          role: item.role,
          emailVerified: true,
        },
      });
      console.log(`✅ Usuario administrativo creado: ${user.name}`);
    }

    let profile = await prisma.staffProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      profile = await prisma.staffProfile.create({
        data: {
          userId: user.id,
          specialty: item.specialty,
          entryTime: item.entryTime,
          exitTime: item.exitTime,
          gracePeriod: 5,
        },
      });
      console.log(`✅ Perfil administrativo creado para: ${user.name}`);
    }
  }

  // 3. Obtener todos los perfiles de personal para registrar historial de asistencia
  const allProfiles = await prisma.staffProfile.findMany({
    include: { user: true },
  });

  console.log(`📊 Generando registros de asistencia para ${allProfiles.length} empleados...`);

  // Días laborables pasados para simular asistencia (Lunes 18 de Mayo a Viernes 22 de Mayo de 2026)
  const weekdays = [
    new Date(2026, 4, 18), // Lunes
    new Date(2026, 4, 19), // Martes
    new Date(2026, 4, 20), // Miércoles
    new Date(2026, 4, 21), // Jueves
    new Date(2026, 4, 22), // Viernes
  ];

  // Limpiar registros antiguos para evitar duplicación al re-sembrar
  await prisma.attendanceRecord.deleteMany({});
  console.log('🧹 Limpieza de registros de asistencia anteriores completada.');

  for (const profile of allProfiles) {
    const [targetEntryHour, targetEntryMin] = profile.entryTime.split(':').map(Number);
    const [targetExitHour, targetExitMin] = profile.exitTime.split(':').map(Number);

    for (const dayDate of weekdays) {
      // Determinar si llega tarde o a tiempo aleatoriamente para simular variabilidad
      const isLate = Math.random() > 0.4; // 60% puntual, 40% tarde
      let entryHour = targetEntryHour;
      let entryMin = Math.floor(Math.random() * (profile.gracePeriod + 1)); // Arriba entre 0 y 5 mins de gracia

      let delayMinutes = 0;
      let fineAmount = 0.0;

      if (isLate) {
        // Tardanza de entre 6 y 35 minutos
        entryMin = 6 + Math.floor(Math.random() * 30);
        delayMinutes = entryMin; // Ya que target es hora:00
        fineAmount = delayMinutes * rule.finePerMinute;
      }

      // Crear entrada
      const entryTimestamp = new Date(dayDate);
      entryTimestamp.setHours(entryHour, entryMin, 0, 0);

      await prisma.attendanceRecord.create({
        data: {
          staffId: profile.id,
          type: 'entry',
          timestamp: entryTimestamp,
          method: 'FACIAL',
          delayMinutes,
          fineAmount,
        },
      });

      // Crear salida (siempre a tiempo o unos minutos después)
      const exitTimestamp = new Date(dayDate);
      const exitMinOffset = Math.floor(Math.random() * 10); // Sale 0-10 min tarde
      exitTimestamp.setHours(targetExitHour, targetExitMin + exitMinOffset, 0, 0);

      await prisma.attendanceRecord.create({
        data: {
          staffId: profile.id,
          type: 'exit',
          timestamp: exitTimestamp,
          method: 'FACIAL',
          delayMinutes: 0,
          fineAmount: 0.0,
        },
      });
    }
    console.log(`✅ Registros de asistencia (entrada/salida) de Lunes a Viernes creados para: ${profile.user.name}`);
  }

  console.log('🎉 Inicialización de personal y asistencia completada exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
