import * as z from "zod";

export const bulkSchema = z.object({
  tariffId: z.string().min(1, "Selecciona una tarifa"),
  dueDate: z.string().min(1, "Fecha de vencimiento es requerida"),
});

export const singleSchema = z.object({
  studentId: z.string().min(1, "Selecciona un estudiante"),
  tariffId: z.string().min(1, "Selecciona una tarifa"),
  dueDate: z.string().min(1, "Fecha de vencimiento es requerida"),
});

export const paymentSchema = z.object({
  amount: z.string().min(1, "Monto es requerido").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "El monto debe ser un número válido mayor a 0",
  }),
  method: z.enum(["CASH", "CARD", "TRANSFER"]),
});
