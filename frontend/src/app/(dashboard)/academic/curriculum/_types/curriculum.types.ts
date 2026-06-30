import * as z from "zod";
import { courseSchema } from "../_schemas/curriculum.schema";

export type CourseFormValues = z.infer<typeof courseSchema>;

export interface Course {
  id: string;
  name: string;
  description: any;
}
