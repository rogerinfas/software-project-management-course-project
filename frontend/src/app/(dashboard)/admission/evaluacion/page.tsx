"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  User,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backend } from "@/lib/api/types/backend";

export default function EvaluationPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null);

  // Form states
  const [aptitudeStatus, setAptitudeStatus] = React.useState<"APTO" | "NO_APTO" | "PENDIENTE">("PENDIENTE");
  const [comments, setComments] = React.useState("");

  // Queries
  const { data: stages, isLoading } = backend.useQuery("get", "/api/admission/stages", {});

  // Extract all prospects
  const prospects = React.useMemo(() => {
    if (!stages) return [];
    return (stages as any).flatMap((s: any) => s.prospects || []);
  }, [stages]);

  // Filtered prospects
  const filteredProspects = React.useMemo(() => {
    return prospects.filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [prospects, search]);

  const selectedProspect = React.useMemo(() => {
    return prospects.find((p: any) => p.id === selectedProspectId);
  }, [prospects, selectedProspectId]);

  // Set default form values when prospect changes
  React.useEffect(() => {
    if (selectedProspect) {
      setAptitudeStatus((selectedProspect.evaluation?.aptitude as any) || "PENDIENTE");
      setComments(selectedProspect.evaluation?.comments || "");
    }
  }, [selectedProspect]);

  // Mutations
  const evaluateMutation = backend.useMutation("patch", "/api/admission/prospects/{id}/evaluation", {
    onSuccess: () => {
      toast.success("Evaluación guardada con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/stages"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al registrar la evaluación");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProspectId) return;

    evaluateMutation.mutate({
      params: { path: { id: selectedProspectId } },
      body: {
        aptitude: aptitudeStatus,
        comments: comments,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando postulantes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Evaluación y Dictamen</h2>
        <p className="text-muted-foreground text-sm">
          Registra el dictamen final de aptitud académica y psicológica del postulante.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Candidates list */}
        <div className="bg-card border-border/80 flex flex-col gap-4 rounded-xl border p-4 md:col-span-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar postulante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto max-h-[50vh]">
            {filteredProspects.length === 0 ? (
              <div className="text-muted-foreground py-10 text-center text-xs">
                No hay postulantes registrados
              </div>
            ) : (
              filteredProspects.map((p: any) => {
                const status = p.evaluation?.aptitude || "PENDIENTE";
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProspectId(p.id)}
                    className={`flex items-center justify-between rounded-lg p-3 text-left transition-all ${
                      selectedProspectId === p.id
                        ? "bg-primary/10 border-primary border"
                        : "hover:bg-muted/40 border border-transparent"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.targetGrade}</span>
                    </div>

                    {status === "APTO" && (
                      <CheckCircle className="text-green-500 size-4 shrink-0" />
                    )}
                    {status === "NO_APTO" && (
                      <XCircle className="text-red-500 size-4 shrink-0" />
                    )}
                    {status === "PENDIENTE" && (
                      <HelpCircle className="text-yellow-500 size-4 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Evaluation Form & details */}
        <div className="bg-card border-border/80 flex flex-col justify-between rounded-xl border p-6 md:col-span-2">
          {selectedProspect ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                      selectedProspect.evaluation?.aptitude === "APTO"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : selectedProspect.evaluation?.aptitude === "NO_APTO"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}
                  >
                    {selectedProspect.evaluation?.aptitude || "PENDIENTE"}
                  </span>
                </div>
              </div>

              {/* Scheduled Citas Info */}
              <div className="flex flex-col gap-2 bg-muted/20 border border-border/40 rounded-lg p-4">
                <span className="text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> Historial de Citas del Postulante
                </span>
                {selectedProspect.appointments && selectedProspect.appointments.length > 0 ? (
                  <div className="flex flex-col gap-1.5 mt-2">
                    {selectedProspect.appointments.map((a: any) => (
                      <div key={a.id} className="text-xs text-muted-foreground flex items-center justify-between border-b border-border/20 pb-1.5 last:border-0 last:pb-0">
                        <span>{a.type}</span>
                        <span className="font-semibold text-foreground">
                          {new Date(a.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic mt-1">
                    No registra citas programadas para este proceso.
                  </span>
                )}
              </div>

              {/* Form Input fields */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">Dictamen de Aptitud *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "PENDIENTE", label: "Pendiente", color: "border-yellow-500/50 hover:bg-yellow-500/5 bg-yellow-500/10" },
                      { value: "APTO", label: "Apto", color: "border-green-500/50 hover:bg-green-500/5 bg-green-500/10" },
                      { value: "NO_APTO", label: "No Apto", color: "border-red-500/50 hover:bg-red-500/5 bg-red-500/10" },
                    ].map((opt) => {
                      const isActive = aptitudeStatus === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAptitudeStatus(opt.value as any)}
                          className={`cursor-pointer border rounded-lg p-3 text-center text-xs font-semibold transition-all ${
                            isActive
                              ? `${opt.color} ring-1 ring-primary border-primary`
                              : "border-border/60 hover:bg-muted/40"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="comments">Observaciones / Comentarios del Evaluador</Label>
                  <textarea
                    id="comments"
                    placeholder="Detalla los puntos fuertes o limitaciones encontradas en la entrevista/examen..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="bg-background border-input text-foreground min-h-[120px] w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end mt-2">
                <Button type="submit" disabled={evaluateMutation.isPending} className="cursor-pointer">
                  {evaluateMutation.isPending ? "Guardando..." : "Guardar Calificación"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Award className="text-muted-foreground/30 mb-4 size-14 stroke-[1.25]" />
              <h3 className="text-foreground text-lg font-semibold">Selecciona un postulante</h3>
              <p className="text-muted-foreground max-w-sm mt-1 text-sm leading-relaxed">
                Selecciona uno de los postulantes de la lista de la izquierda para registrar sus calificaciones y dictamen final de aptitud.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
