import { PrismaClient, EducationalLevel, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando la inicialización de datos académicos...');

  // 1. Crear Cursos
  const coursesToCreate = [
    { name: 'Matemática', description: 'Curso de razonamiento lógico, álgebra y geometría.' },
    { name: 'Comunicación', description: 'Curso de lenguaje, literatura y redacción.' },
    { name: 'Ciencia y Tecnología', description: 'Curso de biología, física, química y ecología.' },
    { name: 'Historia y Geografía', description: 'Curso de historia universal, nacional y geografía.' },
    { name: 'Inglés', description: 'Curso de idioma extranjero, gramática y conversación.' },
  ];

  const courseIds: Record<string, string> = {};

  for (const item of coursesToCreate) {
    let course = await prisma.course.findFirst({
      where: { name: item.name },
    });

    if (!course) {
      course = await prisma.course.create({ data: item });
      console.log(`✅ Curso creado: ${course.name}`);
    } else {
      console.log(`ℹ️ Curso ya existe: ${course.name}`);
    }
    courseIds[item.name] = course.id;
  }

  // 2. Crear Profesores (User + StaffProfile)
  const teachersToCreate = [
    {
      email: 'ana.martinez@school.edu',
      name: 'Prof. Ana Martínez',
      specialty: 'Matemática y Física',
      entryTime: '08:00',
      exitTime: '14:00',
    },
    {
      email: 'carlos.rodriguez@school.edu',
      name: 'Prof. Carlos Rodríguez',
      specialty: 'Comunicación y Literatura',
      entryTime: '08:00',
      exitTime: '15:00',
    },
    {
      email: 'sofia.lopez@school.edu',
      name: 'Prof. Sofía López',
      specialty: 'Biología y Química',
      entryTime: '08:00',
      exitTime: '14:30',
    },
    {
      email: 'javier.perez@school.edu',
      name: 'Prof. Javier Pérez',
      specialty: 'Historia y Ciencias Sociales',
      entryTime: '08:00',
      exitTime: '16:00',
    },
  ];

  const staffIds: string[] = [];

  for (const item of teachersToCreate) {
    let user = await prisma.user.findUnique({
      where: { email: item.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: item.email,
          name: item.name,
          role: Role.TEACHER,
          emailVerified: true,
        },
      });
      console.log(`✅ Usuario docente creado: ${user.name}`);
    } else {
      console.log(`ℹ️ Usuario docente ya existe: ${user.name}`);
    }

    let staff = await prisma.staffProfile.findUnique({
      where: { userId: user.id },
    });

    if (!staff) {
      staff = await prisma.staffProfile.create({
        data: {
          userId: user.id,
          specialty: item.specialty,
          entryTime: item.entryTime,
          exitTime: item.exitTime,
          gracePeriod: 5,
        },
      });
      console.log(`✅ Perfil de personal creado para: ${user.name}`);
    } else {
      console.log(`ℹ️ Perfil de personal ya existe para: ${user.name}`);
    }
    staffIds.push(staff.id);
  }

  // 3. Obtener Secciones
  const sections = await prisma.section.findMany();
  if (sections.length === 0) {
    console.log('⚠️ No hay secciones creadas. Por favor ejecuta el seed de secciones primero.');
    return;
  }

  // 4. Crear algunos Horarios de muestra
  console.log('🌱 Creando horarios de ejemplo...');
  const firstSection = sections[0]; // Ej. 1ro de Primaria A
  const secondSection = sections[sections.length - 1]; // Ej. 5to de Secundaria A

  const sampleSchedules = [
    // 1ro de Primaria A - Lunes
    {
      sectionId: firstSection.id,
      courseId: courseIds['Matemática'],
      staffId: staffIds[0], // Ana Martínez
      day: 1,
      startTime: '08:00',
      endTime: '09:30',
    },
    {
      sectionId: firstSection.id,
      courseId: courseIds['Comunicación'],
      staffId: staffIds[1], // Carlos Rodríguez
      day: 1,
      startTime: '09:45',
      endTime: '11:15',
    },
    // 1ro de Primaria A - Martes
    {
      sectionId: firstSection.id,
      courseId: courseIds['Ciencia y Tecnología'],
      staffId: staffIds[2], // Sofía López
      day: 2,
      startTime: '08:00',
      endTime: '09:30',
    },
    // 5to de Secundaria A - Lunes
    {
      sectionId: secondSection.id,
      courseId: courseIds['Historia y Geografía'],
      staffId: staffIds[3], // Javier Pérez
      day: 1,
      startTime: '11:30',
      endTime: '13:00',
    },
    {
      sectionId: secondSection.id,
      courseId: courseIds['Inglés'],
      staffId: staffIds[2], // Sofía López (para inglés / ciencias)
      day: 1,
      startTime: '13:15',
      endTime: '14:45',
    },
  ];

  for (const sched of sampleSchedules) {
    const existing = await prisma.schedule.findFirst({
      where: {
        sectionId: sched.sectionId,
        day: sched.day,
        startTime: sched.startTime,
      },
    });

    if (!existing) {
      await prisma.schedule.create({ data: sched });
      console.log(`✅ Horario asignado: Día ${sched.day}, ${sched.startTime} - ${sched.endTime}`);
    }
  }

  // 5. Crear Comunicaciones de Muestra
  console.log('🌱 Creando comunicados de ejemplo...');
  const sampleCommunications = [
    {
      title: 'Inicio del Año Escolar 2026',
      content: 'Estimada comunidad educativa, les damos la bienvenida al nuevo año académico. Las clases se iniciarán formalmente el lunes 2 de marzo.',
      category: 'Informativo',
      isVisible: true,
    },
    {
      title: 'Reunión General de Padres de Familia',
      content: 'Se convoca con carácter de URGENTE a todos los padres de familia a la primera asamblea general ordinaria este viernes a las 6:00 PM.',
      category: 'Urgente',
      isVisible: true,
    },
    {
      title: 'Feria Escolar de Ciencia y Tecnología',
      content: 'El departamento de ciencias invita a todos los estudiantes a participar del concurso de proyectos tecnológicos este mes.',
      category: 'Evento',
      isVisible: true,
    },
  ];

  for (const comm of sampleCommunications) {
    const existing = await prisma.communication.findFirst({
      where: { title: comm.title },
    });

    if (!existing) {
      await prisma.communication.create({ data: comm });
      console.log(`✅ Comunicado creado: ${comm.title}`);
    }
  }

  console.log('🎉 Inicialización de datos académicos completada con éxito.');
}

main()
  .catch((e) => {
    console.error('💥 Error al inicializar datos académicos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
