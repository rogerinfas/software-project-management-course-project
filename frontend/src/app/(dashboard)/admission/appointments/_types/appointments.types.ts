import * as z from "zod";
import { appointmentSchema } from "../_schemas/appointments.schema";

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export interface Appointment {
  id: string;
  prospectId: string;
  date: string;
  type: string;
  notes?: string;
  prospect?: {
    id: string;
    name: string;
  };
}

export interface Prospect {
  id: string;
  name: string;
}
