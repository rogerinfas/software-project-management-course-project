"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  initialAdmissionRequirements,
  initialAdmissionStages,
  initialAppointments,
  initialBulletins,
  initialCharges,
  initialClassrooms,
  initialCollection,
  initialCourses,
  initialDiscounts,
  initialEnrollmentDocuments,
  initialEvaluationResults,
  initialFacialMarks,
  initialGuardians,
  initialMorosity,
  initialPayments,
  initialPrePayroll,
  initialProspectDocuments,
  initialProspectInteractions,
  initialProspects,
  initialReceipts,
  initialSanctionRules,
  initialScheduleSlots,
  initialSections,
  initialStaff,
  initialStudents,
  initialTariffConcepts,
  initialTeachingAssignments,
  treasuryConfig,
} from "@/lib/mock/fixtures";
import {
  calcularMultaPorMinutos,
  consolidarTardanzas,
  economicGuardianHasDebt,
  isValidDniFormat,
  minutosTardanza,
  ordenPrelacionCharges,
  simulateEnrollment,
} from "@/lib/mock/rules";
import type {
  AdmissionRequirement,
  AdmissionStage,
  AppointmentSlot,
  AppointmentStatus,
  BulletinCategory,
  BulletinPost,
  BulletinVisibility,
  Charge,
  Course,
  DocumentValidationStatus,
  EnrollmentDocument,
  EvaluationAptitud,
  EvaluationResult,
  FacialMark,
  Guardian,
  InternalReceipt,
  NivelEducativo,
  Payment,
  PaymentAllocation,
  PaymentMethod,
  PrePayrollRow,
  Prospect,
  ProspectDocument,
  ProspectInteraction,
  ProspectPrioridad,
  SanctionRule,
  ScheduleSlot,
  Section,
  TeachingAssignment,
} from "@/lib/mock/types";

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

// ----------------------------------------------------------------------------
// Estado interno
// ----------------------------------------------------------------------------

type DemoDataState = {
  admissionStages: AdmissionStage[];
  admissionRequirements: AdmissionRequirement[];
  prospects: Prospect[];
  prospectInteractions: ProspectInteraction[];
  prospectDocuments: ProspectDocument[];
  appointments: AppointmentSlot[];
  evaluationResults: EvaluationResult[];

  sections: typeof initialSections;
  students: typeof initialStudents;
  guardians: typeof initialGuardians;
  enrollmentDocuments: EnrollmentDocument[];

  courses: typeof initialCourses;
  teachingAssignments: typeof initialTeachingAssignments;
  classrooms: typeof initialClassrooms;
  scheduleSlots: typeof initialScheduleSlots;
  bulletins: BulletinPost[];

  tariffConcepts: typeof initialTariffConcepts;
  discounts: typeof initialDiscounts;
  charges: Charge[];
  payments: Payment[];
  receipts: InternalReceipt[];
  morosity: typeof initialMorosity;
  collection: typeof initialCollection;

  staff: typeof initialStaff;
  facialMarks: FacialMark[];
  sanctionRules: SanctionRule[];
  prePayroll: PrePayrollRow[];
};

const initialDemoState = (): DemoDataState => ({
  admissionStages: structuredClone(initialAdmissionStages),
  admissionRequirements: structuredClone(initialAdmissionRequirements),
  prospects: structuredClone(initialProspects),
  prospectInteractions: structuredClone(initialProspectInteractions),
  prospectDocuments: structuredClone(initialProspectDocuments),
  appointments: structuredClone(initialAppointments),
  evaluationResults: structuredClone(initialEvaluationResults),

  sections: structuredClone(initialSections),
  students: structuredClone(initialStudents),
  guardians: structuredClone(initialGuardians),
  enrollmentDocuments: structuredClone(initialEnrollmentDocuments),

  courses: structuredClone(initialCourses),
  teachingAssignments: structuredClone(initialTeachingAssignments),
  classrooms: structuredClone(initialClassrooms),
  scheduleSlots: structuredClone(initialScheduleSlots),
  bulletins: structuredClone(initialBulletins),

  tariffConcepts: structuredClone(initialTariffConcepts),
  discounts: structuredClone(initialDiscounts),
  charges: structuredClone(initialCharges),
  payments: structuredClone(initialPayments),
  receipts: structuredClone(initialReceipts),
  morosity: structuredClone(initialMorosity),
  collection: structuredClone(initialCollection),

  staff: structuredClone(initialStaff),
  facialMarks: structuredClone(initialFacialMarks),
  sanctionRules: structuredClone(initialSanctionRules),
  prePayroll: structuredClone(initialPrePayroll),
});

// ----------------------------------------------------------------------------
// Context API
// ----------------------------------------------------------------------------

type DemoDataContextValue = DemoDataState & {
  treasuryDailyRatePercent: number;

  // M1 Admisión
  addProspect: (
    p: Omit<Prospect, "id" | "fechaRegistro" | "currentStageId"> & {
      currentStageId?: string;
    },
  ) => void;
  moveProspectStage: (prospectId: string, stageId: string) => void;
  addProspectInteraction: (input: Omit<ProspectInteraction, "id">) => void;
  addProspectDocument: (input: Omit<ProspectDocument, "id" | "subidoEn">) => void;
  setProspectDocumentStatus: (id: string, estado: DocumentValidationStatus) => void;
  addAdmissionStage: (input: Omit<AdmissionStage, "id" | "orden">) => void;
  toggleAdmissionRequirement: (id: string) => void;
  addAppointment: (input: Omit<AppointmentSlot, "id">) => void;
  updateAppointmentStatus: (id: string, estado: AppointmentStatus) => void;
  setEvaluationResult: (input: { prospectId: string; aptitud: EvaluationAptitud; comentarios: string; evaluador: string }) => void;

  // M2 Matrícula
  updateStudentDni: (studentId: string, dni: string) => boolean;
  setGuardianResponsible: (guardianId: string) => void;
  addGuardian: (input: Omit<Guardian, "id">) => void;
  updateGuardian: (id: string, fields: Partial<Pick<Guardian, "dni" | "telefono" | "correo" | "ocupacion">>) => void;
  linkSibling: (studentId: string, siblingId: string) => void;
  tryEnroll: (studentId: string, sectionId: string) => void;
  emitEnrollmentDocs: (studentId: string) => void;

  // M3 Académica y comunicación
  addBulletin: (input: {
    titulo: string;
    cuerpo: string;
    categoria: BulletinCategory;
    visibilidad: BulletinVisibility;
    vigenteHasta: string;
  }) => void;
  updateBulletin: (id: string, fields: Partial<BulletinPost>) => void;
  addCourse: (input: Omit<Course, "id">) => void;
  updateCourse: (id: string, fields: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addScheduleSlot: (input: Omit<ScheduleSlot, "id">) => void;
  deleteScheduleSlot: (id: string) => void;
  assignTeacher: (input: Omit<TeachingAssignment, "id">) => void;
  addSection: (input: Omit<Section, "id" | "matriculados">) => void;
  updateSection: (id: string, fields: Partial<Section>) => void;

  // M4 Tesorería
  generateMassPensionDebt: (nivel: NivelEducativo) => void;
  registerWindowPayment: (
    studentId: string,
    monto: number,
    metodo: PaymentMethod,
  ) => void;
  addTariffConcept: (input: Omit<TariffConcept, "id">) => void;
  updateTariffConcept: (id: string, fields: Partial<TariffConcept>) => void;
  deleteTariffConcept: (id: string) => void;
  addDiscount: (input: Omit<DiscountRule, "id">) => void;
  updateDiscount: (id: string, fields: Partial<DiscountRule>) => void;
  deleteDiscount: (id: string) => void;

  // M5 Personal y asistencia
  simulateFacialMark: (staffId: string) => void;
  toggleSanctionRule: (id: string) => void;
  updateSanctionRule: (id: string, fields: Partial<SanctionRule>) => void;
  recomputePrePayroll: () => void;
  addStaffMember: (input: Omit<StaffMember, "id">) => void;
  updateStaffMember: (id: string, fields: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;
};

const DemoDataContext = React.createContext<DemoDataContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DemoDataState>(initialDemoState);

  // --------------------------------------------------------------------------
  // M1 — Admisión
  // --------------------------------------------------------------------------

  const addProspect = React.useCallback<DemoDataContextValue["addProspect"]>(
    (p) => {
      setState((prev) => {
        const stageId = p.currentStageId ?? prev.admissionStages[0]?.id ?? "";
        const prospect: Prospect = {
          ...p,
          id: uid("pro"),
          fechaRegistro: todayIso(),
          currentStageId: stageId,
        };
        return { ...prev, prospects: [prospect, ...prev.prospects] };
      });
      toast.success("Prospecto registrado en el pipeline.");
    },
    [],
  );

  const moveProspectStage = React.useCallback(
    (prospectId: string, stageId: string) => {
      setState((prev) => ({
        ...prev,
        prospects: prev.prospects.map((x) =>
          x.id === prospectId ? { ...x, currentStageId: stageId } : x,
        ),
      }));
    },
    [],
  );

  const addProspectInteraction = React.useCallback<
    DemoDataContextValue["addProspectInteraction"]
  >((input) => {
    setState((prev) => ({
      ...prev,
      prospectInteractions: [
        { ...input, id: uid("int") },
        ...prev.prospectInteractions,
      ],
    }));
    toast.success("Interacción registrada.");
  }, []);

  const addProspectDocument = React.useCallback<
    DemoDataContextValue["addProspectDocument"]
  >((input) => {
    setState((prev) => ({
      ...prev,
      prospectDocuments: [
        { ...input, id: uid("doc"), subidoEn: todayIso() },
        ...prev.prospectDocuments,
      ],
    }));
    toast.success("Documento cargado al repositorio.");
  }, []);

  const setProspectDocumentStatus = React.useCallback(
    (id: string, estado: DocumentValidationStatus) => {
      setState((prev) => ({
        ...prev,
        prospectDocuments: prev.prospectDocuments.map((d) =>
          d.id === id ? { ...d, estado } : d,
        ),
      }));
      toast.success(`Documento marcado como ${estado}.`);
    },
    [],
  );

  const addAdmissionStage = React.useCallback<
    DemoDataContextValue["addAdmissionStage"]
  >((input) => {
    setState((prev) => {
      const maxOrden = prev.admissionStages.reduce(
        (a, s) => Math.max(a, s.orden),
        0,
      );
      return {
        ...prev,
        admissionStages: [
          ...prev.admissionStages,
          { ...input, id: uid("stg"), orden: maxOrden + 1 },
        ],
      };
    });
    toast.success("Nueva etapa agregada al proceso.");
  }, []);

  const toggleAdmissionRequirement = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      admissionRequirements: prev.admissionRequirements.map((r) =>
        r.id === id ? { ...r, obligatorio: !r.obligatorio } : r,
      ),
    }));
  }, []);

  const addAppointment = React.useCallback<DemoDataContextValue["addAppointment"]>(
    (input) => {
      setState((prev) => ({
        ...prev,
        appointments: [{ ...input, id: uid("apt") }, ...prev.appointments],
      }));
      toast.success("Cita agendada correctamente.");
    },
    [],
  );

  const updateAppointmentStatus = React.useCallback(
    (id: string, estado: AppointmentStatus) => {
      setState((prev) => ({
        ...prev,
        appointments: prev.appointments.map((a) =>
          a.id === id ? { ...a, estado } : a,
        ),
      }));
      const label = estado === "realizada" ? "marcada como realizada" : "cancelada";
      toast.success(`Cita ${label}.`);
    },
    [],
  );

  const setEvaluationResult = React.useCallback<DemoDataContextValue["setEvaluationResult"]>(
    (input) => {
      setState((prev) => {
        const existing = prev.evaluationResults.find((e) => e.prospectId === input.prospectId);
        let evaluationResults: EvaluationResult[];
        const record: EvaluationResult = {
          id: existing?.id ?? uid("evr"),
          prospectId: input.prospectId,
          aptitud: input.aptitud,
          comentarios: input.comentarios,
          evaluador: input.evaluador,
          fechaDictamen: new Date().toISOString().slice(0, 10),
        };
        if (existing) {
          evaluationResults = prev.evaluationResults.map((e) =>
            e.prospectId === input.prospectId ? record : e,
          );
        } else {
          evaluationResults = [record, ...prev.evaluationResults];
        }
        // Si es APTO, avanzar automáticamente al stage "Aceptado" (stg-5)
        const prospects = input.aptitud === "apto"
          ? prev.prospects.map((p) =>
              p.id === input.prospectId ? { ...p, currentStageId: "stg-5" } : p,
            )
          : prev.prospects;
        return { ...prev, evaluationResults, prospects };
      });
      toast.success("Dictamen registrado.");
    },
    [],
  );

  // --------------------------------------------------------------------------
  // M2 — Matrícula
  // --------------------------------------------------------------------------

  const updateStudentDni = React.useCallback(
    (studentId: string, dni: string) => {
      if (!isValidDniFormat(dni)) {
        toast.error("DNI inválido: debe tener 8 dígitos.");
        return false;
      }
      setState((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === studentId ? { ...s, dni } : s,
        ),
      }));
      toast.success("DNI actualizado.");
      return true;
    },
    [],
  );

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

  const addGuardian = React.useCallback((input: Omit<Guardian, "id">) => {
    setState((prev) => ({
      ...prev,
      guardians: [{ ...input, id: uid("gua") }, ...prev.guardians],
    }));
    toast.success("Apoderado registrado.");
  }, []);

  const updateGuardian = React.useCallback(
    (id: string, fields: Partial<Pick<Guardian, "dni" | "telefono" | "correo" | "ocupacion">>) => {
      setState((prev) => ({
        ...prev,
        guardians: prev.guardians.map((g) =>
          g.id === id ? { ...g, ...fields } : g,
        ),
      }));
      toast.success("Datos del apoderado actualizados.");
    },
    [],
  );

  const linkSibling = React.useCallback((studentId: string, siblingId: string) => {
    if (studentId === siblingId) return;
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) => {
        if (s.id === studentId && !s.hermanosIds.includes(siblingId)) {
          return { ...s, hermanosIds: [...s.hermanosIds, siblingId] };
        }
        if (s.id === siblingId && !s.hermanosIds.includes(studentId)) {
          return { ...s, hermanosIds: [...s.hermanosIds, studentId] };
        }
        return s;
      }),
    }));
    toast.success("Vinculación familiar registrada.");
  }, []);

  const tryEnroll = React.useCallback(
    (studentId: string, sectionId: string) => {
      setState((prev) => {
        const section = prev.sections.find((s) => s.id === sectionId);
        if (!section) {
          queueMicrotask(() => toast.error("Sección no encontrada."));
          return prev;
        }
        const debt = economicGuardianHasDebt(studentId, prev.guardians);
        const sim = simulateEnrollment(section, debt);
        if (!sim.ok) {
          queueMicrotask(() => toast.error(sim.message));
          return prev;
        }
        const code = `EST-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
        const students = prev.students.map((s) =>
          s.id === studentId ? { ...s, codigo: code, sectionId } : s,
        );
        const sections = prev.sections.map((s) =>
          s.id === sectionId ? { ...s, matriculados: s.matriculados + 1 } : s,
        );
        const newDocs: EnrollmentDocument[] = [
          {
            id: uid("edoc"),
            studentId,
            tipo: "ficha_matricula",
            generadoEn: todayIso(),
            estado: "emitido",
          },
          {
            id: uid("edoc"),
            studentId,
            tipo: "contrato_servicios",
            generadoEn: todayIso(),
            estado: "emitido",
          },
        ];
        queueMicrotask(() => toast.success(sim.message));
        return {
          ...prev,
          students,
          sections,
          enrollmentDocuments: [...newDocs, ...prev.enrollmentDocuments],
        };
      });
    },
    [],
  );

  const emitEnrollmentDocs = React.useCallback((studentId: string) => {
    setState((prev) => ({
      ...prev,
      enrollmentDocuments: [
        {
          id: uid("edoc"),
          studentId,
          tipo: "ficha_matricula",
          generadoEn: todayIso(),
          estado: "emitido",
        },
        {
          id: uid("edoc"),
          studentId,
          tipo: "contrato_servicios",
          generadoEn: todayIso(),
          estado: "emitido",
        },
        ...prev.enrollmentDocuments,
      ],
    }));
    toast.success("Documentos de matrícula re-emitidos (PDF demo).");
  }, []);

  // --------------------------------------------------------------------------
  // M3 — Comunicados
  // --------------------------------------------------------------------------

  const addBulletin = React.useCallback<DemoDataContextValue["addBulletin"]>(
    (input) => {
      const post: BulletinPost = {
        id: uid("bul"),
        titulo: input.titulo,
        cuerpo: input.cuerpo,
        categoria: input.categoria,
        visibilidad: input.visibilidad,
        publicadoEn: todayIso(),
        vigenteHasta: input.vigenteHasta,
        autor: "Dirección",
      };
      setState((prev) => ({ ...prev, bulletins: [post, ...prev.bulletins] }));
      toast.success("Comunicado publicado.");
    },
    [],
  );

  const updateBulletin = React.useCallback(
    (id: string, fields: Partial<BulletinPost>) => {
      setState((prev) => ({
        ...prev,
        bulletins: prev.bulletins.map((b) => (b.id === id ? { ...b, ...fields } : b)),
      }));
      toast.success("Comunicado actualizado.");
    },
    [],
  );

  const addCourse = React.useCallback((input: Omit<Course, "id">) => {
    setState((prev) => ({
      ...prev,
      courses: [...prev.courses, { ...input, id: uid("crs") }],
    }));
    toast.success("Curso creado.");
  }, []);

  const updateCourse = React.useCallback((id: string, fields: Partial<Course>) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === id ? { ...c, ...fields } : c)),
    }));
    toast.success("Curso actualizado.");
  }, []);

  const deleteCourse = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }));
    toast.success("Curso eliminado.");
  }, []);

  const addScheduleSlot = React.useCallback((input: Omit<ScheduleSlot, "id">) => {
    setState((prev) => ({
      ...prev,
      scheduleSlots: [...prev.scheduleSlots, { ...input, id: uid("sch") }],
    }));
    toast.success("Bloque horario programado.");
  }, []);

  const deleteScheduleSlot = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      scheduleSlots: prev.scheduleSlots.filter((s) => s.id !== id),
    }));
    toast.success("Bloque eliminado.");
  }, []);

  const assignTeacher = React.useCallback((input: Omit<TeachingAssignment, "id">) => {
    setState((prev) => {
      const existing = prev.teachingAssignments.findIndex(
        (ta) => ta.courseId === input.courseId && ta.sectionId === input.sectionId,
      );
      const newAssignments = [...prev.teachingAssignments];
      if (existing !== -1) {
        newAssignments[existing] = { ...newAssignments[existing], teacherId: input.teacherId };
      } else {
        newAssignments.push({ ...input, id: uid("ta") });
      }
      return { ...prev, teachingAssignments: newAssignments };
    });
    toast.success("Docente asignado.");
  }, []);

  const addSection = React.useCallback((input: Omit<Section, "id" | "matriculados">) => {
    setState((prev) => ({
      ...prev,
      sections: [...prev.sections, { ...input, id: uid("sec"), matriculados: 0 }],
    }));
    toast.success("Sección abierta.");
  }, []);

  const updateSection = React.useCallback((id: string, fields: Partial<Section>) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, ...fields } : s)),
    }));
    toast.success("Estado de sección actualizado.");
  }, []);

  // --------------------------------------------------------------------------
  // M4 — Tesorería
  // --------------------------------------------------------------------------

  const generateMassPensionDebt = React.useCallback((nivel: NivelEducativo) => {
    setState((prev) => {
      const targets = prev.students.filter((s) => {
        if (!s.codigo || !s.sectionId) return false;
        const section = prev.sections.find((x) => x.id === s.sectionId);
        return section?.nivel === nivel;
      });
      const concepto = prev.tariffConcepts.find(
        (t) => t.tipo === "mensual" && t.aplicaNivel === nivel,
      );
      if (!concepto) {
        queueMicrotask(() =>
          toast.error(
            `No hay concepto mensual configurado para el nivel ${nivel}.`,
          ),
        );
        return prev;
      }
      const newCharges: Charge[] = targets.map((s) => ({
        id: uid("chg"),
        studentId: s.id,
        concepto: `Pensión Mayo 2026 — ${nivel}`,
        montoOriginal: concepto.montoBase,
        montoPendiente: concepto.montoBase,
        fechaVencimiento: "2026-05-10",
        status: "pendiente",
      }));
      queueMicrotask(() =>
        toast.success(
          `Se generaron ${newCharges.length} cuotas de pensión (${nivel}).`,
        ),
      );
      return { ...prev, charges: [...newCharges, ...prev.charges] };
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
        const now = new Date().toISOString();
        const montoUsado = monto - rest;
        const student = prev.students.find((s) => s.id === studentId);
        const payment: Payment = {
          id: payId,
          studentId,
          allocations,
          montoTotal: montoUsado,
          metodo,
          cobradorId: "usr-1",
          cobradorNombre: "Carmen Tesorería",
          fechaHora: now,
        };
        const lastReceipt = prev.receipts.reduce(
          (m, r) => Math.max(m, r.numero),
          1000,
        );
        const receipt: InternalReceipt = {
          id: uid("rec"),
          paymentId: payId,
          serie: "R-2026",
          numero: lastReceipt + 1,
          montoTotal: montoUsado,
          emitidoEn: now,
          estudianteNombre: student
            ? `${student.nombres} ${student.apellidos}`
            : studentId,
          concepto: allocations
            .map((a) => chargeUpdates.get(a.chargeId)?.concepto)
            .filter(Boolean)
            .join(" + "),
        };

        queueMicrotask(() =>
          toast.success(
            `Pago aplicado por prelación (monto usado: S/ ${montoUsado.toFixed(2)}).`,
          ),
        );
        return {
          ...prev,
          charges: Array.from(chargeUpdates.values()),
          payments: [payment, ...prev.payments],
          receipts: [receipt, ...prev.receipts],
        };
      });
    },
    [],
  );

  const addTariffConcept = React.useCallback(
    (input: Omit<TariffConcept, "id">) => {
      setState((prev) => ({
        ...prev,
        tariffConcepts: [...prev.tariffConcepts, { ...input, id: uid("trf") }],
      }));
      toast.success("Concepto de tarifario creado.");
    },
    [],
  );

  const updateTariffConcept = React.useCallback(
    (id: string, fields: Partial<TariffConcept>) => {
      setState((prev) => ({
        ...prev,
        tariffConcepts: prev.tariffConcepts.map((c) =>
          c.id === id ? { ...c, ...fields } : c,
        ),
      }));
      toast.success("Concepto actualizado.");
    },
    [],
  );

  const deleteTariffConcept = React.useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        tariffConcepts: prev.tariffConcepts.filter((c) => c.id !== id),
      }));
      toast.success("Concepto eliminado.");
    },
    [],
  );

  const addDiscount = React.useCallback(
    (input: Omit<DiscountRule, "id">) => {
      setState((prev) => ({
        ...prev,
        discounts: [...prev.discounts, { ...input, id: uid("dsc") }],
      }));
      toast.success("Regla de descuento creada.");
    },
    [],
  );

  const updateDiscount = React.useCallback(
    (id: string, fields: Partial<DiscountRule>) => {
      setState((prev) => ({
        ...prev,
        discounts: prev.discounts.map((d) =>
          d.id === id ? { ...d, ...fields } : d,
        ),
      }));
      toast.success("Descuento actualizado.");
    },
    [],
  );

  const deleteDiscount = React.useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        discounts: prev.discounts.filter((d) => d.id !== id),
      }));
      toast.success("Descuento eliminado.");
    },
    [],
  );

  // --------------------------------------------------------------------------
  // M5 — Personal y asistencia
  // --------------------------------------------------------------------------

  const simulateFacialMark = React.useCallback((staffId: string) => {
    setState((prev) => {
      const staff = prev.staff.find((s) => s.id === staffId);
      if (!staff) {
        queueMicrotask(() => toast.error("Personal no encontrado."));
        return prev;
      }
      const now = new Date();
      const hora = now.toTimeString().slice(0, 5);
      const tardanza = minutosTardanza(
        hora,
        staff.horaEntrada,
        staff.toleranciaMinutos,
      );
      const mark: FacialMark = {
        id: uid("fm"),
        staffId,
        tipo: "entrada",
        fecha: todayIso(),
        hora,
        confianza: 90 + Math.floor(Math.random() * 10),
        minutosTardanza: tardanza,
      };
      queueMicrotask(() =>
        tardanza > 0
          ? toast.warning(
              `Marcación ok, pero con ${tardanza} min de tardanza acumulada.`,
            )
          : toast.success("Marcación ok — sin tardanza."),
      );
      return { ...prev, facialMarks: [mark, ...prev.facialMarks] };
    });
  }, []);

  const toggleSanctionRule = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      sanctionRules: prev.sanctionRules.map((r) =>
        r.id === id ? { ...r, activa: !r.activa } : r,
      ),
    }));
  }, []);

  const updateSanctionRule = React.useCallback((id: string, fields: Partial<SanctionRule>) => {
    setState((prev) => ({
      ...prev,
      sanctionRules: prev.sanctionRules.map((r) =>
        r.id === id ? { ...r, ...fields } : r,
      ),
    }));
    toast.success("Regla de asistencia actualizada.");
  }, []);

  const addStaffMember = React.useCallback((input: Omit<StaffMember, "id">) => {
    setState((prev) => ({
      ...prev,
      staff: [...prev.staff, { ...input, id: uid("stf") }],
    }));
    toast.success("Personal registrado.");
  }, []);

  const updateStaffMember = React.useCallback((id: string, fields: Partial<StaffMember>) => {
    setState((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => (s.id === id ? { ...s, ...fields } : s)),
    }));
    toast.success("Datos de personal actualizados.");
  }, []);

  const deleteStaffMember = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      staff: prev.staff.filter((s) => s.id !== id),
    }));
    toast.success("Personal eliminado.");
  }, []);

  const recomputePrePayroll = React.useCallback(() => {
    setState((prev) => {
      const tardanzas = consolidarTardanzas(prev.staff, prev.facialMarks);
      const rows: PrePayrollRow[] = prev.prePayroll.map((r) => {
        const min =
          tardanzas.find((t) => t.staffId === r.staffId)?.minutos ??
          r.minutosTardanza;
        const multa = calcularMultaPorMinutos(min, prev.sanctionRules);
        return {
          ...r,
          minutosTardanza: min,
          descuentoMulta: multa,
          neto: Math.round((r.sueldoBase - multa) * 100) / 100,
        };
      });
      queueMicrotask(() =>
        toast.success("Pre-planilla recalculada con las reglas vigentes."),
      );
      return { ...prev, prePayroll: rows };
    });
  }, []);

  // --------------------------------------------------------------------------

  const value = React.useMemo<DemoDataContextValue>(
    () => ({
      ...state,
      treasuryDailyRatePercent: treasuryConfig.tasaInteresDiariaPorcentaje,
      addProspect,
      moveProspectStage,
      addProspectInteraction,
      addProspectDocument,
      setProspectDocumentStatus,
      addAdmissionStage,
      toggleAdmissionRequirement,
      addAppointment,
      updateAppointmentStatus,
      setEvaluationResult,
      updateStudentDni,
      setGuardianResponsible,
      addGuardian,
      updateGuardian,
      linkSibling,
      tryEnroll,
      emitEnrollmentDocs,
      addBulletin,
      updateBulletin,
      addCourse,
      updateCourse,
      deleteCourse,
      addScheduleSlot,
      deleteScheduleSlot,
      assignTeacher,
      addSection,
      updateSection,
      generateMassPensionDebt,
      registerWindowPayment,
      addTariffConcept,
      updateTariffConcept,
      deleteTariffConcept,
      addDiscount,
      updateDiscount,
      deleteDiscount,
      simulateFacialMark,
      toggleSanctionRule,
      updateSanctionRule,
      recomputePrePayroll,
      addStaffMember,
      updateStaffMember,
      deleteStaffMember,
    }),
    [
      state,
      addProspect,
      moveProspectStage,
      addProspectInteraction,
      addProspectDocument,
      setProspectDocumentStatus,
      addAdmissionStage,
      toggleAdmissionRequirement,
      addAppointment,
      updateAppointmentStatus,
      setEvaluationResult,
      updateStudentDni,
      setGuardianResponsible,
      addGuardian,
      updateGuardian,
      linkSibling,
      tryEnroll,
      emitEnrollmentDocs,
      addBulletin,
      updateBulletin,
      addCourse,
      updateCourse,
      deleteCourse,
      addScheduleSlot,
      deleteScheduleSlot,
      assignTeacher,
      addSection,
      updateSection,
      generateMassPensionDebt,
      registerWindowPayment,
      addTariffConcept,
      updateTariffConcept,
      deleteTariffConcept,
      addDiscount,
      updateDiscount,
      deleteDiscount,
      simulateFacialMark,
      toggleSanctionRule,
      updateSanctionRule,
      recomputePrePayroll,
      addStaffMember,
      updateStaffMember,
      deleteStaffMember,
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

export type {
  ProspectPrioridad,
  BulletinCategory,
  BulletinVisibility,
  NivelEducativo,
  PaymentMethod,
  DocumentValidationStatus,
};
