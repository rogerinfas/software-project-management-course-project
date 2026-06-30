export const PRIORIDAD_VARIANT: Record<
  "HIGH" | "MEDIUM" | "LOW",
  "default" | "secondary" | "outline"
> = {
  HIGH: "default",
  MEDIUM: "secondary",
  LOW: "outline",
};

export const PRIORIDAD_COLOR: Record<"HIGH" | "MEDIUM" | "LOW", string> = {
  HIGH: "border-l-red-500",
  MEDIUM: "border-l-yellow-500",
  LOW: "border-l-slate-400",
};

export const GRADOS_POR_NIVEL = {
  INITIAL: ["Inicial 3 años", "Inicial 4 años", "Inicial 5 años"],
  PRIMARY: [
    "1° primaria",
    "2° primaria",
    "3° primaria",
    "4° primaria",
    "5° primaria",
    "6° primaria",
  ],
  SECONDARY: [
    "1° secundaria",
    "2° secundaria",
    "3° secundaria",
    "4° secundaria",
    "5° secundaria",
  ],
};
