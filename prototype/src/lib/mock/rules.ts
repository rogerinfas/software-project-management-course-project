import type {
  Charge,
  FacialMark,
  SanctionRule,
  Section,
  SimulationResult,
  StaffMember,
} from "./types";
import { treasuryConfig } from "./fixtures";

// ----------------------------------------------------------------------------
// Validaciones genéricas
// ----------------------------------------------------------------------------

/** Validación de formato DNI peruano (8 dígitos). */
export function isValidDniFormat(dni: string): boolean {
  return /^\d{8}$/.test(dni.trim());
}

// ----------------------------------------------------------------------------
// Matrícula (M2)
// ----------------------------------------------------------------------------

export function sectionHasCapacity(section: Section): boolean {
  return section.matriculados < section.capacidad;
}

export function economicGuardianHasDebt(
  studentId: string,
  guardians: {
    studentId: string;
    responsableEconomico: boolean;
    deudaAniosAnterioresPendiente: boolean;
  }[],
): boolean {
  const g = guardians.find(
    (x) => x.studentId === studentId && x.responsableEconomico,
  );
  return g?.deudaAniosAnterioresPendiente ?? false;
}

/** B-2: valida aforo y deuda previa antes de formalizar matrícula. */
export function simulateEnrollment(
  section: Section,
  guardianHasDebt: boolean,
): SimulationResult {
  if (guardianHasDebt) {
    return {
      ok: false,
      message:
        "Matrícula bloqueada: el responsable económico tiene deuda pendiente de años anteriores.",
    };
  }
  if (!sectionHasCapacity(section)) {
    return {
      ok: false,
      message: "Sin cupo disponible: la sección alcanzó su capacidad máxima.",
    };
  }
  return {
    ok: true,
    message: "Validación OK — puede formalizar la matrícula.",
  };
}

// ----------------------------------------------------------------------------
// Tesorería (M4)
// ----------------------------------------------------------------------------

export function ordenPrelacionCharges(charges: Charge[]): Charge[] {
  return [...charges]
    .filter((c) => c.montoPendiente > 0)
    .sort(
      (a, b) =>
        new Date(a.fechaVencimiento).getTime() -
        new Date(b.fechaVencimiento).getTime(),
    );
}

export function diasMora(fechaVencimiento: string, hasta: string): number {
  const v = new Date(fechaVencimiento + "T12:00:00");
  const h = new Date(hasta + "T12:00:00");
  const diff = Math.floor((h.getTime() - v.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function interesMora(
  montoPendiente: number,
  fechaVencimiento: string,
  fechaReferencia: string,
): number {
  const d = diasMora(fechaVencimiento, fechaReferencia);
  if (d === 0) return 0;
  const tasa = treasuryConfig.tasaInteresDiariaPorcentaje / 100;
  return Math.round(montoPendiente * tasa * d * 100) / 100;
}

// ----------------------------------------------------------------------------
// Personal y Asistencia (M5)
// ----------------------------------------------------------------------------

/** E-2: calcula minutos de tardanza a partir de la hora de llegada y el horario. */
export function minutosTardanza(
  horaLlegadaHHMM: string,
  horaEntradaHHMM: string,
  toleranciaMinutos: number,
): number {
  const [lh, lm] = horaLlegadaHHMM.split(":").map(Number);
  const [eh, em] = horaEntradaHHMM.split(":").map(Number);
  const llegadaMin = lh * 60 + lm;
  const entradaMin = eh * 60 + em + toleranciaMinutos;
  const diff = llegadaMin - entradaMin;
  return diff > 0 ? diff : 0;
}

/** E-3: dado un total de minutos de tardanza, aplica las reglas vigentes por tramos. */
export function calcularMultaPorMinutos(
  totalMinutos: number,
  reglas: SanctionRule[],
): number {
  const activas = reglas
    .filter((r) => r.activa)
    .sort((a, b) => a.minutosDesde - b.minutosDesde);
  if (activas.length === 0 || totalMinutos <= 0) return 0;

  let total = 0;
  let restantes = totalMinutos;
  for (let i = 0; i < activas.length; i += 1) {
    const regla = activas[i];
    const siguiente = activas[i + 1];
    const topeMinutos = siguiente
      ? Math.max(0, siguiente.minutosDesde - regla.minutosDesde)
      : restantes;
    const aplicar = Math.min(restantes, topeMinutos);
    if (aplicar > 0) {
      total += aplicar * regla.multaPorMinuto;
      restantes -= aplicar;
    }
    if (restantes <= 0) break;
  }
  return Math.round(total * 100) / 100;
}

/** Totaliza minutos de tardanza por persona usando las marcaciones de entrada. */
export function consolidarTardanzas(
  staff: StaffMember[],
  marcas: FacialMark[],
): { staffId: string; minutos: number }[] {
  const acc = new Map<string, number>();
  for (const m of marcas) {
    if (m.tipo !== "entrada") continue;
    acc.set(m.staffId, (acc.get(m.staffId) ?? 0) + m.minutosTardanza);
  }
  return staff.map((s) => ({
    staffId: s.id,
    minutos: acc.get(s.id) ?? 0,
  }));
}
