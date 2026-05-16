"use client";

import * as React from "react";
import { CheckCircle2, ClipboardList, HelpCircle, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useDemoData } from "@/context/demo-data-context";
import type { EvaluationAptitud } from "@/lib/mock/types";

const APTITUD_CONFIG: Record<
  EvaluationAptitud,
  { label: string; variant: "default" | "secondary" | "destructive"; icon: React.ElementType }
> = {
  apto: { label: "Apto", variant: "default", icon: CheckCircle2 },
  no_apto: { label: "No Apto", variant: "destructive", icon: XCircle },
  pendiente: { label: "Pendiente", variant: "secondary", icon: HelpCircle },
};

export default function EvaluacionAdmisionPage() {
  const { prospects, evaluationResults, setEvaluationResult, admissionStages } =
    useDemoData();

  const [filtro, setFiltro] = React.useState<EvaluationAptitud | "todos">("todos");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null);
  const [aptitud, setAptitud] = React.useState<EvaluationAptitud>("pendiente");
  const [comentarios, setComentarios] = React.useState("");
  const [evaluador, setEvaluador] = React.useState("Lic. Luisa Rojas");

  const acceptedStage = admissionStages.find((s) => s.nombre === "Aceptado");

  const getResult = (prospectId: string) =>
    evaluationResults.find((e) => e.prospectId === prospectId);

  const filteredProspects =
    filtro === "todos"
      ? prospects
      : prospects.filter((p) => {
          const result = getResult(p.id);
          const aptitudActual = result?.aptitud ?? "pendiente";
          return aptitudActual === filtro;
        });

  function openDialog(prospectId: string) {
    const existing = getResult(prospectId);
    setSelectedProspectId(prospectId);
    setAptitud(existing?.aptitud ?? "pendiente");
    setComentarios(existing?.comentarios ?? "");
    setEvaluador(existing?.evaluador ?? "Lic. Luisa Rojas");
    setDialogOpen(true);
  }

  function handleSave() {
    if (!selectedProspectId) return;
    setEvaluationResult({
      prospectId: selectedProspectId,
      aptitud,
      comentarios,
      evaluador,
    });
    setDialogOpen(false);
    setSelectedProspectId(null);
  }

  const totalApto = prospects.filter((p) => getResult(p.id)?.aptitud === "apto").length;
  const totalNoApto = prospects.filter((p) => getResult(p.id)?.aptitud === "no_apto").length;
  const totalPendiente = prospects.filter(
    (p) => (getResult(p.id)?.aptitud ?? "pendiente") === "pendiente",
  ).length;

  const selectedProspect = selectedProspectId
    ? prospects.find((p) => p.id === selectedProspectId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">A-4 · Evaluación de Resultados</h1>
        <p className="text-muted-foreground text-sm">
          Registro del dictamen final por postulante (Apto / No Apto). Al marcar
          como Apto, el prospecto avanza automáticamente a la etapa{" "}
          <strong>
            {acceptedStage ? `"${acceptedStage.nombre}"` : "Aceptado"}
          </strong>
          .
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <CheckCircle2 className="size-8 text-green-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{totalApto}</p>
              <p className="text-muted-foreground text-xs">Aptos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <XCircle className="size-8 text-red-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{totalNoApto}</p>
              <p className="text-muted-foreground text-xs">No Aptos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <HelpCircle className="size-8 text-yellow-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{totalPendiente}</p>
              <p className="text-muted-foreground text-xs">Pendientes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de prospectos + dictamen */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Dictamen por postulante</CardTitle>
              <CardDescription>
                Haz clic en &quot;Registrar dictamen&quot; para actualizar el resultado de cada postulante.
              </CardDescription>
            </div>
            <Select value={filtro} onValueChange={(v) => setFiltro(v as EvaluationAptitud | "todos")}>
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="apto">Aptos</SelectItem>
                <SelectItem value="no_apto">No Aptos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredProspects.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No hay postulantes para el filtro seleccionado.
              </p>
            )}
            {filteredProspects.map((p) => {
              const result = getResult(p.id);
              const aptitudActual = result?.aptitud ?? "pendiente";
              const cfg = APTITUD_CONFIG[aptitudActual];
              const Icon = cfg.icon;
              const stage = admissionStages.find((s) => s.id === p.currentStageId);
              return (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-medium truncate">{p.nombre}</p>
                    <p className="text-muted-foreground text-xs">
                      {p.gradoPostulado} · {p.celular}
                      {stage && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide font-semibold text-primary/70">
                          [Etapa: {stage.nombre}]
                        </span>
                      )}
                    </p>
                    {result && (
                      <p className="text-muted-foreground text-xs">
                        Evaluador: {result.evaluador} · {result.fechaDictamen}
                      </p>
                    )}
                    {result?.comentarios && (
                      <p className="text-xs text-muted-foreground italic truncate max-w-xs">
                        {result.comentarios}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={cfg.variant} className="inline-flex items-center gap-1">
                      <Icon className="size-3" />
                      {cfg.label}
                    </Badge>
                    <Button
                      size="xs"
                      variant="outline"
                      className="inline-flex items-center gap-1"
                      onClick={() => openDialog(p.id)}
                    >
                      <ClipboardList className="size-3" />
                      {result ? "Editar dictamen" : "Registrar dictamen"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de dictamen */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Dictamen — {selectedProspect?.nombre ?? ""}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Resultado</Label>
              <div className="flex gap-2">
                {(["apto", "pendiente", "no_apto"] as EvaluationAptitud[]).map((a) => {
                  const cfg = APTITUD_CONFIG[a];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAptitud(a)}
                      className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                        aptitud === a
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <Icon className="size-4" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Evaluador</Label>
              <Input
                value={evaluador}
                onChange={(e) => setEvaluador(e.target.value)}
                placeholder="Nombre del evaluador"
              />
            </div>
            <div className="grid gap-2">
              <Label>Comentarios</Label>
              <Textarea
                rows={3}
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Observaciones del proceso, fortalezas, áreas de mejora..."
              />
            </div>
            {aptitud === "apto" && (
              <p className="rounded-md bg-green-500/10 border border-green-500/30 p-2 text-xs text-green-700 dark:text-green-400">
                ✅ Al guardar, el postulante avanzará automáticamente a la etapa{" "}
                <strong>
                  {acceptedStage ? `"${acceptedStage.nombre}"` : "Aceptado"}
                </strong>{" "}
                en el pipeline.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar dictamen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
