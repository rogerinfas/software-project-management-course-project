import {
  UserPlusIcon,
  UsersIcon,
  BookOpenIcon,
  CoinsIcon,
} from "lucide-react";

export const MODULE_STATUS = [
  {
    code: "M1",
    title: "Admisión",
    href: "/admission/pipeline",
    description: "CRM de postulantes, etapas de admisión, citas y dictámenes.",
    icon: UserPlusIcon,
    status: "ready", // ready, active, pending
    statusLabel: "Fase 1 Lista",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  },
  {
    code: "M2",
    title: "Matrícula",
    href: "/enrollment/formalization",
    description: "Expediente familiar, gestión de vacantes e instrumentación.",
    icon: UsersIcon,
    status: "ready",
    statusLabel: "Fase 2 Lista",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  },
  {
    code: "M3",
    title: "Académica y comunicación",
    href: "/academic/curriculum",
    description: "Mallas curriculares, carga de docentes, secciones y horarios.",
    icon: BookOpenIcon,
    status: "ready",
    statusLabel: "Fase 3 Lista",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  },
  {
    code: "M4",
    title: "Tesorería",
    href: "/treasury/collections",
    description: "Definición del tarifario, cobranzas y facturación integrada.",
    icon: CoinsIcon,
    status: "ready",
    statusLabel: "Fase 4 Lista",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  }
];
