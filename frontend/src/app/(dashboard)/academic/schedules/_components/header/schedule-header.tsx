import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleHeaderProps {
  onNewOpen: () => void;
}

export function ScheduleHeader({ onNewOpen }: ScheduleHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 3 · Distribución del Horario Escolar</h1>
        <p className="text-muted-foreground text-sm">
          Diseño e implementación de horarios de clases con control inteligente y automático de traslape docente y de aulas.
        </p>
      </div>
      <Button
        onClick={onNewOpen}
        className="inline-flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="size-4" /> Asignar Clase
      </Button>
    </div>
  );
}
