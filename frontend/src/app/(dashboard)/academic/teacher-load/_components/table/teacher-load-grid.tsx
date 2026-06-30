import * as React from "react";
import { Loader2, UserCheck, Search, Mail, Briefcase, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Teacher, Schedule } from "../../_types/teacher-load.types";

interface TeacherLoadGridProps {
  isLoading: boolean;
  filteredTeachers: Teacher[];
  schedules: Schedule[];
  search: string;
  setSearch: (val: string) => void;
}

export function TeacherLoadGrid({
  isLoading,
  filteredTeachers,
  schedules,
  search,
  setSearch,
}: TeacherLoadGridProps) {
  return (
    <Card className="bg-card border-border/80">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Plana Docente Activa</CardTitle>
            <CardDescription>
              Búsqueda por nombre o especialidad. Los horarios del profesor se actualizan en tiempo real.
            </CardDescription>
          </div>
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por docente o especialidad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Cargando plana docente...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 border border-dashed border-border/60 rounded-xl">
            <UserCheck className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No se encontraron docentes.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.map((t: any) => {
              const teacherSchedules = schedules.filter((s: any) => s.staffId === t.id);
              const totalHours = teacherSchedules.length * 1.5; // Cada bloque de horario de ejemplo es de 1.5 horas

              return (
                <Card key={t.id} className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3 flex flex-row items-start gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                      {t.user?.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-bold text-foreground line-clamp-1">{t.user?.name}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1">
                        <Mail className="size-3 text-muted-foreground" />
                        <span className="line-clamp-1">{t.user?.email}</span>
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Briefcase className="size-3.5 text-primary shrink-0" />
                        <span className="text-muted-foreground font-semibold">Especialidad:</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {t.specialty || "General"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="size-3.5 text-emerald-500 shrink-0" />
                        <span className="text-muted-foreground font-semibold">Carga Lectiva:</span>
                        <span className="font-bold text-foreground tabular-nums">
                          {totalHours} hrs / semana ({teacherSchedules.length} clases)
                        </span>
                      </div>
                    </div>

                    {teacherSchedules.length > 0 ? (
                      <div className="border border-border/40 rounded-lg p-2.5 bg-muted/20 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Distribución Curricular</div>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(teacherSchedules.map((s: any) => s.course?.name))).map((cName: any, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] bg-background">
                              {cName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-muted-foreground italic text-center py-2 bg-muted/10 rounded-lg">
                        Sin clases asignadas actualmente
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
