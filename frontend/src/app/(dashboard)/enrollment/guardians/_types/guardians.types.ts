import * as z from "zod";
import { guardianSchema } from "../_schemas/guardians.schema";

export type GuardianFormValues = z.infer<typeof guardianSchema>;
