import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EvaluationFormValues } from "../../_types/evaluation.types";

interface EvaluationDetailsProps {
  selectedProspect: any;
  form: UseFormReturn<EvaluationFormValues>;
  onSubmit: (data: EvaluationFormValues) => void;
  isPending: boolean;
  activeTab: "verdict" | "process" | "profile";
  setActiveTab: (tab: "verdict" | "process" | "profile") => void;
}

export function EvaluationDetails({
  selectedProspect,
  form,
  onSubmit,
  isPending,
  activeTab,
  setActiveTab,
}: EvaluationDetailsProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const aptitudeStatus = watch("aptitude");

  if (!selectedProspect) {
    return (
      <div className="bg-card border-border/80 flex flex-col justify-between rounded-xl border p-6 md:col-span-2">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Award className="text-muted-foreground/30 mb-4 size-14 stroke-[1.25]" />
          <h3 className="text-foreground text-lg font-semibold">Selecciona un postulante</h3>
          <p className="text-muted-foreground max-w-sm mt-1 text-sm leading-relaxed">
            Selecciona uno de los postulantes de la lista de la izquierda para registrar sus calificaciones y dictamen final de aptitud.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-border/80 flex flex-col justify-between rounded-xl border p-6 md:col-span-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Profile Overview */}
        <div className="border-b border-border/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-foreground text-lg font-semibold">{selectedProspect.name}</h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              Grado: {selectedProspect.targetGrade} · Prioridad: {selectedProspect.priority}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium">Dictamen:</span>
            <span
              className={`px-2 py-0.5 rounded text-[0.7rem] font-bold uppercase border ${
                selectedProspect.evaluation?.aptitude === "FIT"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : selectedProspect.evaluation?.aptitude === "UNFIT"
                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              }`}
            >
              {selectedProspect.evaluation?.aptitude === "FIT" ? "APTO" : selectedProspect.evaluation?.aptitude === "UNFIT" ? "NO APTO" : "PENDIENTE"}
            </span>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex border-b border-border/60 gap-2">
          {[
            { id: "verdict", label: "📁 Dictamen Final" },
            { id: "process", label: "📈 Proceso y Citas" },
            { id: "profile", label: "👤 Ficha Postulante" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 -mb-[2px] cursor-pointer ${
                  isActive
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Dictamen Final */}
        {activeTab === "verdict" && (
          <div className="flex flex-col gap-6 animate-in fade-in-50 duration-200">
            {selectedProspect.evaluation?.aptitude === "FIT" && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 p-3.5 rounded-lg text-xs leading-relaxed flex items-start gap-2.5">
                <CheckCircle className="size-4 shrink-0 mt-0.5 text-green-500" />
                <div>
                  <span className="font-bold">Dictamen Consolidado:</span> Este postulante ya ha sido calificado como <strong className="font-bold">APTO</strong>. El proceso de admisión para este alumno se encuentra finalizado y habilitado para el módulo de Matrícula. No se admiten modificaciones adicionales.
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold">Dictamen de Aptitud *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "PENDING", label: "Pendiente", color: "border-yellow-500/50 hover:bg-yellow-500/5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
                    { value: "FIT", label: "Apto", color: "border-green-500/50 hover:bg-green-500/5 bg-green-500/10 text-green-600 dark:text-green-400" },
                    { value: "UNFIT", label: "No Apto", color: "border-red-500/50 hover:bg-red-500/5 bg-red-500/10 text-red-600 dark:text-red-400" },
                  ].map((opt) => {
                    const isActive = aptitudeStatus === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          if (selectedProspect.evaluation?.aptitude === "FIT") {
                            // If already FIT, handled in parent
                          }
                          setValue("aptitude", opt.value as any);
                        }}
                        className={`cursor-pointer border rounded-lg p-3 text-center text-xs font-semibold transition-all ${
                          isActive
                            ? `${opt.color} ring-1 ring-primary border-primary`
                            : "border-border/60 hover:bg-muted/40"
                        } ${
                          selectedProspect.evaluation?.aptitude === "FIT" && opt.value !== "FIT"
                            ? "opacity-60"
                            : ""
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="comments" className={cn(errors.comments && "text-red-500")}>Observaciones / Comentarios del Evaluador</Label>
                <Textarea
                  id="comments"
                  placeholder="Detalla los puntos fuertes o limitaciones encontradas en la entrevista/examen..."
                  {...register("comments")}
                  disabled={selectedProspect.evaluation?.aptitude === "FIT"}
                  className={cn("min-h-[120px]", errors.comments && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.comments?.message && (
                  <p className="text-red-500 text-xs mt-1">{String(errors.comments.message)}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                disabled={isPending || selectedProspect.evaluation?.aptitude === "FIT"}
                className="cursor-pointer"
              >
                {isPending ? "Guardando..." : "Guardar Calificación"}
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Proceso de Admisión (Timeline) */}
        {activeTab === "process" && (
          <div className="flex flex-col gap-4 animate-in fade-in-50 duration-200">
            <div className="bg-muted/30 border border-border/50 rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wider">Etapa Actual en Admisión</span>
                <span className="text-sm font-semibold text-foreground mt-0.5">{selectedProspect.stageName || "Sin Etapa"}</span>
              </div>
              <div className="bg-primary/10 text-primary px-2.5 py-1 rounded text-xs font-bold uppercase border border-primary/20">
                En Proceso
              </div>
            </div>

            <div className="relative border-l-2 border-border/60 pl-6 ml-3 flex flex-col gap-6 my-4">
              {/* Paso 1: Registro */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 bg-background border-2 border-primary rounded-full size-4 flex items-center justify-center shrink-0">
                  <span className="bg-primary rounded-full size-1.5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">Registro del Postulante</span>
                  <span className="text-[0.7rem] text-muted-foreground mt-0.5">
                    Ingreso a la base de admisiones el {new Date(selectedProspect.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              {/* Paso 2: Historial de Citas */}
              {selectedProspect.appointments && selectedProspect.appointments.length > 0 ? (
                selectedProspect.appointments.map((a: any) => {
                  const appointmentDate = new Date(a.date);
                  return (
                    <div key={a.id} className="relative">
                      <span className="absolute -left-[31px] top-0 bg-background border-2 border-border rounded-full size-4 flex items-center justify-center shrink-0">
                        <span className="bg-muted-foreground/60 rounded-full size-1.5" />
                      </span>
                      <div className="bg-muted/15 border border-border/40 rounded-lg p-3 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-foreground">{a.type}</span>
                          <span className="text-[0.65rem] text-muted-foreground font-semibold">
                            {appointmentDate.toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                        {a.notes ? (
                          <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2 mt-1 leading-relaxed">
                            "{a.notes}"
                          </p>
                        ) : (
                          <span className="text-xs text-muted-foreground/50 italic mt-0.5">Sin observaciones registradas.</span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 bg-background border-2 border-border rounded-full size-4 flex items-center justify-center shrink-0">
                    <span className="bg-muted-foreground/40 rounded-full size-1.5" />
                  </span>
                  <div className="text-xs text-muted-foreground italic pl-1">
                    No registra citas programadas para este proceso.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Ficha General del Postulante */}
        {activeTab === "profile" && (
          <div className="flex flex-col gap-4 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="flex flex-col gap-0.5 bg-muted/10 border border-border/30 rounded-lg p-3">
                <span className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wider">Teléfono de Contacto</span>
                <span className="text-sm font-semibold text-foreground mt-0.5">{selectedProspect.phone}</span>
              </div>

              <div className="flex flex-col gap-0.5 bg-muted/10 border border-border/30 rounded-lg p-3">
                <span className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wider">Nivel Educativo</span>
                <span className="text-sm font-semibold text-foreground mt-0.5">
                  {selectedProspect.level === "INITIAL" ? "Inicial" : selectedProspect.level === "PRIMARY" ? "Primaria" : "Secundaria"}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 bg-muted/10 border border-border/30 rounded-lg p-3">
                <span className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wider">Grado al que Postula</span>
                <span className="text-sm font-semibold text-foreground mt-0.5">{selectedProspect.targetGrade}</span>
              </div>

              <div className="flex flex-col gap-0.5 bg-muted/10 border border-border/30 rounded-lg p-3">
                <span className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wider">Prioridad en Proceso</span>
                <span className={`text-xs font-bold uppercase mt-1 w-fit px-2 py-0.5 rounded border ${
                  selectedProspect.priority === "HIGH"
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : selectedProspect.priority === "MEDIUM"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                }`}>
                  {selectedProspect.priority === "HIGH" ? "Alta" : selectedProspect.priority === "MEDIUM" ? "Media" : "Baja"}
                </span>
              </div>

              <div className="col-span-2 flex flex-col gap-0.5 bg-muted/10 border border-border/30 rounded-lg p-3">
                <span className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wider">Fecha de Creación en Sistema</span>
                <span className="text-sm font-medium text-foreground mt-0.5">
                  {new Date(selectedProspect.createdAt).toLocaleString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
