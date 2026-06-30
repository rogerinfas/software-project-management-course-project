import * as z from "zod";

export const guardianSchema = z.object({
  name: z.string().min(5, "El nombre completo debe tener al menos 5 caracteres"),
  dni: z.string().length(8, "DNI debe tener exactamente 8 caracteres"),
  phone: z.string().min(6, "Teléfono inválido"),
  email: z.string().email("Correo electrónico inválido").or(z.literal("")),
  occupation: z.string().optional(),
});
