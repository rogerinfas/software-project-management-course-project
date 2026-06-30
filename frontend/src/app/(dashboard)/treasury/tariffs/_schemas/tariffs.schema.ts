import * as z from "zod";

export const tariffSchema = z.object({
  concept: z.string().min(3, "El concepto debe tener al menos 3 caracteres"),
  amount: z.string().min(1, "Monto es requerido").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "El monto debe ser un número válido mayor a 0",
  }),
  type: z.enum(["ONE_TIME", "MONTHLY", "EXTRA"]),
  level: z.enum(["INITIAL", "PRIMARY", "SECONDARY"]),
});
