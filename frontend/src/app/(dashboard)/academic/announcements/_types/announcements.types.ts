import * as z from "zod";
import { announcementSchema } from "../_schemas/announcements.schema";

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;

// Assuming this type from backend response structure shown in page.tsx
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  status?: string;
  createdAt: string;
  expiresAt: any;
}
