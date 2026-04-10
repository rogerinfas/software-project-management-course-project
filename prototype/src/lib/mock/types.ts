export type ProspectStatus =
  | "pendiente"
  | "entrevista"
  | "aceptado"
  | "retirado";

export type BulletinSegment = "inicial" | "primaria" | "general";

export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia";

export type VoucherStatus = "pendiente" | "aprobado" | "rechazado";

export type ChargeStatus = "pendiente" | "pagado_parcial" | "pagado";

export interface Prospect {
  id: string;
  nombre: string;
  celular: string;
  gradoPostulado: string;
  estado: ProspectStatus;
}

export interface StudentPersonal {
  dni: string;
  fechaNacimiento: string;
  sexo: "M" | "F";
}

export interface StudentHealth {
  grupoSanguineo: string;
  alergias: string;
  seguroMedico: string;
}

export interface StudentOrigin {
  colegioAnterior: string;
  codigoModular: string;
}

export interface Student {
  id: string;
  codigo: string | null;
  nombres: string;
  apellidos: string;
  personal: StudentPersonal;
  salud: StudentHealth;
  procedencia: StudentOrigin;
  sectionId: string | null;
  documentosMatricula: string[];
}

export interface Guardian {
  id: string;
  studentId: string;
  nombreCompleto: string;
  dni: string;
  telefono: string;
  parentesco: string;
  responsableEconomico: boolean;
  /** Deuda pendiente de años anteriores (bloquea matrícula si es responsable) */
  deudaAniosAnterioresPendiente: boolean;
}

export interface Section {
  id: string;
  grado: string;
  seccion: string;
  capacidad: number;
  matriculados: number;
}

export interface TariffConcept {
  id: string;
  nombre: string;
  tipo: "unico" | "mensual";
  meses?: string[];
  montoBase: number;
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
  comprobanteSunat?: { json: string; xml: string };
}

export interface CashbookEntry {
  id: string;
  cobradorNombre: string;
  metodo: PaymentMethod;
  monto: number;
  hora: string;
  concepto: string;
}

export interface VoucherUpload {
  id: string;
  apoderadoNombre: string;
  estudianteCodigo: string;
  monto: number;
  referencia: string;
  status: VoucherStatus;
}

export interface ScheduleRule {
  id: string;
  rol: "docente" | "administrativo";
  horaEntrada: string;
  horaSalida: string;
  toleranciaMinutos: number;
}

export interface AttendanceMark {
  id: string;
  dni: string;
  nombre: string;
  tipo: "entrada" | "salida";
  hora: string;
  fecha: string;
}

export interface TardinessRow {
  id: string;
  personalNombre: string;
  diasTardanza: number;
  faltas: number;
  horasEfectivas: number;
}

export interface BulletinPost {
  id: string;
  titulo: string;
  cuerpo: string;
  fecha: string;
  segmento: BulletinSegment;
  adjuntos: { nombre: string; tipo: "pdf" | "imagen" }[];
}

export interface NotificationPreference {
  canal: "push" | "email";
  comunicados: boolean;
  recibos: boolean;
}

export interface MockNotificationEvent {
  id: string;
  tipo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export interface AuditLogEntry {
  id: string;
  accion: string;
  usuario: string;
  fechaHora: string;
  detalle: string;
  huboEdicionPosterior: boolean;
}

export interface TreasuryConfig {
  tasaInteresDiariaPorcentaje: number;
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

export type SimulationResult =
  | { ok: true; message: string }
  | { ok: false; message: string };
