import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Search, CalendarIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { AppointmentFormValues, Prospect } from "../../_types/appointments.types";

interface AppointmentCreateFormProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (val: boolean) => void;
  form: UseFormReturn<AppointmentFormValues>;
  onSubmit: (data: AppointmentFormValues) => void;
  isPending: boolean;
  prospects: Prospect[];
  prospectSearch: string;
  setProspectSearch: (val: string) => void;
}

export function AppointmentCreateForm({
  isCreateOpen,
  setIsCreateOpen,
  form,
  onSubmit,
  isPending,
  prospects,
  prospectSearch,
  setProspectSearch,
}: AppointmentCreateFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const selectedProspectId = watch("prospectId");
  const appointmentType = watch("type");

  const filteredProspectsList = React.useMemo(() => {
    return prospects.filter((p: any) =>
      p.name.toLowerCase().includes(prospectSearch.toLowerCase())
    );
  }, [prospects, prospectSearch]);

  return (
    <div className="bg-card border-border/80 flex flex-col justify-between rounded-xl border p-6 md:col-span-1">
      {isCreateOpen ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            <Select value={appointmentType} onValueChange={(v) => setValue("type", v as any)}>
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
            <Button type="submit" className="cursor-pointer" disabled={isPending}>
              {isPending ? "Programando..." : "Programar"}
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
  );
}
