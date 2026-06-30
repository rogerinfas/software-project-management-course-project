import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TariffsHeaderProps {
  setNewOpen: (val: boolean) => void;
}

export function TariffsHeader({ setNewOpen }: TariffsHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 4 · Tarifario Integral</h1>
        <p className="text-muted-foreground text-sm">
          Configuración y administración de conceptos oficiales de cobro por nivel académico.
        </p>
      </div>
      <Button
        onClick={() => setNewOpen(true)}
        className="inline-flex items-center gap-2 cursor-pointer h-9"
      >
        <Plus className="size-4" /> Nueva Tarifa
      </Button>
    </div>
  );
}
