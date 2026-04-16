import type {
  AdmissionRequirement,
  AdmissionStage,
  BulletinPost,
  Charge,
  Classroom,
  CollectionMonth,
  Course,
  DiscountRule,
  EnrollmentDocument,
  FacialMark,
  Guardian,
  InternalReceipt,
  MorosityRow,
  Payment,
  PrePayrollRow,
  Prospect,
  ProspectDocument,
  ProspectInteraction,
  SanctionRule,
  ScheduleSlot,
  Section,
  StaffMember,
  Student,
  TariffConcept,
  TeachingAssignment,
  TreasuryConfig,
} from "./types";

// ============================================================================
// Admisión (M1)
// ============================================================================

export const initialAdmissionStages: AdmissionStage[] = [
  {
    id: "stg-1",
    orden: 1,
    nombre: "Contacto inicial",
    obligatorio: true,
    descripcion: "Primer contacto vía celular o presencial.",
  },
  {
    id: "stg-2",
    orden: 2,
    nombre: "Entrevista familiar",
    obligatorio: true,
    descripcion: "Reunión con apoderados y postulante.",
  },
  {
    id: "stg-3",
    orden: 3,
    nombre: "Evaluación académica",
    obligatorio: true,
    descripcion: "Evaluación diagnóstica según nivel.",
  },
  {
    id: "stg-4",
    orden: 4,
    nombre: "Psicología",
    obligatorio: false,
    descripcion: "Entrevista con el área psicopedagógica.",
  },
  {
    id: "stg-5",
    orden: 5,
    nombre: "Aceptado",
    obligatorio: true,
    descripcion: "Listo para pasar a matrícula (M2).",
  },
];

export const initialAdmissionRequirements: AdmissionRequirement[] = [
  { id: "req-1", nivel: "inicial", nombreDocumento: "DNI del postulante", obligatorio: true },
  { id: "req-2", nivel: "inicial", nombreDocumento: "Partida de nacimiento", obligatorio: true },
  { id: "req-3", nivel: "inicial", nombreDocumento: "Carné de vacunación", obligatorio: false },
  { id: "req-4", nivel: "primaria", nombreDocumento: "DNI del postulante", obligatorio: true },
  { id: "req-5", nivel: "primaria", nombreDocumento: "Constancia de estudios", obligatorio: true },
  { id: "req-6", nivel: "primaria", nombreDocumento: "Libreta de notas anterior", obligatorio: true },
];

export const initialProspects: Prospect[] = [
  {
    id: "pro-1",
    nombre: "María Fernanda Quispe",
    celular: "959123456",
    gradoPostulado: "1° primaria",
    nivel: "primaria",
    currentStageId: "stg-2",
    prioridad: "alta",
    fechaRegistro: "2026-03-20",
  },
  {
    id: "pro-2",
    nombre: "Diego Alarcón",
    celular: "954987321",
    gradoPostulado: "Inicial 5 años",
    nivel: "inicial",
    currentStageId: "stg-3",
    prioridad: "media",
    fechaRegistro: "2026-03-22",
  },
  {
    id: "pro-3",
    nombre: "Sofía Ramos",
    celular: "957111222",
    gradoPostulado: "2° primaria",
    nivel: "primaria",
    currentStageId: "stg-5",
    prioridad: "alta",
    fechaRegistro: "2026-03-18",
  },
  {
    id: "pro-4",
    nombre: "Andrés Laqui",
    celular: "955444777",
    gradoPostulado: "3° primaria",
    nivel: "primaria",
    currentStageId: "stg-1",
    prioridad: "baja",
    fechaRegistro: "2026-04-02",
  },
];

export const initialProspectInteractions: ProspectInteraction[] = [
  {
    id: "int-1",
    prospectId: "pro-1",
    fecha: "2026-03-21T10:00:00",
    tipo: "llamada",
    resumen: "Se coordinó fecha de entrevista para el 25/03.",
    autor: "Admisión",
  },
  {
    id: "int-2",
    prospectId: "pro-1",
    fecha: "2026-03-25T15:30:00",
    tipo: "entrevista",
    resumen: "Apoderados conformes; pendiente evaluación académica.",
    autor: "Psicopedagogía",
  },
  {
    id: "int-3",
    prospectId: "pro-2",
    fecha: "2026-03-24T09:00:00",
    tipo: "correo",
    resumen: "Se enviaron requisitos para inicial 5 años.",
    autor: "Admisión",
  },
];

export const initialProspectDocuments: ProspectDocument[] = [
  {
    id: "doc-1",
    prospectId: "pro-1",
    nombreArchivo: "dni_maria.pdf",
    tipoDocumento: "DNI del postulante",
    estado: "validado",
    tamanoKb: 142,
    subidoEn: "2026-03-21",
  },
  {
    id: "doc-2",
    prospectId: "pro-1",
    nombreArchivo: "constancia_estudios.pdf",
    tipoDocumento: "Constancia de estudios",
    estado: "cargado",
    tamanoKb: 310,
    subidoEn: "2026-03-22",
  },
  {
    id: "doc-3",
    prospectId: "pro-2",
    nombreArchivo: "partida_diego.jpg",
    tipoDocumento: "Partida de nacimiento",
    estado: "observado",
    tamanoKb: 820,
    subidoEn: "2026-03-24",
  },
];

// ============================================================================
// Matrícula (M2)
// ============================================================================

export const initialSections: Section[] = [
  { id: "sec-1a", grado: "1° primaria", seccion: "A", nivel: "primaria", capacidad: 25, matriculados: 22 },
  { id: "sec-2a", grado: "2° primaria", seccion: "A", nivel: "primaria", capacidad: 25, matriculados: 18 },
  { id: "sec-full", grado: "3° primaria", seccion: "A", nivel: "primaria", capacidad: 25, matriculados: 25 },
  { id: "sec-ini5b", grado: "Inicial 5 años", seccion: "B", nivel: "inicial", capacidad: 20, matriculados: 12 },
];

export const initialStudents: Student[] = [
  {
    id: "stu-1",
    codigo: "EST-2026-0042",
    nombres: "Lucía",
    apellidos: "Vargas Huamán",
    dni: "72345678",
    fechaNacimiento: "2018-03-12",
    sexo: "F",
    salud: { grupoSanguineo: "O+", alergias: "Ninguna", seguroMedico: "SIS" },
    hermanosIds: ["stu-2"],
    sectionId: "sec-1a",
  },
  {
    id: "stu-2",
    codigo: "EST-2026-0043",
    nombres: "Mateo",
    apellidos: "Condori Flores",
    dni: "73456789",
    fechaNacimiento: "2017-11-02",
    sexo: "M",
    salud: { grupoSanguineo: "A+", alergias: "Polen (leve)", seguroMedico: "Rimac" },
    hermanosIds: ["stu-1"],
    sectionId: "sec-2a",
  },
  {
    id: "stu-new",
    codigo: null,
    nombres: "Ana Paula",
    apellidos: "Medina López",
    dni: "74567890",
    fechaNacimiento: "2019-07-21",
    sexo: "F",
    salud: {
      grupoSanguineo: "B+",
      alergias: "-",
      seguroMedico: "Pacífico",
      condicionesEspeciales: "Asma leve (inhalador)",
    },
    hermanosIds: [],
    sectionId: null,
    prospectId: "pro-3",
  },
];

export const initialGuardians: Guardian[] = [
  {
    id: "gua-1",
    studentId: "stu-1",
    nombreCompleto: "Rosa Huamán Quispe",
    dni: "41234567",
    telefono: "959000111",
    correo: "rosa.h@example.com",
    parentesco: "Madre",
    ocupacion: "Comerciante",
    responsableEconomico: true,
    deudaAniosAnterioresPendiente: false,
  },
  {
    id: "gua-2",
    studentId: "stu-1",
    nombreCompleto: "Carlos Vargas",
    dni: "40112233",
    telefono: "958444555",
    correo: "carlos.v@example.com",
    parentesco: "Padre",
    ocupacion: "Chofer",
    responsableEconomico: false,
    deudaAniosAnterioresPendiente: false,
  },
  {
    id: "gua-3",
    studentId: "stu-2",
    nombreCompleto: "Elena Flores",
    dni: "42345678",
    telefono: "957333222",
    correo: "elena.f@example.com",
    parentesco: "Madre",
    ocupacion: "Enfermera",
    responsableEconomico: true,
    deudaAniosAnterioresPendiente: true,
  },
  {
    id: "gua-4",
    studentId: "stu-new",
    nombreCompleto: "Miguel Medina",
    dni: "43456789",
    telefono: "956777888",
    correo: "miguel.m@example.com",
    parentesco: "Padre",
    ocupacion: "Ingeniero civil",
    responsableEconomico: true,
    deudaAniosAnterioresPendiente: false,
  },
];

export const initialEnrollmentDocuments: EnrollmentDocument[] = [
  { id: "edoc-1", studentId: "stu-1", tipo: "ficha_matricula", generadoEn: "2026-03-01", estado: "emitido" },
  { id: "edoc-2", studentId: "stu-1", tipo: "contrato_servicios", generadoEn: "2026-03-01", estado: "emitido" },
  { id: "edoc-3", studentId: "stu-2", tipo: "ficha_matricula", generadoEn: "2026-03-02", estado: "emitido" },
];

// ============================================================================
// Académica y Comunicación (M3)
// ============================================================================

export const initialCourses: Course[] = [
  { id: "crs-1", grado: "1° primaria", nombre: "Comunicación", horasSemanales: 6 },
  { id: "crs-2", grado: "1° primaria", nombre: "Matemática", horasSemanales: 6 },
  { id: "crs-3", grado: "1° primaria", nombre: "Ciencia y Tecnología", horasSemanales: 3 },
  { id: "crs-4", grado: "2° primaria", nombre: "Comunicación", horasSemanales: 6 },
  { id: "crs-5", grado: "2° primaria", nombre: "Matemática", horasSemanales: 6 },
  { id: "crs-6", grado: "Inicial 5 años", nombre: "Psicomotricidad", horasSemanales: 4 },
];

export const initialTeachingAssignments: TeachingAssignment[] = [
  { id: "ta-1", courseId: "crs-1", teacherId: "sta-1", sectionId: "sec-1a" },
  { id: "ta-2", courseId: "crs-2", teacherId: "sta-2", sectionId: "sec-1a" },
  { id: "ta-3", courseId: "crs-3", teacherId: "sta-2", sectionId: "sec-1a" },
  { id: "ta-4", courseId: "crs-4", teacherId: "sta-1", sectionId: "sec-2a" },
  { id: "ta-5", courseId: "crs-5", teacherId: "sta-3", sectionId: "sec-2a" },
  { id: "ta-6", courseId: "crs-6", teacherId: "sta-4", sectionId: "sec-ini5b" },
];

export const initialClassrooms: Classroom[] = [
  { id: "room-1", nombre: "Aula 101", capacidad: 30, piso: 1 },
  { id: "room-2", nombre: "Aula 102", capacidad: 30, piso: 1 },
  { id: "room-3", nombre: "Aula 201", capacidad: 25, piso: 2 },
  { id: "room-4", nombre: "Sala de Inicial", capacidad: 20, piso: 1 },
];

export const initialScheduleSlots: ScheduleSlot[] = [
  {
    id: "slot-1",
    dia: "lunes",
    horaInicio: "08:00",
    horaFin: "09:30",
    courseId: "crs-1",
    teacherId: "sta-1",
    sectionId: "sec-1a",
    classroomId: "room-1",
  },
  {
    id: "slot-2",
    dia: "lunes",
    horaInicio: "09:45",
    horaFin: "11:15",
    courseId: "crs-2",
    teacherId: "sta-2",
    sectionId: "sec-1a",
    classroomId: "room-1",
  },
  {
    id: "slot-3",
    dia: "martes",
    horaInicio: "08:00",
    horaFin: "09:30",
    courseId: "crs-4",
    teacherId: "sta-1",
    sectionId: "sec-2a",
    classroomId: "room-2",
  },
  {
    id: "slot-4",
    dia: "miercoles",
    horaInicio: "08:00",
    horaFin: "09:30",
    courseId: "crs-6",
    teacherId: "sta-4",
    sectionId: "sec-ini5b",
    classroomId: "room-4",
  },
  {
    id: "slot-5",
    dia: "jueves",
    horaInicio: "10:00",
    horaFin: "11:30",
    courseId: "crs-5",
    teacherId: "sta-3",
    sectionId: "sec-2a",
    classroomId: "room-2",
  },
];

export const initialBulletins: BulletinPost[] = [
  {
    id: "bul-1",
    titulo: "Reunión general de padres — abril",
    cuerpo:
      "Se convoca a los padres de familia el 18 de abril a las 17:00 horas en el auditorio principal para la entrega de información del primer bimestre.",
    categoria: "administrativo",
    visibilidad: "publico",
    publicadoEn: "2026-04-05",
    vigenteHasta: "2026-04-18",
    autor: "Dirección",
  },
  {
    id: "bul-2",
    titulo: "Salida pedagógica de Inicial al Parque de la Identidad",
    cuerpo:
      "Las docentes de Inicial 5 años comunican la salida pedagógica del 12 de abril. Se adjunta la autorización y la lista de materiales.",
    categoria: "academico",
    visibilidad: "publico",
    publicadoEn: "2026-04-07",
    vigenteHasta: "2026-04-12",
    autor: "Coordinación Inicial",
  },
  {
    id: "bul-3",
    titulo: "Aniversario del colegio — semana cultural",
    cuerpo:
      "Del 6 al 10 de mayo celebraremos la semana cultural por el aniversario institucional con actividades por grado.",
    categoria: "evento",
    visibilidad: "publico",
    publicadoEn: "2026-04-10",
    vigenteHasta: "2026-05-10",
    autor: "Dirección",
  },
  {
    id: "bul-4",
    titulo: "Reunión interna de coordinadores",
    cuerpo:
      "Reunión de coordinadores el viernes 11 de abril a las 15:30 horas en la sala de profesores.",
    categoria: "administrativo",
    visibilidad: "interno",
    publicadoEn: "2026-04-08",
    vigenteHasta: "2026-04-11",
    autor: "Dirección",
  },
];

// ============================================================================
// Tesorería (M4)
// ============================================================================

export const initialTariffConcepts: TariffConcept[] = [
  { id: "t1", nombre: "Inscripción por admisión", tipo: "unico", montoBase: 150, aplicaNivel: "todos" },
  { id: "t2", nombre: "Matrícula", tipo: "unico", montoBase: 420, aplicaNivel: "todos" },
  { id: "t3", nombre: "Cuota de ingreso", tipo: "unico", montoBase: 850, aplicaNivel: "todos" },
  {
    id: "t4",
    nombre: "Pensión mensual — primaria",
    tipo: "mensual",
    meses: [
      "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
      "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ],
    montoBase: 380,
    aplicaNivel: "primaria",
  },
  {
    id: "t5",
    nombre: "Pensión mensual — inicial",
    tipo: "mensual",
    meses: [
      "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
      "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ],
    montoBase: 320,
    aplicaNivel: "inicial",
  },
  { id: "t6", nombre: "Material educativo (extra)", tipo: "extra", montoBase: 180, aplicaNivel: "todos" },
];

export const initialDiscounts: DiscountRule[] = [
  { id: "d1", nombre: "Descuento por hermano", porcentaje: 10, aplicaA: "Pensión mensual (2° hijo)" },
  { id: "d2", nombre: "Beca excelencia académica", porcentaje: 25, aplicaA: "Pensión mensual" },
];

export const initialCharges: Charge[] = [
  {
    id: "chg-1",
    studentId: "stu-1",
    concepto: "Pensión Marzo 2026",
    montoOriginal: 380,
    montoPendiente: 0,
    fechaVencimiento: "2026-03-10",
    status: "pagado",
  },
  {
    id: "chg-2",
    studentId: "stu-1",
    concepto: "Pensión Abril 2026",
    montoOriginal: 380,
    montoPendiente: 120,
    fechaVencimiento: "2026-04-10",
    status: "pagado_parcial",
  },
  {
    id: "chg-3",
    studentId: "stu-2",
    concepto: "Pensión Marzo 2026",
    montoOriginal: 380,
    montoPendiente: 380,
    fechaVencimiento: "2026-03-10",
    status: "pendiente",
  },
  {
    id: "chg-4",
    studentId: "stu-2",
    concepto: "Cuota de ingreso",
    montoOriginal: 850,
    montoPendiente: 850,
    fechaVencimiento: "2026-02-01",
    status: "pendiente",
  },
];

export const initialPayments: Payment[] = [
  {
    id: "pay-1",
    studentId: "stu-1",
    allocations: [{ chargeId: "chg-1", monto: 380 }],
    montoTotal: 380,
    metodo: "efectivo",
    cobradorId: "usr-1",
    cobradorNombre: "Carmen Tesorería",
    fechaHora: "2026-03-08T09:15:00",
  },
];

export const initialReceipts: InternalReceipt[] = [
  {
    id: "rec-1",
    paymentId: "pay-1",
    serie: "R-2026",
    numero: 1001,
    montoTotal: 380,
    emitidoEn: "2026-03-08T09:16:00",
    estudianteNombre: "Lucía Vargas Huamán",
    concepto: "Pensión Marzo 2026",
  },
];

export const treasuryConfig: TreasuryConfig = {
  tasaInteresDiariaPorcentaje: 0.05,
};

export const initialMorosity: MorosityRow[] = [
  {
    apoderado: "Elena Flores",
    estudiante: "Mateo Condori",
    grado: "2° primaria",
    seccion: "A",
    mesesAdeudados: 2,
    montoTotal: 1610,
  },
];

export const initialCollection: CollectionMonth[] = [
  { mes: "Marzo", proyectado: 45_200, recaudado: 42_100 },
  { mes: "Abril", proyectado: 45_200, recaudado: 38_400 },
];

// ============================================================================
// Personal y Asistencia (M5)
// ============================================================================

export const initialStaff: StaffMember[] = [
  {
    id: "sta-1",
    nombres: "Julio",
    apellidos: "Paredes Aguirre",
    dni: "40111111",
    rol: "docente",
    especialidad: "Comunicación — primaria",
    horaEntrada: "07:30",
    horaSalida: "14:00",
    toleranciaMinutos: 10,
    fotoReferencia: "sta-1.jpg",
  },
  {
    id: "sta-2",
    nombres: "Diana",
    apellidos: "Chávez Rojas",
    dni: "40222222",
    rol: "docente",
    especialidad: "Matemática — primaria",
    horaEntrada: "07:30",
    horaSalida: "14:00",
    toleranciaMinutos: 10,
    fotoReferencia: "sta-2.jpg",
  },
  {
    id: "sta-3",
    nombres: "Luis",
    apellidos: "Mamani Quispe",
    dni: "40333333",
    rol: "docente",
    especialidad: "Matemática — primaria",
    horaEntrada: "07:30",
    horaSalida: "14:00",
    toleranciaMinutos: 10,
    fotoReferencia: "sta-3.jpg",
  },
  {
    id: "sta-4",
    nombres: "Patricia",
    apellidos: "Ayala Zegarra",
    dni: "40444444",
    rol: "docente",
    especialidad: "Educación inicial",
    horaEntrada: "07:30",
    horaSalida: "13:00",
    toleranciaMinutos: 10,
    fotoReferencia: "sta-4.jpg",
  },
  {
    id: "sta-5",
    nombres: "Luisa",
    apellidos: "Rojas Paniagua",
    dni: "40555555",
    rol: "administrativo",
    especialidad: "Secretaría académica",
    horaEntrada: "08:00",
    horaSalida: "17:00",
    toleranciaMinutos: 15,
    fotoReferencia: "sta-5.jpg",
  },
  {
    id: "sta-6",
    nombres: "Carmen",
    apellidos: "Tesorería Delgado",
    dni: "40666666",
    rol: "administrativo",
    especialidad: "Tesorería",
    horaEntrada: "08:00",
    horaSalida: "17:00",
    toleranciaMinutos: 15,
    fotoReferencia: "sta-6.jpg",
  },
];

export const initialFacialMarks: FacialMark[] = [
  { id: "fm-1", staffId: "sta-1", tipo: "entrada", fecha: "2026-04-09", hora: "07:28", confianza: 97, minutosTardanza: 0 },
  { id: "fm-2", staffId: "sta-2", tipo: "entrada", fecha: "2026-04-09", hora: "07:45", confianza: 94, minutosTardanza: 5 },
  { id: "fm-3", staffId: "sta-5", tipo: "entrada", fecha: "2026-04-09", hora: "08:20", confianza: 96, minutosTardanza: 5 },
];

export const initialSanctionRules: SanctionRule[] = [
  { id: "sr-1", nombre: "Descuento estándar", minutosDesde: 1, multaPorMinuto: 0.5, activa: true },
  { id: "sr-2", nombre: "Descuento severo (tardanza > 30 min)", minutosDesde: 31, multaPorMinuto: 1.5, activa: true },
];

export const initialPrePayroll: PrePayrollRow[] = [
  {
    id: "pr-1",
    staffId: "sta-1",
    staffNombre: "Julio Paredes Aguirre",
    rol: "docente",
    diasLaborados: 20,
    minutosTardanza: 12,
    faltas: 0,
    horasEfectivas: 130,
    descuentoMulta: 6,
    sueldoBase: 2800,
    neto: 2794,
  },
  {
    id: "pr-2",
    staffId: "sta-2",
    staffNombre: "Diana Chávez Rojas",
    rol: "docente",
    diasLaborados: 20,
    minutosTardanza: 35,
    faltas: 0,
    horasEfectivas: 128,
    descuentoMulta: 25.5,
    sueldoBase: 2800,
    neto: 2774.5,
  },
  {
    id: "pr-3",
    staffId: "sta-5",
    staffNombre: "Luisa Rojas Paniagua",
    rol: "administrativo",
    diasLaborados: 20,
    minutosTardanza: 5,
    faltas: 1,
    horasEfectivas: 152,
    descuentoMulta: 2.5,
    sueldoBase: 2400,
    neto: 2317.5,
  },
];
