import * as z from "zod";

export const appointmentSchema = z.object({
  prospectId: z.string().min(1, "Debe seleccionar un postulante"),
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().min(1, "La hora es requerida"),
  type: z.enum(["ENTREVISTA", "EXAMEN"]),
  notes: z.string().optional(),
});
