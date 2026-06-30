import * as React from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  id: string;
  title: string;
  orden: number;
  prospectIds: string[];
  children: React.ReactNode;
  isOver: boolean;
}

export function KanbanColumn({ id, title, orden, prospectIds, children, isOver }: KanbanColumnProps) {
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
