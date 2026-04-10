import type {
  AuditLogEntry,
  AttendanceMark,
  BulletinPost,
  CashbookEntry,
  Charge,
  CollectionMonth,
  DiscountRule,
  Guardian,
  MockNotificationEvent,
  MorosityRow,
  NotificationPreference,
  Payment,
  Prospect,
  ScheduleRule,
  Section,
  Student,
  TariffConcept,
  TardinessRow,
  TreasuryConfig,
  VoucherUpload,
} from "./types";

// Section id "sec-full" has capacity 25 and 25 enrolled — for aforo demo
export const initialSections: Section[] = [
  {
    id: "sec-1a",
    grado: "1° primaria",
    seccion: "A",
    capacidad: 25,
    matriculados: 22,
  },
  {
    id: "sec-2a",
    grado: "2° primaria",
    seccion: "A",
    capacidad: 25,
    matriculados: 18,
  },
  {
    id: "sec-full",
    grado: "3° primaria",
    seccion: "A",
    capacidad: 25,
    matriculados: 25,
  },
  {
    id: "sec-ini",
    grado: "Inicial 5 años",
    seccion: "B",
    capacidad: 20,
    matriculados: 12,
  },
];

export const initialProspects: Prospect[] = [
  {
    id: "pro-1",
    nombre: "María Fernanda Quispe",
    celular: "959123456",
    gradoPostulado: "1° primaria",
    estado: "pendiente",
  },
  {
    id: "pro-2",
    nombre: "Diego Alarcón",
    celular: "954987321",
    gradoPostulado: "Inicial 5 años",
    estado: "entrevista",
  },
  {
    id: "pro-3",
    nombre: "Sofía Ramos",
    celular: "957111222",
    gradoPostulado: "2° primaria",
    estado: "aceptado",
  },
];

export const initialStudents: Student[] = [
  {
    id: "stu-1",
    codigo: "EST-2026-0042",
    nombres: "Lucía",
    apellidos: "Vargas Huamán",
    personal: {
      dni: "72345678",
      fechaNacimiento: "2018-03-12",
      sexo: "F",
    },
    salud: {
      grupoSanguineo: "O+",
      alergias: "Ninguna",
      seguroMedico: "SIS",
    },
    procedencia: {
      colegioAnterior: "I.E. Manuel González Prada",
      codigoModular: "1234567",
    },
    sectionId: "sec-1a",
    documentosMatricula: ["dni_estudiante.pdf", "compromiso_honor.pdf"],
  },
  {
    id: "stu-2",
    codigo: "EST-2026-0043",
    nombres: "Mateo",
    apellidos: "Condori Flores",
    personal: {
      dni: "73456789",
      fechaNacimiento: "2017-11-02",
      sexo: "M",
    },
    salud: {
      grupoSanguineo: "A+",
      alergias: "Polen (leve)",
      seguroMedico: "Rimac",
    },
    procedencia: {
      colegioAnterior: "I.E. Simón Bolívar",
      codigoModular: "7654321",
    },
    sectionId: "sec-2a",
    documentosMatricula: ["dni_estudiante.pdf", "contrato_servicios.pdf"],
  },
  {
    id: "stu-new",
    codigo: null,
    nombres: "Ana Paula",
    apellidos: "Medina López",
    personal: {
      dni: "74567890",
      fechaNacimiento: "2019-07-21",
      sexo: "F",
    },
    salud: {
      grupoSanguineo: "B+",
      alergias: "-",
      seguroMedico: "Pacífico",
    },
    procedencia: {
      colegioAnterior: "Cuna Jardín Los Rosales",
      codigoModular: "—",
    },
    sectionId: null,
    documentosMatricula: [],
  },
];

export const initialGuardians: Guardian[] = [
  {
    id: "gua-1",
    studentId: "stu-1",
    nombreCompleto: "Rosa Huamán Quispe",
    dni: "41234567",
    telefono: "959000111",
    parentesco: "Madre",
    responsableEconomico: true,
    deudaAniosAnterioresPendiente: false,
  },
  {
    id: "gua-2",
    studentId: "stu-1",
    nombreCompleto: "Carlos Vargas",
    dni: "40112233",
    telefono: "958444555",
    parentesco: "Padre",
    responsableEconomico: false,
    deudaAniosAnterioresPendiente: false,
  },
  {
    id: "gua-3",
    studentId: "stu-2",
    nombreCompleto: "Elena Flores",
    dni: "42345678",
    telefono: "957333222",
    parentesco: "Madre",
    responsableEconomico: true,
    deudaAniosAnterioresPendiente: true,
  },
  {
    id: "gua-4",
    studentId: "stu-new",
    nombreCompleto: "Miguel Medina",
    dni: "43456789",
    telefono: "956777888",
    parentesco: "Padre",
    responsableEconomico: true,
    deudaAniosAnterioresPendiente: false,
  },
];

export const initialTariffConcepts: TariffConcept[] = [
  {
    id: "t1",
    nombre: "Matrícula",
    tipo: "unico",
    montoBase: 420,
  },
  {
    id: "t2",
    nombre: "Cuota de ingreso",
    tipo: "unico",
    montoBase: 850,
  },
  {
    id: "t3",
    nombre: "Pensión mensual",
    tipo: "mensual",
    meses: [
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    montoBase: 380,
  },
];

export const initialDiscounts: DiscountRule[] = [
  {
    id: "d1",
    nombre: "Descuento por hermano",
    porcentaje: 10,
    aplicaA: "Pensión mensual (2° hijo)",
  },
  {
    id: "d2",
    nombre: "Beca excelencia académica",
    porcentaje: 25,
    aplicaA: "Pensión mensual",
  },
];

/** Cuotas de ejemplo: algunas vencidas para mora */
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
    comprobanteSunat: {
      json: `{"tipo":"01","serie":"B001","correlativo":42,"total":380}`,
      xml: `<?xml version="1.0"?><Invoice><Total>380.00</Total></Invoice>`,
    },
  },
];

export const initialCashbook: CashbookEntry[] = [
  {
    id: "cb-1",
    cobradorNombre: "Carmen Tesorería",
    metodo: "efectivo",
    monto: 380,
    hora: "09:15",
    concepto: "Pensión Marzo — Vargas",
  },
  {
    id: "cb-2",
    cobradorNombre: "Carmen Tesorería",
    metodo: "tarjeta",
    monto: 420,
    hora: "10:02",
    concepto: "Matrícula — Condori",
  },
];

export const initialVouchers: VoucherUpload[] = [
  {
    id: "vou-1",
    apoderadoNombre: "Rosa Huamán",
    estudianteCodigo: "EST-2026-0042",
    monto: 120,
    referencia: "OP 998877",
    status: "pendiente",
  },
];

export const initialSchedules: ScheduleRule[] = [
  {
    id: "sch-1",
    rol: "docente",
    horaEntrada: "07:30",
    horaSalida: "14:00",
    toleranciaMinutos: 10,
  },
  {
    id: "sch-2",
    rol: "administrativo",
    horaEntrada: "08:00",
    horaSalida: "17:00",
    toleranciaMinutos: 15,
  },
];

export const initialAttendance: AttendanceMark[] = [
  {
    id: "att-1",
    dni: "41234567",
    nombre: "Rosa Huamán (ejemplo)",
    tipo: "entrada",
    hora: "07:28",
    fecha: "2026-04-09",
  },
];

export const initialTardiness: TardinessRow[] = [
  {
    id: "tr-1",
    personalNombre: "Julio Paredes (docente)",
    diasTardanza: 2,
    faltas: 0,
    horasEfectivas: 118,
  },
  {
    id: "tr-2",
    personalNombre: "Luisa Rojas (admin.)",
    diasTardanza: 0,
    faltas: 1,
    horasEfectivas: 152,
  },
];

export const initialBulletins: BulletinPost[] = [
  {
    id: "bul-1",
    titulo: "Reunión de padres — abril",
    cuerpo:
      "Se convoca a padres de familia el 18 de abril a las 17:00 en el auditorio.",
    fecha: "2026-04-05",
    segmento: "general",
    adjuntos: [
      { nombre: "convocatoria.pdf", tipo: "pdf" },
      { nombre: "afiche.png", tipo: "imagen" },
    ],
  },
  {
    id: "bul-2",
    titulo: "Salida pedagógica Inicial",
    cuerpo: "Autorización y lista de útiles adjunta.",
    fecha: "2026-04-07",
    segmento: "inicial",
    adjuntos: [{ nombre: "autorizacion.pdf", tipo: "pdf" }],
  },
];

export const initialNotifPrefs: NotificationPreference[] = [
  { canal: "push", comunicados: true, recibos: true },
  { canal: "email", comunicados: true, recibos: false },
];

export const initialNotifEvents: MockNotificationEvent[] = [
  {
    id: "ne-1",
    tipo: "comunicado",
    mensaje: "Nuevo comunicado: Reunión de padres — abril",
    fecha: "2026-04-05T08:00:00",
    leido: false,
  },
  {
    id: "ne-2",
    tipo: "recibo",
    mensaje: "Su recibo de pago de abril ya está disponible",
    fecha: "2026-04-03T11:20:00",
    leido: true,
  },
];

export const initialAuditLog: AuditLogEntry[] = [
  {
    id: "aud-1",
    accion: "Pago registrado",
    usuario: "Carmen Tesorería",
    fechaHora: "2026-03-08T09:15:00",
    detalle: "S/ 380.00 — Efectivo — EST-2026-0042",
    huboEdicionPosterior: false,
  },
  {
    id: "aud-2",
    accion: "Pago editado",
    usuario: "Admin sistema",
    fechaHora: "2026-03-08T10:01:00",
    detalle: "Corrección de método de pago (audit trail)",
    huboEdicionPosterior: true,
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
