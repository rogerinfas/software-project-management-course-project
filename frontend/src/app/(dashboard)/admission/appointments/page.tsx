"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { appointmentSchema } from "./_schemas/appointments.schema";
import { AppointmentFormValues, Appointment } from "./_types/appointments.types";
import { useAppointments, useAppointmentsMutations } from "./_hooks/appointments-hooks";

import { AppointmentsHeader } from "./_components/header/appointments-header";
import { AppointmentsList } from "./_components/table/appointments-list";
import { AppointmentCreateForm } from "./_components/create/appointment-create-form";

export default function AppointmentsPage() {
  const [search, setSearch] = React.useState("");
  const [prospectSearch, setProspectSearch] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // React Hook Form
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      prospectId: "",
      date: "",
      time: "09:00",
      type: "ENTREVISTA",
      notes: "",
    },
  });

  // Data & Mutations
  const { appointments, appointmentsLoading, prospectsResponse } = useAppointments();
  const { scheduleMutation } = useAppointmentsMutations();

  // Prospects derived state
  const prospects = React.useMemo(() => {
    if (!prospectsResponse?.data) return [];
    return prospectsResponse.data as any[];
  }, [prospectsResponse]);

  // Appointments derived state
  const filteredAppointments = React.useMemo(() => {
    if (!appointments) return [];
    return (appointments as any).filter((app: any) =>
      app.prospect?.name.toLowerCase().includes(search.toLowerCase()) ||
      app.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [appointments, search]);

  // Handlers
  const onSubmitForm = (data: AppointmentFormValues) => {
    if (!data.prospectId || !data.date || !data.time) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const fullDateTime = new Date(`${data.date}T${data.time}:00`);

    scheduleMutation.mutate(
      {
        body: {
          prospectId: data.prospectId,
          date: fullDateTime.toISOString(),
          type: data.type,
          notes: data.notes,
        },
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          form.reset();
        },
      }
    );
  };

  if (appointmentsLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando agenda de citas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AppointmentsHeader />

      <div className="grid gap-6 md:grid-cols-3">
        <AppointmentsList
          search={search}
          setSearch={setSearch}
          filteredAppointments={filteredAppointments}
        />

        <AppointmentCreateForm
          isCreateOpen={isCreateOpen}
          setIsCreateOpen={setIsCreateOpen}
          form={form}
          onSubmit={onSubmitForm}
          isPending={scheduleMutation.isPending}
          prospects={prospects}
          prospectSearch={prospectSearch}
          setProspectSearch={setProspectSearch}
        />
      </div>
    </div>
  );
}
