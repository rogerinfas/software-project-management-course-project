import * as z from "zod";
import { studentSchema, guardianSchema } from "../_schemas/formalization.schema";

export type StudentFormValues = z.infer<typeof studentSchema>;
export type GuardianFormValues = z.infer<typeof guardianSchema>;

export interface WizardState {
  step: 0 | 1 | 2 | 3;
  selectedProspect: any | null;
  createdStudentId: string | null;
  selectedSectionId: string | null;
}
