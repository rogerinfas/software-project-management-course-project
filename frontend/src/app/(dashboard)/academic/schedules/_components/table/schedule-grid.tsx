import * as React from "react";
import { Loader2, ShieldAlert, Calendar, Clock, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Schedule, DAYS_OF_WEEK } from "../../_types/schedules.types";

interface ScheduleGridProps {
  isLoading: boolean;
  list: Schedule[];
  secList: any[];
  selectedSection: string;
  setSelectedSection: (val: string) => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

export function ScheduleGrid({
  isLoading,
  list,
  secList,
  selectedSection,
  setSelectedSection,
  onEdit,
  onDelete,
}: ScheduleGridProps) {
  return (
    <Card className="bg-card border-border/80">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="size-5 text-primary" /> Visualizador de Malla Horaria
            </CardTitle>
            <CardDescription>
              Selecciona una sección específica para ver su calendario escolar semanal completo.
            </CardDescription>
          </div>
          <Select value={selectedSection} onValueChange={(val) => setSelectedSection(val ?? "ALL")}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Seleccionar Aula" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las Secciones</SelectItem>
              {secList.map((s: any) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.grade} - "{s.name}"
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-60 flex-col items-center justify-center gap-3">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Construyendo distribución escolar...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 border border-dashed border-border/60 rounded-xl">
            <ShieldAlert className="size-8 text-amber-500" />
            <p className="text-muted-foreground text-sm">No hay clases programadas para esta sección.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-5">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedules = list.filter((s) => s.day === day.value);
              daySchedules.sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div key={day.value} className="space-y-4">
                  <div className="text-sm font-bold border-b border-border/60 pb-2 text-primary uppercase tracking-wide">
                    {day.label}
                  </div>
                  {daySchedules.length === 0 ? (
                    <div className="text-[11px] text-muted-foreground italic py-4 text-center bg-muted/10 rounded-lg border border-dashed border-border/40">
                      Libre
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {daySchedules.map((s) => (
                        <div
                          key={s.id}
                          className="p-3 border border-border/80 bg-card/60 backdrop-blur-sm rounded-xl space-y-2 relative group hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="xs" variant="ghost" onClick={() => onEdit(s)} className="p-1 h-auto cursor-pointer">
                              <Pencil className="size-3 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button size="xs" variant="ghost" onClick={() => onDelete(s)} className="p-1 h-auto cursor-pointer text-red-500 hover:text-red-600">
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                          <div className="text-xs font-extrabold text-foreground line-clamp-1 pr-6">
                            {s.course?.name}
                          </div>
                          <div className="text-[10px] text-primary font-semibold">
                            Docente: {s.staff?.user?.name}
                          </div>
                          {selectedSection === "ALL" && (
                            <div className="text-[10px] text-muted-foreground font-mono">
                              Aula: {s.section?.grade} - "{s.section?.name}"
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <Clock className="size-3 shrink-0" />
                            <span className="tabular-nums">
                              {s.startTime} - {s.endTime}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
