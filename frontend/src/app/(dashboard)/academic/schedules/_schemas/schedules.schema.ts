import * as z from "zod";

export const scheduleSchema = z.object({
  section: z.string().min(1, "Selecciona una sección"),
  course: z.string().min(1, "Selecciona un curso"),
  teacher: z.string().min(1, "Selecciona un docente"),
  day: z.string().min(1, "Selecciona un día"),
  start: z.string().min(1, "Hora de inicio es requerida"),
  end: z.string().min(1, "Hora de fin es requerida"),
});
