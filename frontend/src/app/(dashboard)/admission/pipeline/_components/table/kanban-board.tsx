import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { KanbanColumn } from "../common/kanban-column";
import { ProspectCard } from "../common/prospect-card";
import { Prospect } from "../../_types/pipeline.types";
import { usePipelineMutations } from "../../_hooks/pipeline-hooks";

interface KanbanBoardProps {
  prospects: Prospect[];
  stages: { id: string; name: string; order: number }[];
  setSelectedId: (id: string) => void;
}

export function KanbanBoard({ prospects, stages, setSelectedId }: KanbanBoardProps) {
  const { moveProspectMutation } = usePipelineMutations();

  // DnD state
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overColumnId, setOverColumnId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const activeProspect = activeId ? prospects.find((p: any) => p.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    if (!over) {
      setOverColumnId(null);
      return;
    }

    const overId = over.id as string;
    const isStage = stages.some((s) => s.id === overId);
    if (isStage) {
      setOverColumnId(overId);
      return;
    }
    const targetProspect = prospects.find((p: any) => p.id === overId);
    if (targetProspect) setOverColumnId(targetProspect.stage);
    else setOverColumnId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverColumnId(null);
    if (!over) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    const isStage = stages.some((s) => s.id === overId);
    let targetStageId: string | null = null;

    if (isStage) {
      targetStageId = overId;
    } else {
      const targetProspect = prospects.find((p: any) => p.id === overId);
      if (targetProspect) targetStageId = targetProspect.stage;
    }

    if (!targetStageId) return;

    const draggedProspect = prospects.find((p: any) => p.id === draggedId);
    if (!draggedProspect) return;
    if (draggedProspect.stage === targetStageId) return;

    if (draggedProspect.stage === "EVALUACION_ACADEMICA") {
      toast.error("El prospecto ya se encuentra en Evaluación Académica y no puede cambiar de etapa.");
      return;
    }

    // Optimistic UI updates / call mutation
    moveProspectMutation.mutate({
      params: { path: { id: draggedId } },
      body: { stage: targetStageId as any },
    });
  }

  return (
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
        {stages.map((stage) => {
          const stageProspects = prospects.filter((p: any) => p.stage === stage.id);
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
  );
}
