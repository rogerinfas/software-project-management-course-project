import * as z from "zod";
import { tariffSchema } from "../_schemas/tariffs.schema";

export type TariffFormValues = z.infer<typeof tariffSchema>;
