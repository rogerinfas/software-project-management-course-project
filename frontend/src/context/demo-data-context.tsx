"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  initialAttendance,
  initialAuditLog,
  initialBulletins,
  initialCashbook,
  initialCharges,
  initialCollection,
  initialDiscounts,
  initialGuardians,
  initialMorosity,
  initialNotifEvents,
  initialNotifPrefs,
  initialPayments,
  initialProspects,
  initialSchedules,
  initialSections,
  initialStudents,
  initialTardiness,
  initialTariffConcepts,
  initialVouchers,
  treasuryConfig,
} from "@/lib/mock/fixtures";
import {
  economicGuardianHasDebt,
  isValidDniFormat,
  ordenPrelacionCharges,
  simulateMatricula,
} from "@/lib/mock/rules";
import type {
  AttendanceMark,
  AuditLogEntry,
  BulletinPost,
  BulletinSegment,
  CashbookEntry,
  Charge,
  Guardian,
  Payment,
  PaymentAllocation,
  PaymentMethod,
  Prospect,
  ProspectStatus,
  Section,
  Student,
  VoucherStatus,
} from "@/lib/mock/types";

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

type DemoDataState = {
  sections: Section[];
  prospects: Prospect[];
  students: Student[];
  guardians: Guardian[];
  tariffConcepts: typeof initialTariffConcepts;
  discounts: typeof initialDiscounts;
  charges: Charge[];
  payments: Payment[];
  cashbook: CashbookEntry[];
  vouchers: typeof initialVouchers;
  schedules: typeof initialSchedules;
  attendance: AttendanceMark[];
  tardiness: typeof initialTardiness;
  bulletins: BulletinPost[];
  notifPrefs: typeof initialNotifPrefs;
  notifEvents: typeof initialNotifEvents;
  auditLog: AuditLogEntry[];
  collection: typeof initialCollection;
  morosity: typeof initialMorosity;
  massDebtGeneratedAt: string | null;
};

const initialDemoState = (): DemoDataState => ({
  sections: structuredClone(initialSections),
  prospects: structuredClone(initialProspects),
  students: structuredClone(initialStudents),
  guardians: structuredClone(initialGuardians),
  tariffConcepts: structuredClone(initialTariffConcepts),
  discounts: structuredClone(initialDiscounts),
  charges: structuredClone(initialCharges),
  payments: structuredClone(initialPayments),
  cashbook: structuredClone(initialCashbook),
  vouchers: structuredClone(initialVouchers),
  schedules: structuredClone(initialSchedules),
  attendance: structuredClone(initialAttendance),
  tardiness: structuredClone(initialTardiness),
  bulletins: structuredClone(initialBulletins),
  notifPrefs: structuredClone(initialNotifPrefs),
  notifEvents: structuredClone(initialNotifEvents),
  auditLog: structuredClone(initialAuditLog),
  collection: structuredClone(initialCollection),
  morosity: structuredClone(initialMorosity),
  massDebtGeneratedAt: null,
});

type DemoDataContextValue = DemoDataState & {
  treasuryDailyRatePercent: number;
  /** Matrícula: valida aforo y deuda del responsable */
  tryEnroll: (studentId: string, sectionId: string) => void;
  addProspect: (p: Omit<Prospect, "id">) => void;
  updateProspectStatus: (id: string, estado: ProspectStatus) => void;
  updateStudentDni: (studentId: string, dni: string) => boolean;
  setGuardianResponsible: (guardianId: string) => void;
  generateMassPensionDebt: () => void;
  registerWindowPayment: (
    studentId: string,
    monto: number,
    metodo: PaymentMethod,
  ) => void;
  setVoucherStatus: (id: string, status: VoucherStatus) => void;
  addAttendanceMark: (dni: string, nombre: string) => void;
  addBulletin: (
    titulo: string,
    cuerpo: string,
    segmento: BulletinSegment,
  ) => void;
  simulateDebtAlerts: () => void;
  addAudit: (entry: Omit<AuditLogEntry, "id">) => void;
};

const DemoDataContext = React.createContext<DemoDataContextValue | null>(
  null,
);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DemoDataState>(initialDemoState);

  const tryEnroll = React.useCallback(
    (studentId: string, sectionId: string) => {
      setState((prev) => {
        const section = prev.sections.find((s) => s.id === sectionId);
        if (!section) {
          queueMicrotask(() => toast.error("Sección no encontrada."));
          return prev;
        }
        const debt = economicGuardianHasDebt(studentId, prev.guardians);
        const sim = simulateMatricula(section, debt);
        if (!sim.ok) {
          queueMicrotask(() => toast.error(sim.message));
          return prev;
        }
        const code = `EST-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
        const students = prev.students.map((s) =>
          s.id === studentId
            ? {
                ...s,
                codigo: code,
                sectionId,
                documentosMatricula: [
                  ...s.documentosMatricula,
                  "dni_estudiante.pdf",
                  "compromiso_honor.pdf",
                  "contrato_servicios.pdf",
                ],
              }
            : s,
        );
        const sections = prev.sections.map((s) =>
          s.id === sectionId ? { ...s, matriculados: s.matriculados + 1 } : s,
        );
        const auditLog: AuditLogEntry[] = [
          {
            id: uid("aud"),
            accion: "Matrícula completada",
            usuario: "Secretaría (demo)",
            fechaHora: new Date().toISOString(),
            detalle: `Estudiante ${studentId} → ${section.grado} ${section.seccion}, código ${code}`,
            huboEdicionPosterior: false,
          },
          ...prev.auditLog,
        ];
        queueMicrotask(() => toast.success(sim.message));
        return { ...prev, students, sections, auditLog };
      });
    },
    [],
  );

  const addProspect = React.useCallback((p: Omit<Prospect, "id">) => {
    setState((prev) => ({
      ...prev,
      prospects: [{ ...p, id: uid("pro") }, ...prev.prospects],
    }));
    toast.success("Prospecto registrado.");
  }, []);

  const updateProspectStatus = React.useCallback(
    (id: string, estado: ProspectStatus) => {
      setState((prev) => ({
        ...prev,
        prospects: prev.prospects.map((x) => (x.id === id ? { ...x, estado } : x)),
      }));
    },
    [],
  );

  const updateStudentDni = React.useCallback((studentId: string, dni: string) => {
    if (!isValidDniFormat(dni)) {
      toast.error("DNI inválido: debe tener 8 dígitos.");
      return false;
    }
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, personal: { ...s.personal, dni } } : s,
      ),
    }));
    toast.success("DNI actualizado.");
    return true;
  }, []);

  const setGuardianResponsible = React.useCallback((guardianId: string) => {
    setState((prev) => {
      const g = prev.guardians.find((x) => x.id === guardianId);
      if (!g) return prev;
      const guardians = prev.guardians.map((x) =>
        x.studentId === g.studentId
          ? { ...x, responsableEconomico: x.id === guardianId }
          : x,
      );
      return { ...prev, guardians };
    });
    toast.success("Responsable económico actualizado.");
  }, []);

  const generateMassPensionDebt = React.useCallback(() => {
    setState((prev) => {
      const active = prev.students.filter((s) => s.codigo);
      const newCharges: Charge[] = [];
      for (const s of active) {
        newCharges.push({
          id: uid("chg"),
          studentId: s.id,
          concepto: "Pensión Mayo 2026 (generación masiva)",
          montoOriginal: 380,
          montoPendiente: 380,
          fechaVencimiento: "2026-05-10",
          status: "pendiente",
        });
      }
      toast.success(
        `Se generaron ${newCharges.length} cuotas de pensión (demo).`,
      );
      return {
        ...prev,
        charges: [...newCharges, ...prev.charges],
        massDebtGeneratedAt: new Date().toISOString(),
        auditLog: [
          {
            id: uid("aud"),
            accion: "Deuda masiva generada",
            usuario: "Tesorería (demo)",
            fechaHora: new Date().toISOString(),
            detalle: `Cuotas Mayo 2026 × ${newCharges.length} alumnos`,
            huboEdicionPosterior: false,
          },
          ...prev.auditLog,
        ],
      };
    });
  }, []);

  const registerWindowPayment = React.useCallback(
    (studentId: string, monto: number, metodo: PaymentMethod) => {
      if (monto <= 0) {
        toast.error("Monto inválido.");
        return;
      }
      setState((prev) => {
        const pend = ordenPrelacionCharges(
          prev.charges.filter((c) => c.studentId === studentId),
        );
        let rest = monto;
        const allocations: PaymentAllocation[] = [];
        const chargeUpdates = new Map(prev.charges.map((c) => [c.id, { ...c }]));

        for (const c of pend) {
          if (rest <= 0) break;
          const ch = chargeUpdates.get(c.id)!;
          const pay = Math.min(ch.montoPendiente, rest);
          ch.montoPendiente -= pay;
          ch.status =
            ch.montoPendiente === 0
              ? "pagado"
              : pay > 0
                ? "pagado_parcial"
                : ch.status;
          allocations.push({ chargeId: c.id, monto: pay });
          rest -= pay;
        }

        if (allocations.length === 0) {
          queueMicrotask(() =>
            toast.error("No hay deudas pendientes para este estudiante."),
          );
          return prev;
        }

        const payId = uid("pay");
        const cobradorNombre = "Carmen Tesorería";
        const now = new Date().toISOString();
        const montoUsado = monto - rest;
        const payment: Payment = {
          id: payId,
          studentId,
          allocations,
          montoTotal: montoUsado,
          metodo,
          cobradorId: "usr-1",
          cobradorNombre,
          fechaHora: now,
          comprobanteSunat: {
            json: JSON.stringify(
              {
                tipo: "03",
                serie: "B001",
                estudiante: studentId,
                total: montoUsado,
                pagoId: payId,
              },
              null,
              2,
            ),
            xml: `<?xml version="1.0" encoding="UTF-8"?><Invoice><Id>${payId}</Id><Total>${montoUsado}</Total></Invoice>`,
          },
        };

        const hora = now.slice(11, 16);
        const entry: CashbookEntry = {
          id: uid("cb"),
          cobradorNombre,
          metodo,
          monto: montoUsado,
          hora,
          concepto: `Pago (${metodo}) — demo`,
        };

        queueMicrotask(() =>
          toast.success(
            `Pago aplicado por prelación (monto usado: S/ ${montoUsado}).`,
          ),
        );
        return {
          ...prev,
          charges: Array.from(chargeUpdates.values()),
          payments: [payment, ...prev.payments],
          cashbook: [entry, ...prev.cashbook],
          auditLog: [
            {
              id: uid("aud"),
              accion: "Pago en ventanilla",
              usuario: cobradorNombre,
              fechaHora: now,
              detalle: `S/ ${montoUsado} — ${metodo} — estudiante ${studentId}`,
              huboEdicionPosterior: false,
            },
            ...prev.auditLog,
          ],
        };
      });
    },
    [],
  );

  const setVoucherStatus = React.useCallback((id: string, status: VoucherStatus) => {
    setState((prev) => ({
      ...prev,
      vouchers: prev.vouchers.map((v) => (v.id === id ? { ...v, status } : v)),
    }));
    toast.success(`Voucher ${status}.`);
  }, []);

  const addAttendanceMark = React.useCallback((dni: string, nombre: string) => {
    const d = dni.trim();
    if (!/^\d{8}$/.test(d)) {
      toast.error("DNI debe tener 8 dígitos.");
      return;
    }
    const now = new Date();
    setState((prev) => ({
      ...prev,
      attendance: [
        {
          id: uid("att"),
          dni: d,
          nombre: nombre || "Personal",
          tipo: "entrada",
          hora: now.toTimeString().slice(0, 5),
          fecha: todayIso(),
        },
        ...prev.attendance,
      ],
    }));
    toast.success("Marcación registrada.");
  }, []);

  const addBulletin = React.useCallback(
    (titulo: string, cuerpo: string, segmento: BulletinSegment) => {
      const post: BulletinPost = {
        id: uid("bul"),
        titulo,
        cuerpo,
        segmento,
        fecha: todayIso(),
        adjuntos: [],
      };
      setState((prev) => ({
        ...prev,
        bulletins: [post, ...prev.bulletins],
        notifEvents: [
          {
            id: uid("ne"),
            tipo: "comunicado",
            mensaje: `Nuevo comunicado: ${titulo}`,
            fecha: new Date().toISOString(),
            leido: false,
          },
          ...prev.notifEvents,
        ],
      }));
      toast.success("Comunicado publicado (demo).");
    },
    [],
  );

  const simulateDebtAlerts = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifEvents: [
        {
          id: uid("ne"),
          tipo: "alerta_deuda",
          mensaje:
            "Recordatorio: su cuota vence en 3 días (simulación masiva)",
          fecha: new Date().toISOString(),
          leido: false,
        },
        ...prev.notifEvents,
      ],
    }));
    toast.success("Alertas de deuda simuladas enviadas.");
  }, []);

  const addAudit = React.useCallback((entry: Omit<AuditLogEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      auditLog: [{ ...entry, id: uid("aud") }, ...prev.auditLog],
    }));
  }, []);

  const value = React.useMemo<DemoDataContextValue>(
    () => ({
      ...state,
      treasuryDailyRatePercent: treasuryConfig.tasaInteresDiariaPorcentaje,
      tryEnroll,
      addProspect,
      updateProspectStatus,
      updateStudentDni,
      setGuardianResponsible,
      generateMassPensionDebt,
      registerWindowPayment,
      setVoucherStatus,
      addAttendanceMark,
      addBulletin,
      simulateDebtAlerts,
      addAudit,
    }),
    [
      state,
      tryEnroll,
      addProspect,
      updateProspectStatus,
      updateStudentDni,
      setGuardianResponsible,
      generateMassPensionDebt,
      registerWindowPayment,
      setVoucherStatus,
      addAttendanceMark,
      addBulletin,
      simulateDebtAlerts,
      addAudit,
    ],
  );

  return (
    <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const ctx = React.useContext(DemoDataContext);
  if (!ctx) {
    throw new Error("useDemoData debe usarse dentro de DemoDataProvider");
  }
  return ctx;
}
