import * as z from "zod";

export const announcementSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  category: z.string().min(1, "La categoría es obligatoria"),
  expiresAt: z.string().optional().or(z.literal("")),
});
