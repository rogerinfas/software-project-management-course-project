import * as z from "zod";
import { evaluationSchema } from "../_schemas/evaluation.schema";

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;

export interface ProspectEvaluation {
  id: string;
  name: string;
  targetGrade: string;
  level: string;
  priority: string;
  stageName: string;
  createdAt: string;
  phone: string;
  evaluation?: {
    aptitude: "PENDING" | "FIT" | "UNFIT";
    comments: string;
  };
  appointments?: Array<{
    id: string;
    type: string;
    date: string;
    notes?: string;
  }>;
}
