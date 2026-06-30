import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Appointment } from "../../_types/appointments.types";

interface AppointmentsListProps {
  search: string;
  setSearch: (val: string) => void;
  filteredAppointments: Appointment[];
}

export function AppointmentsList({ search, setSearch, filteredAppointments }: AppointmentsListProps) {
  return (
    <div className="bg-card border-border/80 flex flex-col gap-4 rounded-xl border p-6 md:col-span-2">
      <div className="relative w-full sm:w-72">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por postulante o tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {filteredAppointments.length === 0 ? (
          <div className="text-muted-foreground py-16 text-center text-sm">
            No hay citas programadas que coincidan con la búsqueda.
          </div>
        ) : (
          filteredAppointments.map((app: any) => {
            const dateObj = new Date(app.date);
            return (
              <div
                key={app.id}
                className="bg-muted/30 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg p-4 transition-all hover:bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <CalendarIcon className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {app.prospect?.name || "Postulante Desconocido"}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-0.5">
                      <span className="bg-primary/5 text-primary border border-primary/20 rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase">
                        {app.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {format(dateObj, "dd 'de' MMMM, yyyy - hh:mm a", { locale: es })}
                      </span>
                    </div>
                    {app.notes && (
                      <p className="text-muted-foreground text-xs italic mt-2 border-l-2 border-border/60 pl-2">
                        {app.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
