import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRIORIDAD_VARIANT, PRIORIDAD_COLOR } from "../../_utils/pipeline.utils";

interface ProspectCardProps {
  id: string;
  nombre: string;
  gradoPostulado: string;
  celular: string;
  prioridad: "HIGH" | "MEDIUM" | "LOW";
  onDetail: () => void;
  isDragOverlay?: boolean;
}

export function ProspectCard({
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
          {prioridad === "HIGH" ? "Alta" : prioridad === "MEDIUM" ? "Media" : "Baja"}
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
