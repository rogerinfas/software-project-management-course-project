"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Clock, Calendar, Check, X, ShieldAlert, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { backend } from "@/lib/api/types/backend";

const DAYS_OF_WEEK = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
];

export default function SchedulesPage() {
  const queryClient = useQueryClient();

  // Selected filters
  const [selectedSection, setSelectedSection] = React.useState<string>("ALL");

  // Create Dialog
  const [newOpen, setNewOpen] = React.useState(false);
  const [nSection, setNSection] = React.useState("");
  const [nCourse, setNCourse] = React.useState("");
  const [nTeacher, setNTeacher] = React.useState("");
  const [nDay, setNDay] = React.useState("1");
  const [nStart, setNStart] = React.useState("08:00");
  const [nEnd, setNEnd] = React.useState("09:30");

  // Edit Dialog
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [eSection, setESection] = React.useState("");
  const [eCourse, setECourse] = React.useState("");
  const [eTeacher, setETeacher] = React.useState("");
  const [eDay, setEDay] = React.useState("1");
  const [eStart, setEStart] = React.useState("08:00");
  const [eEnd, setEEnd] = React.useState("09:30");

  // Queries
  const { data: sections, isLoading: loadingSections } = backend.useQuery("get", "/api/academic/sections", {} as any);
  const { data: courses, isLoading: loadingCourses } = backend.useQuery("get", "/api/academic/courses", {} as any);
  const { data: teachers, isLoading: loadingTeachers } = backend.useQuery("get", "/api/academic/teachers", {} as any);

  const { data: schedules, isLoading: loadingSchedules } = backend.useQuery(
    "get",
    "/api/academic/schedules",
    {
      params: {
        query: {
          sectionId: selectedSection === "ALL" ? undefined : selectedSection,
        } as any,
      },
    }
  );

  // Mutations
  const createMutation = backend.useMutation("post", "/api/academic/schedules", {
    onSuccess: () => {
      toast.success("Horario escolar asignado correctamente");
      setNewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/schedules"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error de traslape: El aula o el docente tiene cruce de horario.");
    },
  });

  const updateMutation = backend.useMutation("patch", "/api/academic/schedules/{id}", {
    onSuccess: () => {
      toast.success("Asignación de horario modificada correctamente");
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/schedules"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error de traslape: Conflicto con otra clase en esa hora.");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/schedules/{id}", {
    onSuccess: () => {
      toast.success("Asignación de clase eliminada");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/schedules"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al eliminar la asignación");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nSection || !nCourse || !nTeacher) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    createMutation.mutate({
      body: {
        sectionId: nSection,
        courseId: nCourse,
        staffId: nTeacher,
        day: Number(nDay),
        startTime: nStart,
        endTime: nEnd,
      },
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !eSection || !eCourse || !eTeacher) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        sectionId: eSection,
        courseId: eCourse,
        staffId: eTeacher,
        day: Number(eDay),
        startTime: eStart,
        endTime: eEnd,
      },
    });
  };

  const handleDelete = (s: any) => {
    if (confirm(`¿Estás seguro de eliminar esta clase de "${s.course?.name}"?`)) {
      deleteMutation.mutate({ params: { path: { id: s.id } } });
    }
  };

  const startEdit = (s: any) => {
    setEditId(s.id);
    setESection(s.sectionId);
    setECourse(s.courseId);
    setETeacher(s.staffId);
    setEDay(String(s.day));
    setEStart(s.startTime);
    setEEnd(s.endTime);
    setEditOpen(true);
  };

  // Populate first values
  React.useEffect(() => {
    if (sections && sections.length > 0 && !nSection) {
      setNSection(sections[0].id);
    }
    if (courses && courses.length > 0 && !nCourse) {
      setNCourse(courses[0].id);
    }
    if (teachers && teachers.length > 0 && !nTeacher) {
      setNTeacher(teachers[0].id);
    }
  }, [sections, courses, teachers]);

  const list = schedules ?? [];
  const secList = sections ?? [];
  const courseList = courses ?? [];
  const teachList = teachers ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 3 · Distribución del Horario Escolar</h1>
          <p className="text-muted-foreground text-sm">
            Diseño e implementación de horarios de clases con control inteligente y automático de traslape docente y de aulas.
          </p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" /> Asignar Clase
        </Button>
      </div>

      {/* Control Selector */}
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
          {loadingSchedules || loadingSections || loadingCourses || loadingTeachers ? (
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
            <div className="grid gap-6 md:grid-cols-5">
              {DAYS_OF_WEEK.map((day) => {
                const daySchedules = list.filter((s: any) => s.day === day.value);
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
                        {daySchedules.map((s: any) => (
                          <div
                            key={s.id}
                            className="p-3 border border-border/80 bg-card/60 backdrop-blur-sm rounded-xl space-y-2 relative group hover:border-primary/40 hover:shadow-sm transition-all"
                          >
                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="xs" variant="ghost" onClick={() => startEdit(s)} className="p-1 h-auto cursor-pointer">
                                <Pencil className="size-3 text-muted-foreground hover:text-foreground" />
                              </Button>
                              <Button size="xs" variant="ghost" onClick={() => handleDelete(s)} className="p-1 h-auto cursor-pointer text-red-500 hover:text-red-600">
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

      {/* New Assignment Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar Horario Escolar</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="section">Sección / Aula *</Label>
                  <Select value={nSection} onValueChange={(val) => setNSection(val ?? "")}>
                    <SelectTrigger id="section">
                      <SelectValue placeholder="Selecciona Aula" />
                    </SelectTrigger>
                    <SelectContent>
                      {secList.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.grade} - "{s.name}"
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="course">Curso / Materia *</Label>
                  <Select value={nCourse} onValueChange={(val) => setNCourse(val ?? "")}>
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Selecciona Curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseList.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="teacher">Docente Asignado *</Label>
                <Select value={nTeacher} onValueChange={(val) => setNTeacher(val ?? "")}>
                  <SelectTrigger id="teacher">
                    <SelectValue placeholder="Selecciona Profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachList.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.user?.name} ({t.specialty || "General"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="day">Día</Label>
                  <Select value={nDay} onValueChange={(val) => setNDay(val ?? "1")}>
                    <SelectTrigger id="day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((d) => (
                        <SelectItem key={d.value} value={String(d.value)}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="start">Inicio (HH:mm)</Label>
                  <Input
                    id="start"
                    value={nStart}
                    onChange={(e) => setNStart(e.target.value)}
                    placeholder="08:00"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="end">Fin (HH:mm)</Label>
                  <Input
                    id="end"
                    value={nEnd}
                    onChange={(e) => setNEnd(e.target.value)}
                    placeholder="09:30"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="cursor-pointer">
                {createMutation.isPending ? "Asignando..." : "Asignar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Asignación de Horario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-sec">Sección / Aula *</Label>
                  <Select value={eSection} onValueChange={(val) => setESection(val ?? "")}>
                    <SelectTrigger id="edit-sec">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {secList.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.grade} - "{s.name}"
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-crs">Curso / Materia *</Label>
                  <Select value={eCourse} onValueChange={(val) => setECourse(val ?? "")}>
                    <SelectTrigger id="edit-crs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {courseList.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-tchr">Docente Asignado *</Label>
                <Select value={eTeacher} onValueChange={(val) => setETeacher(val ?? "")}>
                  <SelectTrigger id="edit-tchr">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teachList.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.user?.name} ({t.specialty || "General"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-dy">Día</Label>
                  <Select value={eDay} onValueChange={(val) => setEDay(val ?? "1")}>
                    <SelectTrigger id="edit-dy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((d) => (
                        <SelectItem key={d.value} value={String(d.value)}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-strt">Inicio (HH:mm)</Label>
                  <Input
                    id="edit-strt"
                    value={eStart}
                    onChange={(e) => setEStart(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-nd">Fin (HH:mm)</Label>
                  <Input
                    id="edit-nd"
                    value={eEnd}
                    onChange={(e) => setEEnd(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="cursor-pointer">
                {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
