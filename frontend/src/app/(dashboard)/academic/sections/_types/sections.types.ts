import * as z from "zod";
import { sectionSchema } from "../_schemas/sections.schema";

export type SectionFormValues = z.infer<typeof sectionSchema>;

export interface Section {
  id: string;
  name: string;
  grade: string;
  level: "INITIAL" | "PRIMARY" | "SECONDARY";
  capacity: number;
  status?: string;
  matriculados?: number;
}
