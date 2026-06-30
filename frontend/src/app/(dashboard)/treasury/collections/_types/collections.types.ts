import * as z from "zod";
import { bulkSchema, singleSchema, paymentSchema } from "../_schemas/collections.schema";

export type BulkFormValues = z.infer<typeof bulkSchema>;
export type SingleFormValues = z.infer<typeof singleSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
