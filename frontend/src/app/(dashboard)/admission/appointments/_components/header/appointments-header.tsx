import * as React from "react";

export function AppointmentsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Agenda de Citas</h2>
        <p className="text-muted-foreground text-sm">
          Programa y gestiona las entrevistas y evaluaciones psicológicas de los postulantes.
        </p>
      </div>
    </div>
  );
}
