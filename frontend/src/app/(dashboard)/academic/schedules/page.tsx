"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Clock, Calendar, Check, X, ShieldAlert, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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

const scheduleSchema = z.object({
  section: z.string().min(1, "Selecciona una sección"),
  course: z.string().min(1, "Selecciona un curso"),
  teacher: z.string().min(1, "Selecciona un docente"),
  day: z.string().min(1, "Selecciona un día"),
  start: z.string().min(1, "Hora de inicio es requerida"),
  end: z.string().min(1, "Hora de fin es requerida"),
});

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

  // Edit Dialog
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  // React Hook Form for creation
  const createForm = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      section: "",
      course: "",
      teacher: "",
      day: "1",
      start: "08:00",
      end: "09:30",
    },
  });
  const { formState: { errors: createErrors } } = createForm;

  const nSection = createForm.watch("section");
  const nCourse = createForm.watch("course");
  const nTeacher = createForm.watch("teacher");
  const nDay = createForm.watch("day");

  // React Hook Form for edit
  const editForm = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      section: "",
      course: "",
      teacher: "",
      day: "1",
      start: "08:00",
      end: "09:30",
    },
  });
  const { formState: { errors: editErrors } } = editForm;

  const eSection = editForm.watch("section");
  const eCourse = editForm.watch("course");
  const eTeacher = editForm.watch("teacher");
  const eDay = editForm.watch("day");

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
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("patch", "/api/academic/schedules/{id}", {
    onSuccess: () => {
      toast.success("Asignación de horario modificada correctamente");
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/schedules"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/schedules/{id}", {
    onSuccess: () => {
      toast.success("Asignación de clase eliminada");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/schedules"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const handleCreate = (data: any) => {
    if (!data.section || !data.course || !data.teacher) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    createMutation.mutate({
      body: {
        sectionId: data.section,
        courseId: data.course,
        staffId: data.teacher,
        day: Number(data.day),
        startTime: data.start,
        endTime: data.end,
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (!editId || !data.section || !data.course || !data.teacher) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        sectionId: data.section,
        courseId: data.course,
        staffId: data.teacher,
        day: Number(data.day),
        startTime: data.start,
        endTime: data.end,
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
    editForm.reset({
      section: s.sectionId,
      course: s.courseId,
      teacher: s.staffId,
      day: String(s.day),
      start: s.startTime,
      end: s.endTime,
    });
    setEditOpen(true);
  };

  // Populate first values
  React.useEffect(() => {
    if (sections && sections.length > 0) {
      if (!createForm.getValues("section")) {
        createForm.setValue("section", sections[0].id);
      }
    }
    if (courses && courses.length > 0) {
      if (!createForm.getValues("course")) {
        createForm.setValue("course", courses[0].id);
      }
    }
    if (teachers && teachers.length > 0) {
      if (!createForm.getValues("teacher")) {
        createForm.setValue("teacher", teachers[0].id);
      }
    }
  }, [sections, courses, teachers, createForm]);

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
            <div className="grid gap-6 grid-cols-1 md:grid-cols-5">
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
          <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="section" className={cn(createErrors.section && "text-red-500")}>Sección / Aula *</Label>
                  <Select value={nSection} onValueChange={(val) => {
                    createForm.setValue("section", val ?? "");
                    createForm.clearErrors("section");
                  }}>
                    <SelectTrigger id="section" className={cn(createErrors.section && "border-red-500 focus:ring-red-500")}>
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
                  {createErrors.section?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.section.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="course" className={cn(createErrors.course && "text-red-500")}>Curso / Materia *</Label>
                  <Select value={nCourse} onValueChange={(val) => {
                    createForm.setValue("course", val ?? "");
                    createForm.clearErrors("course");
                  }}>
                    <SelectTrigger id="course" className={cn(createErrors.course && "border-red-500 focus:ring-red-500")}>
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
                  {createErrors.course?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.course.message)}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="teacher" className={cn(createErrors.teacher && "text-red-500")}>Docente Asignado *</Label>
                <Select value={nTeacher} onValueChange={(val) => {
                  createForm.setValue("teacher", val ?? "");
                  createForm.clearErrors("teacher");
                }}>
                  <SelectTrigger id="teacher" className={cn(createErrors.teacher && "border-red-500 focus:ring-red-500")}>
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
                {createErrors.teacher?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.teacher.message)}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="day" className={cn(createErrors.day && "text-red-500")}>Día</Label>
                  <Select value={nDay} onValueChange={(val) => {
                    createForm.setValue("day", val ?? "1");
                    createForm.clearErrors("day");
                  }}>
                    <SelectTrigger id="day" className={cn(createErrors.day && "border-red-500 focus:ring-red-500")}>
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
                  {createErrors.day?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.day.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="start" className={cn(createErrors.start && "text-red-500")}>Inicio (HH:mm)</Label>
                  <Input
                    id="start"
                    {...createForm.register("start")}
                    placeholder="08:00"
                    className={cn(createErrors.start && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {createErrors.start?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.start.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="end" className={cn(createErrors.end && "text-red-500")}>Fin (HH:mm)</Label>
                  <Input
                    id="end"
                    {...createForm.register("end")}
                    placeholder="09:30"
                    className={cn(createErrors.end && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {createErrors.end?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.end.message)}</p>
                  )}
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
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-sec" className={cn(editErrors.section && "text-red-500")}>Sección / Aula *</Label>
                  <Select value={eSection} onValueChange={(val) => {
                    editForm.setValue("section", val ?? "");
                    editForm.clearErrors("section");
                  }}>
                    <SelectTrigger id="edit-sec" className={cn(editErrors.section && "border-red-500 focus:ring-red-500")}>
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
                  {editErrors.section?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.section.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-crs" className={cn(editErrors.course && "text-red-500")}>Curso / Materia *</Label>
                  <Select value={eCourse} onValueChange={(val) => {
                    editForm.setValue("course", val ?? "");
                    editForm.clearErrors("course");
                  }}>
                    <SelectTrigger id="edit-crs" className={cn(editErrors.course && "border-red-500 focus:ring-red-500")}>
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
                  {editErrors.course?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.course.message)}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-tchr" className={cn(editErrors.teacher && "text-red-500")}>Docente Asignado *</Label>
                <Select value={eTeacher} onValueChange={(val) => {
                  editForm.setValue("teacher", val ?? "");
                  editForm.clearErrors("teacher");
                }}>
                  <SelectTrigger id="edit-tchr" className={cn(editErrors.teacher && "border-red-500 focus:ring-red-500")}>
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
                {editErrors.teacher?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(editErrors.teacher.message)}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-dy" className={cn(editErrors.day && "text-red-500")}>Día</Label>
                  <Select value={eDay} onValueChange={(val) => {
                    editForm.setValue("day", val ?? "1");
                    editForm.clearErrors("day");
                  }}>
                    <SelectTrigger id="edit-dy" className={cn(editErrors.day && "border-red-500 focus:ring-red-500")}>
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
                  {editErrors.day?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.day.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-strt" className={cn(editErrors.start && "text-red-500")}>Inicio (HH:mm)</Label>
                  <Input
                    id="edit-strt"
                    {...editForm.register("start")}
                    className={cn(editErrors.start && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {editErrors.start?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.start.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-nd" className={cn(editErrors.end && "text-red-500")}>Fin (HH:mm)</Label>
                  <Input
                    id="edit-nd"
                    {...editForm.register("end")}
                    className={cn(editErrors.end && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {editErrors.end?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.end.message)}</p>
                  )}
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
