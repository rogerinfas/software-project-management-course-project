import * as React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionsHeaderProps {
  setSingleOpen: (val: boolean) => void;
  setBulkOpen: (val: boolean) => void;
}

export function CollectionsHeader({ setSingleOpen, setBulkOpen }: CollectionsHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 4 · Gestión de Cobranzas</h1>
        <p className="text-muted-foreground text-sm">
          Monitorea las cuentas por cobrar, genera cargos mensuales y procesa pagos de alumnos en ventanilla.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => setSingleOpen(true)}
          className="inline-flex items-center gap-2 cursor-pointer h-9"
        >
          <Plus className="size-4" /> Cargo Individual
        </Button>
        <Button
          onClick={() => setBulkOpen(true)}
          className="inline-flex items-center gap-2 cursor-pointer h-9"
        >
          <RefreshCw className="size-4 animate-spin-slow" /> Facturación Masiva
        </Button>
      </div>
    </div>
  );
}
