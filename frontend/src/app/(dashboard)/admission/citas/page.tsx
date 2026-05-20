"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  User,
  FileText,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backend } from "@/lib/api/types/backend";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // Form states
  const [selectedProspectId, setSelectedProspectId] = React.useState("");
  const [appointmentDate, setAppointmentDate] = React.useState("");
  const [appointmentTime, setAppointmentTime] = React.useState("09:00");
  const [appointmentType, setAppointmentType] = React.useState("ENTREVISTA");
  const [appointmentNotes, setAppointmentNotes] = React.useState("");

  // Queries
  const { data: stages, isLoading: stagesLoading } = backend.useQuery("get", "/api/admission/stages", {});
  const { data: appointments, isLoading: appointmentsLoading } = backend.useQuery("get", "/api/admission/appointments", {});

  // Extract all prospects
  const prospects = React.useMemo(() => {
    if (!stages) return [];
    return (stages as any).flatMap((s: any) => s.prospects || []);
  }, [stages]);

  // Mutations
  const scheduleMutation = backend.useMutation("post", "/api/admission/appointments", {
    onSuccess: () => {
      toast.success("Cita agendada con éxito");
      setIsCreateOpen(false);
      setSelectedProspectId("");
      setAppointmentDate("");
      setAppointmentNotes("");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/stages"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al agendar la cita");
    },
  });

  // Filtered appointments
  const filteredAppointments = React.useMemo(() => {
    if (!appointments) return [];
    return (appointments as any).filter((app: any) =>
      app.prospect?.name.toLowerCase().includes(search.toLowerCase()) ||
      app.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [appointments, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProspectId || !appointmentDate || !appointmentTime) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const fullDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    scheduleMutation.mutate({
      body: {
        prospectId: selectedProspectId,
        date: fullDateTime.toISOString(),
        type: appointmentType,
        notes: appointmentNotes,
      },
    });
  };

  if (stagesLoading || appointmentsLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando agenda de citas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Agenda de Citas</h2>
          <p className="text-muted-foreground text-sm">
            Programa y gestiona las entrevistas y evaluaciones psicológicas de los postulantes.
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} className="cursor-pointer">
          <Plus className="mr-2 size-4" />
          Programar Cita
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main List Column */}
        <div className="bg-card border-border/80 flex flex-col gap-4 rounded-xl border p-6 md:col-span-2">
          <div className="relative w-full sm:w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por postulante o tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-col gap-3 mt-2">
            {filteredAppointments.length === 0 ? (
              <div className="text-muted-foreground py-16 text-center text-sm">
                No hay citas programadas que coincidan con la búsqueda.
              </div>
            ) : (
              filteredAppointments.map((app: any) => {
                const dateObj = new Date(app.date);
                return (
                  <div
                    key={app.id}
                    className="bg-muted/30 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg p-4 transition-all hover:bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                        <CalendarIcon className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {app.prospect?.name || "Postulante Desconocido"}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-0.5">
                          <span className="bg-primary/5 text-primary border border-primary/20 rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase">
                            {app.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {format(dateObj, "dd 'de' MMMM, yyyy - hh:mm a", { locale: es })}
                          </span>
                        </div>
                        {app.notes && (
                          <p className="text-muted-foreground text-xs italic mt-2 border-l-2 border-border/60 pl-2">
                            {app.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Info or Add Form Column */}
        <div className="bg-card border-border/80 flex flex-col justify-between rounded-xl border p-6 md:col-span-1">
          {isCreateOpen ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="text-foreground text-lg font-semibold">Programar Cita</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Selecciona un postulante de la base de admisiones para fijar una entrevista.
              </p>

              <div className="flex flex-col gap-1.5 mt-2">
                <Label htmlFor="prospect">Postulante *</Label>
                <select
                  id="prospect"
                  value={selectedProspectId}
                  onChange={(e) => setSelectedProspectId(e.target.value)}
                  className="bg-background border-input text-foreground h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                >
                  <option value="">Selecciona un postulante...</option>
                  {prospects.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.targetGrade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="time">Hora *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="type">Tipo de Cita *</Label>
                <select
                  id="type"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="bg-background border-input text-foreground h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                >
                  <option value="ENTREVISTA">Entrevista Familiar</option>
                  <option value="EVALUACION_PSICOLOGICA">Evaluación Psicológica</option>
                  <option value="EXAMEN_CONOCIMIENTO">Examen de Conocimientos</option>
                  <option value="ENTREGA_RESULTADOS">Entrega de Resultados</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">Notas / Indicaciones</Label>
                <textarea
                  id="notes"
                  placeholder="ej. Traer libreta original..."
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  className="bg-background border-input text-foreground min-h-[80px] w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="cursor-pointer" disabled={scheduleMutation.isPending}>
                  {scheduleMutation.isPending ? "Programando..." : "Programar"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="text-foreground text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="text-primary size-5" /> Reglas de la Agenda
              </h3>
              <ul className="text-muted-foreground text-xs leading-relaxed flex flex-col gap-2.5 list-disc pl-4 mt-2">
                <li>Las citas y entrevistas deben ser programadas previo acuerdo telefónico o por correo con el apoderado.</li>
                <li>Los resultados de las evaluaciones psicológicas y académicas se registran directamente en el panel de **Evaluación / Dictamen**.</li>
                <li>Es obligatorio detallar las notas o requisitos especiales para cada tipo de evaluación (ej. portar cartuchera).</li>
              </ul>
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 cursor-pointer"
              >
                Programar Cita
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
