import type { Charge, Section, SimulationResult } from "./types";
import { treasuryConfig } from "./fixtures";

/** Validación formato DNI peruano (8 dígitos) */
export function isValidDniFormat(dni: string): boolean {
  return /^\d{8}$/.test(dni.trim());
}

export function sectionHasCapacity(section: Section): boolean {
  return section.matriculados < section.capacidad;
}

export function economicGuardianHasDebt(
  studentId: string,
  guardians: { studentId: string; responsableEconomico: boolean; deudaAniosAnterioresPendiente: boolean }[],
): boolean {
  const g = guardians.find(
    (x) => x.studentId === studentId && x.responsableEconomico,
  );
  return g?.deudaAniosAnterioresPendiente ?? false;
}

export function ordenPrelacionCharges(charges: Charge[]): Charge[] {
  return [...charges]
    .filter((c) => c.montoPendiente > 0)
    .sort(
      (a, b) =>
        new Date(a.fechaVencimiento).getTime() -
        new Date(b.fechaVencimiento).getTime(),
    );
}

/** Días de mora desde vencimiento hasta `hasta` (fecha ISO yyyy-mm-dd) */
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

export function simulateMatricula(
  section: Section,
  guardianHasDebt: boolean,
): SimulationResult {
  if (guardianHasDebt) {
    return {
      ok: false,
      message:
        "Matrícula bloqueada: el responsable económico tiene deudas pendientes de años anteriores.",
    };
  }
  if (!sectionHasCapacity(section)) {
    return {
      ok: false,
      message:
        "No hay cupo: el aula alcanzó su capacidad máxima. No se puede matricular.",
    };
  }
  return {
    ok: true,
    message: "Validación OK. Puede completar la matrícula (prototipo).",
  };
}
