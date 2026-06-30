import * as z from "zod";

export const courseSchema = z.object({
  name: z.string().min(3, "El nombre del curso debe tener al menos 3 caracteres"),
  description: z.string().optional(),
});
