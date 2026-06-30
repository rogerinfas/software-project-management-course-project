import * as z from "zod";
import { loginSchema } from "../_schemas/login.schema";

export type LoginFormValues = z.infer<typeof loginSchema>;
