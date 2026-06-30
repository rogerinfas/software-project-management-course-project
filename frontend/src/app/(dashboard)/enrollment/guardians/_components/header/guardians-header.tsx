import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuardiansHeaderProps {
  setNewOpen: (val: boolean) => void;
}

export function GuardiansHeader({ setNewOpen }: GuardiansHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 2 · Gestión de Apoderados</h1>
        <p className="text-muted-foreground text-sm">
          Registro y administración de padres de familia, madres o tutores legales de los alumnos.
        </p>
      </div>
      <Button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-2 cursor-pointer">
        <Plus className="size-4" /> Nuevo apoderado
      </Button>
    </div>
  );
}
