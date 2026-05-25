"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserCheck, Star, Mail, Briefcase, CalendarRange, Clock, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { backend } from "@/lib/api/types/backend";

export default function TeacherLoadPage() {
  // States
  const [search, setSearch] = React.useState("");

  // Queries
  const { data: teachers, isLoading: loadingTeachers } = backend.useQuery("get", "/api/academic/teachers", {} as any);
  const { data: allSchedules, isLoading: loadingSchedules } = backend.useQuery("get", "/api/academic/schedules", {} as any);

  const list = teachers ?? [];
  const schedules = allSchedules ?? [];

  // Filter
  const filtered = list.filter((t: any) => {
    const name = t.user?.name ?? "";
    const specialty = t.specialty ?? "";
    const term = search.toLowerCase();
    return name.toLowerCase().includes(term) || specialty.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 3 · Carga Docente y Especialidades</h1>
          <p className="text-muted-foreground text-sm">
            Visualización detallada de la plana docente, especialidades académicas y asignación de horas lectivas semanales.
          </p>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <UserCheck className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{list.length}</p>
              <p className="text-muted-foreground text-xs font-medium">Profesores Habilitados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <CalendarRange className="size-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{schedules.length}</p>
              <p className="text-muted-foreground text-xs font-medium">Bloques de Horarios Asignados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
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
          {loadingTeachers || loadingSchedules ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3">
              <Loader2 className="text-primary size-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Cargando plana docente...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 border border-dashed border-border/60 rounded-xl">
              <UserCheck className="size-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No se encontraron docentes.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t: any) => {
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
    </div>
  );
}
