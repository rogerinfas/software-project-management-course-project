"use client";

import * as React from "react";

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
import { useDemoData } from "@/context/demo-data-context";
import type {
  NivelEducativo,
  ProspectInteraction,
  ProspectPrioridad,
} from "@/lib/mock/types";

const PRIORIDAD_VARIANT: Record<ProspectPrioridad, "default" | "secondary" | "outline"> = {
  alta: "default",
  media: "secondary",
  baja: "outline",
};

export default function PipelinePage() {
  const {
    admissionStages,
    prospects,
    prospectInteractions,
    addProspect,
    moveProspectStage,
    addProspectInteraction,
  } = useDemoData();

  const stages = admissionStages.slice().sort((a, b) => a.orden - b.orden);

  const [newOpen, setNewOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [celular, setCelular] = React.useState("");
  const [grado, setGrado] = React.useState("1° primaria");
  const [nivel, setNivel] = React.useState<NivelEducativo>("primaria");
  const [prioridad, setPrioridad] = React.useState<ProspectPrioridad>("media");

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [tipo, setTipo] = React.useState<ProspectInteraction["tipo"]>("llamada");
  const [resumen, setResumen] = React.useState("");

  const selected = selectedId
    ? prospects.find((p) => p.id === selectedId) ?? null
    : null;
  const history = selectedId
    ? prospectInteractions
        .filter((i) => i.prospectId === selectedId)
        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
    : [];

  function submitProspect() {
    if (!nombre.trim() || !celular.trim()) return;
    addProspect({
      nombre: nombre.trim(),
      celular: celular.trim(),
      gradoPostulado: grado,
      nivel,
      prioridad,
    });
    setNombre("");
    setCelular("");
    setGrado("1° primaria");
    setNivel("primaria");
    setPrioridad("media");
    setNewOpen(false);
  }

  function submitInteraction() {
    if (!selectedId || !resumen.trim()) return;
    addProspectInteraction({
      prospectId: selectedId,
      fecha: new Date().toISOString(),
      tipo,
      resumen: resumen.trim(),
      autor: "Admisión",
    });
    setResumen("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">A-2 · CRM / Pipeline de admisión</h1>
          <p className="text-muted-foreground text-sm">
            Tablero Kanban por etapa e historial de interacciones por prospecto.
          </p>
        </div>
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogTrigger render={<Button>Nuevo prospecto</Button>} />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar prospecto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Nombre completo</Label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Celular</Label>
                <Input
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="959000000"
                />
              </div>
              <div className="grid gap-2">
                <Label>Grado postulado</Label>
                <select
                  className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                >
                  <option>Inicial 5 años</option>
                  <option>1° primaria</option>
                  <option>2° primaria</option>
                  <option>3° primaria</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Nivel</Label>
                <select
                  className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as NivelEducativo)}
                >
                  <option value="inicial">Inicial</option>
                  <option value="primaria">Primaria</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Prioridad</Label>
                <select
                  className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
                  value={prioridad}
                  onChange={(e) =>
                    setPrioridad(e.target.value as ProspectPrioridad)
                  }
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={submitProspect}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        {stages.map((stage) => {
          const list = prospects.filter((p) => p.currentStageId === stage.id);
          return (
            <Card key={stage.id} className="min-h-[220px]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>
                    {stage.orden}. {stage.nombre}
                  </span>
                  <Badge variant="outline" className="tabular-nums">
                    {list.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {list.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Sin prospectos en esta etapa.
                  </p>
                ) : null}
                {list.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-md border p-2 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{p.nombre}</span>
                      <Badge variant={PRIORIDAD_VARIANT[p.prioridad]}>
                        {p.prioridad}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {p.gradoPostulado} · {p.celular}
                    </p>
                    <div className="mt-2 flex gap-1">
                      <select
                        className="border-input h-7 w-full rounded border px-1 text-xs"
                        value={p.currentStageId}
                        onChange={(e) =>
                          moveProspectStage(p.id, e.target.value)
                        }
                      >
                        {stages.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.orden}. {s.nombre}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setSelectedId(p.id)}
                      >
                        Detalle
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Historial de interacciones{selected ? ` — ${selected.nombre}` : ""}
          </CardTitle>
          <CardDescription>
            Selecciona un prospecto desde el tablero para registrar nuevas
            interacciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selected ? (
            <p className="text-muted-foreground text-sm">
              Ningún prospecto seleccionado.
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <div>
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Sin interacciones registradas para este prospecto.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {history.map((i) => (
                      <li key={i.id} className="rounded-md border p-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium capitalize">{i.tipo}</span>
                          <span className="text-muted-foreground">
                            {new Date(i.fecha).toLocaleString("es-PE")}
                          </span>
                        </div>
                        <p className="mt-1">{i.resumen}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          por {i.autor}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-y-3">
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <select
                    className="border-input h-8 rounded-lg border px-2 text-sm"
                    value={tipo}
                    onChange={(e) =>
                      setTipo(e.target.value as ProspectInteraction["tipo"])
                    }
                  >
                    <option value="llamada">Llamada</option>
                    <option value="correo">Correo</option>
                    <option value="entrevista">Entrevista</option>
                    <option value="nota">Nota</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Resumen</Label>
                  <Textarea
                    rows={3}
                    value={resumen}
                    onChange={(e) => setResumen(e.target.value)}
                    placeholder="Qué se habló, acuerdos, siguientes pasos."
                  />
                </div>
                <Button onClick={submitInteraction}>Registrar interacción</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
