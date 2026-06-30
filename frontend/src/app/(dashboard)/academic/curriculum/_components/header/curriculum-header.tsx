import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CurriculumHeaderProps {
  onNewOpen: () => void;
}

export function CurriculumHeader({ onNewOpen }: CurriculumHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 3 · Plan Curricular y Asignaturas</h1>
        <p className="text-muted-foreground text-sm">
          Gestión integral de materias, asignaturas del plan de estudios y áreas curriculares.
        </p>
      </div>
      <Button onClick={onNewOpen} className="inline-flex items-center gap-2 cursor-pointer">
        <Plus className="size-4" /> Nuevo Curso
      </Button>
    </div>
  );
}
