import * as React from "react";

export function ReceiptsHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 4 · Emisión de Recibos</h1>
        <p className="text-muted-foreground text-sm">
          Historial de transacciones de cobro en caja e impresión de recibos escolares.
        </p>
      </div>
    </div>
  );
}
