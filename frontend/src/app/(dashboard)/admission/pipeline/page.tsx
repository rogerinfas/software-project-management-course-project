"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { Plus, Phone, Calendar, User, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

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
import { backend } from "@/lib/api/types/backend";

// ── Helpers ──────────────────────────────────────────────────────────────────

const PRIORIDAD_VARIANT: Record<
  "ALTA" | "MEDIA" | "BAJA",
  "default" | "secondary" | "outline"
> = {
  ALTA: "default",
  MEDIA: "secondary",
  BAJA: "outline",
};

const PRIORIDAD_COLOR: Record<"ALTA" | "MEDIA" | "BAJA", string> = {
  ALTA: "border-l-red-500",
  MEDIA: "border-l-yellow-500",
  BAJA: "border-l-slate-400",
};

// ── ProspectCard (draggable) ──────────────────────────────────────────────────

interface ProspectCardProps {
  id: string;
  nombre: string;
  gradoPostulado: string;
  celular: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
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
          {prioridad === "ALTA" ? "Alta" : prioridad === "MEDIA" ? "Media" : "Baja"}
        </Badge>
      </div>
      {!isDragOverlay && (
        <Button
          size="xs"
          variant="outline"
          className="mt-2 w-full cursor-pointer"
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
            <p className="text-muted-foreground text-[11px] text-center pt-6 italic">
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
  const queryClient = useQueryClient();

  // Queries
  const { data: stagesData, isLoading } = backend.useQuery("get", "/api/admission/stages", {});

  const stages = React.useMemo(() => {
    if (!stagesData) return [];
    return [...(stagesData as any)].sort((a: any, b: any) => a.order - b.order);
  }, [stagesData]);

  const prospects = React.useMemo(() => {
    if (!stages) return [];
    return (stages as any).flatMap((s: any) => s.prospects || []);
  }, [stages]);

  // Mutations
  const createProspectMutation = backend.useMutation("post", "/api/admission/prospects", {
    onSuccess: () => {
      toast.success("Prospecto creado con éxito");
      setNewOpen(false);
      setNombre("");
      setCelular("");
      setGrado("1° primaria");
      setNivel("PRIMARIA");
      setPrioridad("MEDIA");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/stages"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al crear el prospecto");
    },
  });

  const moveProspectMutation = backend.useMutation("patch", "/api/admission/prospects/{id}/stage", {
    onSuccess: () => {
      toast.success("Postulante movido con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/stages"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al mover el postulante");
    },
  });

  // Local storage based interactions for perfect demo fidelity
  const [localInteractions, setLocalInteractions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem("pipeline_interactions");
    if (saved) {
      setLocalInteractions(JSON.parse(saved));
    }
  }, []);

  const saveInteractions = (newInteractions: any[]) => {
    setLocalInteractions(newInteractions);
    localStorage.setItem("pipeline_interactions", JSON.stringify(newInteractions));
  };

  // Nuevo prospecto
  const [newOpen, setNewOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [celular, setCelular] = React.useState("");
  const [grado, setGrado] = React.useState("1° primaria");
  const [nivel, setNivel] = React.useState<"INICIAL" | "PRIMARIA" | "SECUNDARIA">("PRIMARIA");
  const [prioridad, setPrioridad] = React.useState<"ALTA" | "MEDIA" | "BAJA">("MEDIA");

  // Detalle / interacción
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [tipo, setTipo] = React.useState<string>("llamada");
  const [resumen, setResumen] = React.useState("");

  // DnD state
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overColumnId, setOverColumnId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const selected = selectedId
    ? prospects.find((p: any) => p.id === selectedId) ?? null
    : null;

  const history = selectedId
    ? localInteractions
        .filter((i) => i.prospectId === selectedId)
        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
    : [];

  const activeProspect = activeId
    ? prospects.find((p: any) => p.id === activeId)
    : null;

  // ── DnD handlers ──
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    if (!over) { setOverColumnId(null); return; }

    const overId = over.id as string;
    const isStage = stages.some((s: any) => s.id === overId);
    if (isStage) {
      setOverColumnId(overId);
      return;
    }
    const targetProspect = prospects.find((p: any) => p.id === overId);
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

    const isStage = stages.some((s: any) => s.id === overId);
    let targetStageId: string | null = null;

    if (isStage) {
      targetStageId = overId;
    } else {
      const targetProspect = prospects.find((p: any) => p.id === overId);
      if (targetProspect) targetStageId = targetProspect.currentStageId;
    }

    if (!targetStageId) return;

    const draggedProspect = prospects.find((p: any) => p.id === draggedId);
    if (!draggedProspect) return;
    if (draggedProspect.currentStageId === targetStageId) return;

    // Optimistic UI updates
    moveProspectMutation.mutate({
      params: { path: { id: draggedId } },
      body: { currentStageId: targetStageId },
    });
  }

  function submitProspect() {
    if (!nombre.trim() || !celular.trim()) {
      toast.error("Por favor completa los campos");
      return;
    }
    if (!stages || stages.length === 0) {
      toast.error("No hay etapas configuradas en el pipeline");
      return;
    }

    const firstStageId = stages[0].id;

    createProspectMutation.mutate({
      body: {
        name: nombre.trim(),
        phone: celular.trim(),
        targetGrade: grado,
        level: nivel,
        priority: prioridad,
        currentStageId: firstStageId,
      },
    });
  }

  function submitInteraction() {
    if (!selectedId || !resumen.trim()) return;

    const newInt = {
      id: Math.random().toString(),
      prospectId: selectedId,
      fecha: new Date().toISOString(),
      tipo,
      resumen: resumen.trim(),
      autor: "Admisión",
    };

    saveInteractions([...localInteractions, newInt]);
    setResumen("");
    toast.success("Interacción registrada");
  }

  if (isLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM / Pipeline de Admisión</h1>
          <p className="text-muted-foreground text-sm">
            Tablero Kanban con arrastrar y soltar. Mueve los postulantes entre etapas de admisión.
          </p>
        </div>
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogTrigger
            render={
              <Button className="inline-flex items-center gap-2 cursor-pointer">
                <Plus className="size-4" />
                Nuevo Postulante
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar postulante</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Nombre completo</Label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="ej. Juan Pérez" />
              </div>
              <div className="grid gap-2">
                <Label>Celular</Label>
                <Input value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="ej. 959000000" />
              </div>
              <div className="grid gap-2">
                <Label>Grado postulado</Label>
                <select
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                  className="bg-background border-input text-foreground h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="Inicial 3 años">Inicial 3 años</option>
                  <option value="Inicial 4 años">Inicial 4 años</option>
                  <option value="Inicial 5 años">Inicial 5 años</option>
                  <option value="1° primaria">1° primaria</option>
                  <option value="2° primaria">2° primaria</option>
                  <option value="3° primaria">3° primaria</option>
                  <option value="4° primaria">4° primaria</option>
                  <option value="5° primaria">5° primaria</option>
                  <option value="6° primaria">6° primaria</option>
                  <option value="1° secundaria">1° secundaria</option>
                  <option value="2° secundaria">2° secundaria</option>
                  <option value="3° secundaria">3° secundaria</option>
                  <option value="4° secundaria">4° secundaria</option>
                  <option value="5° secundaria">5° secundaria</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Nivel</Label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as any)}
                  className="bg-background border-input text-foreground h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="INICIAL">Inicial</option>
                  <option value="PRIMARIA">Primaria</option>
                  <option value="SECUNDARIA">Secundaria</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Prioridad</Label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as any)}
                  className="bg-background border-input text-foreground h-9 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewOpen(false)} className="cursor-pointer">Cancelar</Button>
              <Button onClick={submitProspect} className="cursor-pointer">Guardar</Button>
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
          className="grid gap-4 overflow-x-auto pb-4"
          style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(220px, 1fr))` }}
        >
          {stages.map((stage: any) => {
            const stageProspects = prospects.filter(
              (p: any) => p.currentStageId === stage.id,
            );
            const ids = stageProspects.map((p: any) => p.id);
            return (
              <KanbanColumn
                key={stage.id}
                id={stage.id}
                title={stage.name}
                orden={stage.order}
                prospectIds={ids}
                isOver={overColumnId === stage.id}
              >
                {stageProspects.map((p: any) => (
                  <ProspectCard
                    key={p.id}
                    id={p.id}
                    nombre={p.name}
                    gradoPostulado={p.targetGrade}
                    celular={p.phone}
                    prioridad={p.priority as any}
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
              nombre={activeProspect.name}
              gradoPostulado={activeProspect.targetGrade}
              celular={activeProspect.phone}
              prioridad={activeProspect.priority as any}
              onDetail={() => {}}
              isDragOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Detalle / Interacciones */}
      <Card className="border-border/80">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="text-primary size-5" /> Historial de interacciones
            {selected ? ` — ${selected.name}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!selected ? (
            <p className="text-muted-foreground text-sm italic">
              Haz clic en &quot;Ver detalle&quot; en cualquier tarjeta del tablero Kanban.
            </p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Timeline */}
              <div className="flex flex-col gap-3">
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-xs italic">
                    Sin interacciones registradas para este postulante.
                  </p>
                ) : (
                  <ul className="space-y-3 text-xs">
                    {history.map((i: any) => (
                      <li key={i.id} className="rounded-lg border border-border/50 bg-muted/20 p-3 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold uppercase tracking-wider text-primary">{i.tipo}</span>
                          <span className="text-muted-foreground">
                            {new Date(i.fecha).toLocaleString("es-PE")}
                          </span>
                        </div>
                        <p className="text-foreground leading-relaxed">{i.resumen}</p>
                        <p className="text-muted-foreground text-[10px]">Registrado por {i.autor}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Nueva interacción */}
              <div className="flex flex-col gap-4 bg-muted/10 border border-border/40 p-4 rounded-xl">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">Nueva Interacción</span>
                
                <div className="flex flex-col gap-1.5">
                  <Label>Tipo</Label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="bg-background border-input text-foreground h-8 w-full rounded-md border px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="llamada">Llamada Telefónica</option>
                    <option value="correo">Correo Electrónico</option>
                    <option value="entrevista">Entrevista Presencial</option>
                    <option value="nota">Nota de Seguimiento</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <Label>Resumen</Label>
                  <Textarea
                    rows={3}
                    value={resumen}
                    onChange={(e) => setResumen(e.target.value)}
                    placeholder="Detalla lo conversado, acuerdos o próximos pasos."
                    className="text-xs"
                  />
                </div>
                
                <Button onClick={submitInteraction} size="sm" className="cursor-pointer">
                  Registrar interacción
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Dynamic loading fallback icon
function Loader2({ className, ...props }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-loader-2 ${className}`}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
