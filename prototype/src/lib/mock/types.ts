// Tipos del modelo del prototipo. Alineados 1:1 con el EDT (alcance.md).

// ============================================================================
// Compartidos
// ============================================================================

export type NivelEducativo = "inicial" | "primaria";

export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia";

export type ChargeStatus = "pendiente" | "pagado_parcial" | "pagado";

export type BulletinCategory =
  | "academico"
  | "administrativo"
  | "evento"
  | "urgencia";

export type BulletinVisibility = "publico" | "interno";

// ============================================================================
// MÓDULO 1 — Admisión (CRM)
// ============================================================================

/** A-1. Etapa configurable del proceso de admisión. */
export interface AdmissionStage {
  id: string;
  orden: number;
  nombre: string;
  obligatorio: boolean;
  descripcion?: string;
}

/** A-1. Requisito/documento obligatorio por nivel educativo. */
export interface AdmissionRequirement {
  id: string;
  nivel: NivelEducativo;
  nombreDocumento: string;
  obligatorio: boolean;
}

export type ProspectPrioridad = "alta" | "media" | "baja";

/** A-2. Prospecto (postulante en el pipeline). */
export interface Prospect {
  id: string;
  nombre: string;
  celular: string;
  gradoPostulado: string;
  nivel: NivelEducativo;
  /** Etapa actual en el pipeline (AdmissionStage.id). */
  currentStageId: string;
  prioridad: ProspectPrioridad;
  fechaRegistro: string;
}

/** A-2. Interacción registrada con un prospecto. */
export interface ProspectInteraction {
  id: string;
  prospectId: string;
  fecha: string;
  tipo: "llamada" | "correo" | "entrevista" | "nota";
  resumen: string;
  autor: string;
}

export type DocumentValidationStatus =
  | "cargado"
  | "validado"
  | "observado";

/** A-3. Documento del prospecto en el repositorio. */
export interface ProspectDocument {
  id: string;
  prospectId: string;
  nombreArchivo: string;
  tipoDocumento: string;
  estado: DocumentValidationStatus;
  tamanoKb: number;
  subidoEn: string;
}

// ============================================================================
// MÓDULO 2 — Matrícula
// ============================================================================

export interface Section {
  id: string;
  grado: string;
  seccion: string;
  nivel: NivelEducativo;
  capacidad: number;
  matriculados: number;
}

export interface StudentHealth {
  grupoSanguineo: string;
  alergias: string;
  seguroMedico: string;
  condicionesEspeciales?: string;
}

export interface Student {
  id: string;
  codigo: string | null;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  sexo: "M" | "F";
  salud: StudentHealth;
  /** B-1: hermanos matriculados en la institución. */
  hermanosIds: string[];
  sectionId: string | null;
  /** Etapa actual si todavía es postulante. */
  prospectId?: string;
}

export interface Guardian {
  id: string;
  studentId: string;
  nombreCompleto: string;
  dni: string;
  telefono: string;
  correo: string;
  parentesco: string;
  ocupacion: string;
  responsableEconomico: boolean;
  /** Bloquea matrícula si es el responsable económico. */
  deudaAniosAnterioresPendiente: boolean;
}

/** B-3. Documento emitido de matrícula. */
export interface EnrollmentDocument {
  id: string;
  studentId: string;
  tipo: "ficha_matricula" | "contrato_servicios";
  generadoEn: string;
  estado: "borrador" | "emitido";
}

// ============================================================================
// MÓDULO 3 — Académica y Comunicación
// ============================================================================

/** C-1. Curso de la malla curricular. */
export interface Course {
  id: string;
  grado: string;
  nombre: string;
  horasSemanales: number;
}

/** C-1. Carga docente (curso asignado a una sección con un profesor). */
export interface TeachingAssignment {
  id: string;
  courseId: string;
  teacherId: string;
  sectionId: string;
}

/** C-2. Aula física. */
export interface Classroom {
  id: string;
  nombre: string;
  capacidad: number;
  piso: number;
}

export type WeekDay =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes";

/** C-2. Bloque horario en el calendario de clases. */
export interface ScheduleSlot {
  id: string;
  dia: WeekDay;
  horaInicio: string;
  horaFin: string;
  courseId: string;
  teacherId: string;
  sectionId: string;
  classroomId: string;
}

/** C-3. Comunicado publicado en el panel. */
export interface BulletinPost {
  id: string;
  titulo: string;
  cuerpo: string;
  categoria: BulletinCategory;
  visibilidad: BulletinVisibility;
  publicadoEn: string;
  vigenteHasta: string;
  autor: string;
}

// ============================================================================
// MÓDULO 4 — Tesorería
// ============================================================================

export interface TariffConcept {
  id: string;
  nombre: string;
  tipo: "unico" | "mensual" | "extra";
  meses?: string[];
  montoBase: number;
  aplicaNivel: NivelEducativo | "todos";
}

export interface DiscountRule {
  id: string;
  nombre: string;
  porcentaje: number;
  aplicaA: string;
}

export interface Charge {
  id: string;
  studentId: string;
  concepto: string;
  montoOriginal: number;
  montoPendiente: number;
  fechaVencimiento: string;
  status: ChargeStatus;
}

export interface PaymentAllocation {
  chargeId: string;
  monto: number;
}

export interface Payment {
  id: string;
  studentId: string;
  allocations: PaymentAllocation[];
  montoTotal: number;
  metodo: PaymentMethod;
  cobradorId: string;
  cobradorNombre: string;
  fechaHora: string;
}

/** D-3. Recibo interno generado. */
export interface InternalReceipt {
  id: string;
  paymentId: string;
  serie: string;
  numero: number;
  montoTotal: number;
  emitidoEn: string;
  estudianteNombre: string;
  concepto: string;
}

export interface MorosityRow {
  apoderado: string;
  estudiante: string;
  grado: string;
  seccion: string;
  mesesAdeudados: number;
  montoTotal: number;
}

export interface CollectionMonth {
  mes: string;
  proyectado: number;
  recaudado: number;
}

export interface TreasuryConfig {
  tasaInteresDiariaPorcentaje: number;
}

// ============================================================================
// MÓDULO 5 — Personal y Asistencia
// ============================================================================

export type StaffRole = "docente" | "administrativo" | "directivo";

/** E-1. Miembro del personal. */
export interface StaffMember {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  rol: StaffRole;
  especialidad: string;
  horaEntrada: string;
  horaSalida: string;
  toleranciaMinutos: number;
  /** Referencia a una foto de muestra para el reconocimiento facial (mock). */
  fotoReferencia: string;
}

export type FacialMarkType = "entrada" | "salida";

/** E-2. Marcación biométrica por reconocimiento facial. */
export interface FacialMark {
  id: string;
  staffId: string;
  tipo: FacialMarkType;
  fecha: string;
  hora: string;
  /** Confianza del match facial (0-100). */
  confianza: number;
  /** Minutos de tardanza respecto al horario del personal (0 si llegó a tiempo). */
  minutosTardanza: number;
}

/** E-3. Regla de sanción por minuto de tardanza acumulado. */
export interface SanctionRule {
  id: string;
  nombre: string;
  minutosDesde: number;
  multaPorMinuto: number;
  activa: boolean;
}

/** E-4. Fila consolidada de pre-planilla. */
export interface PrePayrollRow {
  id: string;
  staffId: string;
  staffNombre: string;
  rol: StaffRole;
  diasLaborados: number;
  minutosTardanza: number;
  faltas: number;
  horasEfectivas: number;
  descuentoMulta: number;
  sueldoBase: number;
  neto: number;
}

// ============================================================================
// Utilidades
// ============================================================================

export type SimulationResult =
  | { ok: true; message: string }
  | { ok: false; message: string };
