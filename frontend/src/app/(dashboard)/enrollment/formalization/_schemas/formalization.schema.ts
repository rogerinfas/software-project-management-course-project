import * as z from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z.string().length(8, "DNI debe tener exactamente 8 caracteres"),
});

export const guardianSchema = z.object({
  guardianName: z.string().min(5, "El nombre completo debe tener al menos 5 caracteres"),
  guardianDni: z.string().length(8, "DNI del apoderado debe tener 8 caracteres"),
  guardianPhone: z.string().min(6, "Teléfono inválido"),
  guardianEmail: z.string().email("Correo inválido").or(z.literal("")),
  guardianOccupation: z.string().optional(),
});
