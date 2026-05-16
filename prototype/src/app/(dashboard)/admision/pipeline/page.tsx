"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import type {
  NivelEducativo,
  ProspectInteraction,
  ProspectPrioridad,
} from "@/lib/mock/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

const PRIORIDAD_VARIANT: Record<
  ProspectPrioridad,
  "default" | "secondary" | "outline"
> = {
  alta: "default",
  media: "secondary",
  baja: "outline",
};

const PRIORIDAD_COLOR: Record<ProspectPrioridad, string> = {
  alta: "border-l-red-500",
  media: "border-l-yellow-500",
  baja: "border-l-slate-400",
};

// ── ProspectCard (draggable) ──────────────────────────────────────────────────

interface ProspectCardProps {
  id: string;
  nombre: string;
  gradoPostulado: string;
  celular: string;
  prioridad: ProspectPrioridad;
  onDetail: () => void;
  isDragOverlay?: boolean;
}

function ProspectCard({
  id,
  nombre,
  gradoPostulado,
  celular,
  prioridad,
  onDetail,
  isDragOverlay = false,
}: ProspectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={isDragOverlay ? undefined : style}
      {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
      className={`rounded-md border-l-4 border border-border bg-card p-2.5 shadow-sm text-xs select-none ${
        PRIORIDAD_COLOR[prioridad]
      } ${
        isDragOverlay
          ? "shadow-xl rotate-1 scale-105"
          : "hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate leading-tight">{nombre}</p>
          <p className="text-muted-foreground mt-0.5 truncate">{gradoPostulado}</p>
          <p className="text-muted-foreground">{celular}</p>
        </div>
        <Badge variant={PRIORIDAD_VARIANT[prioridad]} className="text-[10px] px-1 py-0 shrink-0">
          {prioridad}
        </Badge>
      </div>
      {!isDragOverlay && (
        <Button
          size="xs"
          variant="outline"
          className="mt-2 w-full"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onDetail}
        >
          Ver detalle
        </Button>
      )}
    </div>
  );
}

// ── KanbanColumn ──────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  id: string;
  title: string;
  orden: number;
  prospectIds: string[];
  children: React.ReactNode;
  isOver: boolean;
}

function KanbanColumn({ id, title, orden, prospectIds, children, isOver }: KanbanColumnProps) {
  const { setNodeRef } = useSortable({ id, disabled: true });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border bg-muted/30 transition-colors ${
        isOver ? "ring-2 ring-primary/50 bg-primary/5" : ""
      }`}
      style={{ minHeight: 240 }}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {orden}. {title}
        </span>
        <Badge variant="outline" className="tabular-nums text-[10px] px-1.5 py-0">
          {prospectIds.length}
        </Badge>
      </div>
      <SortableContext items={prospectIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 p-2">
          {prospectIds.length === 0 && (
            <p className="text-muted-foreground text-xs text-center pt-6">
              Arrastra un prospecto aquí
            </p>
          )}
          {children}
        </div>
      </SortableContext>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

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

  // Nuevo prospecto
  const [newOpen, setNewOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [celular, setCelular] = React.useState("");
  const [grado, setGrado] = React.useState("1° primaria");
  const [nivel, setNivel] = React.useState<NivelEducativo>("primaria");
  const [prioridad, setPrioridad] = React.useState<ProspectPrioridad>("media");

  // Detalle / interacción
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [tipo, setTipo] = React.useState<ProspectInteraction["tipo"]>("llamada");
  const [resumen, setResumen] = React.useState("");

  // DnD state
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overColumnId, setOverColumnId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const selected = selectedId
    ? prospects.find((p) => p.id === selectedId) ?? null
    : null;
  const history = selectedId
    ? prospectInteractions
        .filter((i) => i.prospectId === selectedId)
        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
    : [];

  const activeProspect = activeId
    ? prospects.find((p) => p.id === activeId)
    : null;

  // ── DnD handlers ──
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    if (!over) { setOverColumnId(null); return; }

    const overId = over.id as string;
    // Is the target a stage column?
    const isStage = stages.some((s) => s.id === overId);
    if (isStage) {
      setOverColumnId(overId);
      return;
    }
    // Target is another prospect card — find its column
    const targetProspect = prospects.find((p) => p.id === overId);
    if (targetProspect) setOverColumnId(targetProspect.currentStageId);
    else setOverColumnId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverColumnId(null);
    if (!over) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    // Determine target stage
    const isStage = stages.some((s) => s.id === overId);
    let targetStageId: string | null = null;

    if (isStage) {
      targetStageId = overId;
    } else {
      // Dropped over another prospect card
      const targetProspect = prospects.find((p) => p.id === overId);
      if (targetProspect) targetStageId = targetProspect.currentStageId;
    }

    if (!targetStageId) return;

    const draggedProspect = prospects.find((p) => p.id === draggedId);
    if (!draggedProspect) return;
    if (draggedProspect.currentStageId === targetStageId) return;

    moveProspectStage(draggedId, targetStageId);
  }

  function submitProspect() {
    if (!nombre.trim() || !celular.trim()) return;
    addProspect({ nombre: nombre.trim(), celular: celular.trim(), gradoPostulado: grado, nivel, prioridad });
    setNombre(""); setCelular(""); setGrado("1° primaria"); setNivel("primaria"); setPrioridad("media");
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
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">A-2 · CRM / Pipeline de admisión</h1>
          <p className="text-muted-foreground text-sm">
            Tablero Kanban con arrastrar y soltar. Mueve los prospectos entre etapas.
          </p>
        </div>
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogTrigger
            render={
              <Button className="inline-flex items-center gap-2">
                <Plus className="size-4" />
                Nuevo prospecto
              </Button>
            }
          />
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
                <Input value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="959000000" />
              </div>
              <div className="grid gap-2">
                <Label>Grado postulado</Label>
                <Select value={grado} onValueChange={(v) => setGrado(v || "")}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Seleccionar grado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inicial 5 años">Inicial 5 años</SelectItem>
                    <SelectItem value="1° primaria">1° primaria</SelectItem>
                    <SelectItem value="2° primaria">2° primaria</SelectItem>
                    <SelectItem value="3° primaria">3° primaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Nivel</Label>
                <Select value={nivel} onValueChange={(v) => setNivel(v as NivelEducativo)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inicial">Inicial</SelectItem>
                    <SelectItem value="primaria">Primaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Prioridad</Label>
                <Select value={prioridad} onValueChange={(v) => setPrioridad(v as ProspectPrioridad)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewOpen(false)}>Cancelar</Button>
              <Button onClick={submitProspect}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          className="grid gap-3 overflow-x-auto pb-2"
          style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(200px, 1fr))` }}
        >
          {stages.map((stage) => {
            const stageProspects = prospects.filter(
              (p) => p.currentStageId === stage.id,
            );
            const ids = stageProspects.map((p) => p.id);
            return (
              <KanbanColumn
                key={stage.id}
                id={stage.id}
                title={stage.nombre}
                orden={stage.orden}
                prospectIds={ids}
                isOver={overColumnId === stage.id}
              >
                {stageProspects.map((p) => (
                  <ProspectCard
                    key={p.id}
                    id={p.id}
                    nombre={p.nombre}
                    gradoPostulado={p.gradoPostulado}
                    celular={p.celular}
                    prioridad={p.prioridad}
                    onDetail={() => setSelectedId(p.id)}
                  />
                ))}
              </KanbanColumn>
            );
          })}
        </div>

        {/* Drag overlay — ghost card */}
        <DragOverlay>
          {activeProspect && (
            <ProspectCard
              id={activeProspect.id}
              nombre={activeProspect.nombre}
              gradoPostulado={activeProspect.gradoPostulado}
              celular={activeProspect.celular}
              prioridad={activeProspect.prioridad}
              onDetail={() => {}}
              isDragOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Detalle / Interacciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Historial de interacciones
            {selected ? ` — ${selected.nombre}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selected ? (
            <p className="text-muted-foreground text-sm">
              Haz clic en &quot;Ver detalle&quot; en cualquier tarjeta del tablero.
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              {/* Timeline */}
              <div>
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Sin interacciones registradas.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {history.map((i) => (
                      <li key={i.id} className="rounded-md border p-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold capitalize">{i.tipo}</span>
                          <span className="text-muted-foreground">
                            {new Date(i.fecha).toLocaleString("es-PE")}
                          </span>
                        </div>
                        <p className="mt-1">{i.resumen}</p>
                        <p className="text-muted-foreground mt-1 text-xs">por {i.autor}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Nueva interacción */}
              <div className="space-y-3">
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <Select value={tipo} onValueChange={(v) => setTipo(v as ProspectInteraction["tipo"])}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llamada">Llamada</SelectItem>
                      <SelectItem value="correo">Correo</SelectItem>
                      <SelectItem value="entrevista">Entrevista</SelectItem>
                      <SelectItem value="nota">Nota</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Resumen</Label>
                  <Textarea
                    rows={3}
                    value={resumen}
                    onChange={(e) => setResumen(e.target.value)}
                    placeholder="Qué se habló, acuerdos, próximos pasos."
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
