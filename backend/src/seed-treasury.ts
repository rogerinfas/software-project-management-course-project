import { PrismaClient, EducationalLevel, TariffType, PaymentMethod } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando la inicialización de datos de tesorería...');

  // 1. Crear Tarifas
  const tariffsToCreate = [
    { concept: 'Matrícula Anual - Inicial', amount: 300.0, type: TariffType.ONE_TIME, level: EducationalLevel.INITIAL },
    { concept: 'Matrícula Anual - Primaria', amount: 400.0, type: TariffType.ONE_TIME, level: EducationalLevel.PRIMARY },
    { concept: 'Matrícula Anual - Secundaria', amount: 500.0, type: TariffType.ONE_TIME, level: EducationalLevel.SECONDARY },
    { concept: 'Pensión Mensual Mayo - Inicial', amount: 350.0, type: TariffType.MONTHLY, level: EducationalLevel.INITIAL },
    { concept: 'Pensión Mensual Mayo - Primaria', amount: 450.0, type: TariffType.MONTHLY, level: EducationalLevel.PRIMARY },
    { concept: 'Pensión Mensual Mayo - Secundaria', amount: 550.0, type: TariffType.MONTHLY, level: EducationalLevel.SECONDARY },
    { concept: 'Pensión Mensual Junio - Inicial', amount: 350.0, type: TariffType.MONTHLY, level: EducationalLevel.INITIAL },
    { concept: 'Pensión Mensual Junio - Primaria', amount: 450.0, type: TariffType.MONTHLY, level: EducationalLevel.PRIMARY },
    { concept: 'Pensión Mensual Junio - Secundaria', amount: 550.0, type: TariffType.MONTHLY, level: EducationalLevel.SECONDARY },
    { concept: 'Constancia de Estudios', amount: 35.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY },
    { concept: 'Constancia de Estudios', amount: 35.0, type: TariffType.EXTRA, level: EducationalLevel.SECONDARY },
  ];

  const tariffIds: Record<string, string> = {};

  for (const item of tariffsToCreate) {
    let tariff = await prisma.tariff.findFirst({
      where: {
        concept: item.concept,
        level: item.level,
      },
    });

    if (!tariff) {
      tariff = await prisma.tariff.create({ data: item });
      console.log(`✅ Tarifa creada: ${tariff.concept} ($${tariff.amount})`);
    } else {
      console.log(`ℹ️ Tarifa ya existe: ${tariff.concept}`);
    }
    tariffIds[item.concept] = tariff.id;
  }

  // 2. Obtener estudiantes existentes
  const students = await prisma.student.findMany();
  if (students.length === 0) {
    console.log('⚠️ No hay estudiantes creados. Por favor ejecuta el seed de matrícula primero.');
    return;
  }

  console.log(`🌱 Generando cargos y pagos para ${students.length} estudiantes...`);

  // 3. Crear cargos y pagos para los estudiantes
  for (const student of students) {
    // Determinar qué tarifas corresponden al nivel del estudiante
    const isPrimary = student.level === EducationalLevel.PRIMARY;
    const isSecondary = student.level === EducationalLevel.SECONDARY;
    const isInitial = student.level === EducationalLevel.INITIAL;

    let matriculaTariffId = '';
    let pensionTariffId = '';
    let pensionJunioTariffId = '';

    if (isInitial) {
      matriculaTariffId = tariffIds['Matrícula Anual - Inicial'];
      pensionTariffId = tariffIds['Pensión Mensual Mayo - Inicial'];
      pensionJunioTariffId = tariffIds['Pensión Mensual Junio - Inicial'];
    } else if (isPrimary) {
      matriculaTariffId = tariffIds['Matrícula Anual - Primaria'];
      pensionTariffId = tariffIds['Pensión Mensual Mayo - Primaria'];
      pensionJunioTariffId = tariffIds['Pensión Mensual Junio - Primaria'];
    } else if (isSecondary) {
      matriculaTariffId = tariffIds['Matrícula Anual - Secundaria'];
      pensionTariffId = tariffIds['Pensión Mensual Mayo - Secundaria'];
      pensionJunioTariffId = tariffIds['Pensión Mensual Junio - Secundaria'];
    }

    if (!matriculaTariffId || !pensionTariffId) continue;

    // A. Cargo de Matrícula (Simular que ya lo pagó por completo en Marzo)
    const matriculaTariff = await prisma.tariff.findUnique({ where: { id: matriculaTariffId } });
    if (matriculaTariff) {
      const chargeMatricula = await prisma.charge.findFirst({
        where: { studentId: student.id, tariffId: matriculaTariffId },
      });

      if (!chargeMatricula) {
        const createdCharge = await prisma.charge.create({
          data: {
            studentId: student.id,
            tariffId: matriculaTariffId,
            originalAmount: matriculaTariff.amount,
            pendingAmount: 0.0,
            dueDate: new Date(2026, 2, 5), // Marzo 5
            status: 'PAID',
          },
        });
        await prisma.payment.create({
          data: {
            chargeId: createdCharge.id,
            studentId: student.id,
            totalAmount: matriculaTariff.amount,
            method: PaymentMethod.TRANSFER,
            timestamp: new Date(2026, 2, 4),
          },
        });
        console.log(`✅ Cargo & Pago de Matrícula creado para el estudiante: ${student.firstName}`);
      }
    }

    // B. Cargo de Pensión de Mayo (Simular pagos parciales o pendientes)
    const pensionTariff = await prisma.tariff.findUnique({ where: { id: pensionTariffId } });
    if (pensionTariff) {
      const chargePension = await prisma.charge.findFirst({
        where: { studentId: student.id, tariffId: pensionTariffId },
      });

      if (!chargePension) {
        // Para la mitad de los estudiantes, simular que ya pagaron, la otra mitad pendiente o parcial
        const isPaid = student.firstName.length % 2 === 0;
        const isPartial = student.firstName.length % 3 === 0 && !isPaid;

        const pendingAmount = isPaid ? 0.0 : isPartial ? pensionTariff.amount - 200.0 : pensionTariff.amount;
        const status = isPaid ? 'PAID' : isPartial ? 'PARTIAL' : 'PENDING';

        const createdCharge = await prisma.charge.create({
          data: {
            studentId: student.id,
            tariffId: pensionTariffId,
            originalAmount: pensionTariff.amount,
            pendingAmount,
            dueDate: new Date(2026, 4, 15), // Mayo 15
            status,
          },
        });

        if (isPaid) {
          await prisma.payment.create({
            data: {
              chargeId: createdCharge.id,
              studentId: student.id,
              totalAmount: pensionTariff.amount,
              method: PaymentMethod.CASH,
              timestamp: new Date(2026, 4, 10),
            },
          });
        } else if (isPartial) {
          await prisma.payment.create({
            data: {
              chargeId: createdCharge.id,
              studentId: student.id,
              totalAmount: 200.0,
              method: PaymentMethod.CARD,
              timestamp: new Date(2026, 4, 12),
            },
          });
        }
        console.log(`✅ Cargo de Pensión Mayo (${status}) creado para el estudiante: ${student.firstName}`);
      }
    }

    // C. Cargo de Pensión de Junio (100% Pendiente)
    const pensionJunioTariff = await prisma.tariff.findUnique({ where: { id: pensionJunioTariffId } });
    if (pensionJunioTariff) {
      const chargeJunio = await prisma.charge.findFirst({
        where: { studentId: student.id, tariffId: pensionJunioTariffId },
      });

      if (!chargeJunio) {
        await prisma.charge.create({
          data: {
            studentId: student.id,
            tariffId: pensionJunioTariffId,
            originalAmount: pensionJunioTariff.amount,
            pendingAmount: pensionJunioTariff.amount,
            dueDate: new Date(2026, 5, 10), // Junio 10
            status: 'PENDING',
          },
        });
        console.log(`✅ Cargo de Pensión Junio (PENDING) creado para el estudiante: ${student.firstName}`);
      }
    }
  }

  console.log('🎉 Inicialización de datos de tesorería completada con éxito.');
}

main()
  .catch((e) => {
    console.error('💥 Error al inicializar datos de tesorería:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
