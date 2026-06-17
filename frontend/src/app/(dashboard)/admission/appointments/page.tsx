"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Clock,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { backend } from "@/lib/api/types/backend";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const appointmentSchema = z.object({
  prospectId: z.string().min(1, "Debe seleccionar un postulante"),
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().min(1, "La hora es requerida"),
  type: z.enum(["ENTREVISTA", "EXAMEN"]),
  notes: z.string().optional(),
});

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // React Hook Form
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      prospectId: "",
      date: "",
      time: "09:00",
      type: "ENTREVISTA" as "ENTREVISTA" | "EXAMEN",
      notes: "",
    },
  });

  const selectedProspectId = watch("prospectId");
  const appointmentDate = watch("date");
  const appointmentTime = watch("time");
  const appointmentType = watch("type");

  // Search state for prospects
  const [prospectSearch, setProspectSearch] = React.useState("");

  // Queries
  const { data: appointments, isLoading: appointmentsLoading } = backend.useQuery("get", "/api/admission/appointments", {});
  const { data: stagesData } = backend.useQuery("get", "/api/admission/stages", {});

  // Extract flat list of prospects
  const prospects = React.useMemo(() => {
    if (!stagesData) return [];
    return (stagesData as any).flatMap((s: any) => s.prospects || []);
  }, [stagesData]);

  // Filtered prospects based on search input
  const filteredProspectsList = React.useMemo(() => {
    return prospects.filter((p: any) =>
      p.name.toLowerCase().includes(prospectSearch.toLowerCase())
    );
  }, [prospects, prospectSearch]);

  // Mutations
  const scheduleMutation = backend.useMutation("post", "/api/admission/appointments", {
    onSuccess: () => {
      toast.success("Cita agendada con éxito");
      setIsCreateOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/prospects"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/stages"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
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

  const onSubmitForm = (data: any) => {
    if (!data.prospectId || !data.date || !data.time) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const fullDateTime = new Date(`${data.date}T${data.time}:00`);

    scheduleMutation.mutate({
      body: {
        prospectId: data.prospectId,
        date: fullDateTime.toISOString(),
        type: data.type,
        notes: data.notes,
      },
    });
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Agenda de Citas</h2>
          <p className="text-muted-foreground text-sm">
            Programa y gestiona las entrevistas y evaluaciones psicológicas de los postulantes.
          </p>
        </div>
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
            <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">
              <h3 className="text-foreground text-lg font-semibold">Programar Cita</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Selecciona un postulante de la base de admisiones para fijar una entrevista.
              </p>

              <div className="flex flex-col gap-1.5 mt-2">
                <Label htmlFor="prospect" className={cn(errors.prospectId && "text-red-500")}>Postulante *</Label>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Buscar postulante..."
                    value={prospectSearch}
                    onChange={(e) => setProspectSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                
                {/* Scrollable list of Candidates */}
                <div className={cn("flex flex-col gap-1 overflow-y-auto max-h-[160px] border border-border/50 rounded-lg p-2 bg-muted/10", errors.prospectId && "border-red-500")}>
                  {filteredProspectsList.length === 0 ? (
                    <div className="text-muted-foreground py-6 text-center text-xs">
                      No se encontraron postulantes
                    </div>
                  ) : (
                    filteredProspectsList.map((p: any) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setValue("prospectId", p.id);
                          setValue("prospectId", p.id, { shouldValidate: true });
                        }}
                        className={`w-full flex items-center justify-between rounded p-2 text-left text-xs transition-all cursor-pointer ${
                          selectedProspectId === p.id
                            ? "bg-primary/10 border-primary/40 border text-primary font-semibold"
                            : "hover:bg-muted/60 border border-transparent"
                        }`}
                      >
                        <span>{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{p.targetGrade}</span>
                      </button>
                    ))
                  )}
                </div>
                {errors.prospectId?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.prospectId.message)}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="date" className={cn(errors.date && "text-red-500")}>Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    className={cn(errors.date && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {errors.date?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(errors.date.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="time" className={cn(errors.time && "text-red-500")}>Hora *</Label>
                  <Input
                    id="time"
                    type="time"
                    {...register("time")}
                    className={cn(errors.time && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {errors.time?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(errors.time.message)}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Tipo de Cita *</Label>
                <Select value={appointmentType} onValueChange={(v) => setValue("type", v ?? "ENTREVISTA")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTREVISTA">Entrevista Familiar</SelectItem>
                    <SelectItem value="EVALUACION_PSICOLOGICA">Evaluación Psicológica</SelectItem>
                    <SelectItem value="EXAMEN_CONOCIMIENTO">Examen de Conocimientos</SelectItem>
                    <SelectItem value="ENTREGA_RESULTADOS">Entrega de Resultados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">Notas / Indicaciones</Label>
                <Textarea
                  id="notes"
                  placeholder="ej. Traer libreta original..."
                  {...register("notes")}
                  className="min-h-[80px]"
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
                <li>Los resultados de las evaluaciones psicológicas y académicas se registran directamente en el panel de <strong>Evaluación / Dictamen</strong>.</li>
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
