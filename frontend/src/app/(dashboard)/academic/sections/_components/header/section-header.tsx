import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  onNewOpen: () => void;
}

export function SectionHeader({ onNewOpen }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 3 · Gestión de Aulas y Aforos</h1>
        <p className="text-muted-foreground text-sm">
          Control de secciones, aforos permitidos y monitoreo en tiempo real del nivel de ocupación estudiantil.
        </p>
      </div>
      <Button onClick={onNewOpen} className="inline-flex items-center gap-2 cursor-pointer">
        <Plus className="size-4" /> Nueva Sección
      </Button>
    </div>
  );
}
