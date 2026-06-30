import * as z from "zod";

export const sectionSchema = z.object({
  name: z.string().min(1, "Nombre de la sección es obligatorio"),
  grade: z.string().min(1, "Selecciona un grado"),
  level: z.enum(["INITIAL", "PRIMARY", "SECONDARY"]),
  capacity: z.coerce.number().int().min(1, "La capacidad debe ser de al menos 1 alumno"),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});
