import * as z from "zod";

export const evaluationSchema = z.object({
  aptitude: z.enum(["PENDING", "FIT", "UNFIT"]),
  comments: z.string().min(5, "Los comentarios deben tener al menos 5 caracteres"),
});
