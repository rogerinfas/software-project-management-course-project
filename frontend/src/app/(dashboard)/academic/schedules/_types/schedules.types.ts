import * as z from "zod";
import { scheduleSchema } from "../_schemas/schedules.schema";

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export const DAYS_OF_WEEK = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
];

export interface Schedule {
  id: string;
  sectionId: string;
  courseId: string;
  staffId: string;
  day: number;
  startTime: string;
  endTime: string;
  course?: { name: string };
  staff?: { user?: { name: string } };
  section?: { grade: string; name: string };
}
