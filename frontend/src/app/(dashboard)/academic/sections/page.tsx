"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, Home, Users, Check, X, Shield, Loader2 } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { backend } from "@/lib/api/types/backend";

const sectionSchema = z.object({
  name: z.string().min(1, "Nombre de la sección es obligatorio"),
  grade: z.string().min(1, "Selecciona un grado"),
  level: z.enum(["PRIMARY", "SECONDARY"]),
  capacity: z.preprocess((val) => Number(val), z.number().int().min(1, "La capacidad debe ser de al menos 1 alumno")),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export default function SectionsPage() {
  const queryClient = useQueryClient();

  // Filters & State
  const [levelFilter, setLevelFilter] = React.useState("ALL");

  // Dialog open state
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  // React Hook Form for creation
  const createForm = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      grade: "",
      level: "PRIMARY" as "PRIMARY" | "SECONDARY",
      capacity: 30,
    },
  });
  const { formState: { errors: createErrors } } = createForm;

  const nLevel = createForm.watch("level");

  // React Hook Form for edit
  const editForm = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      grade: "",
      level: "PRIMARY" as "PRIMARY" | "SECONDARY",
      capacity: 30,
      status: "OPEN" as "OPEN" | "CLOSED",
    },
  });
  const { formState: { errors: editErrors } } = editForm;

  const eLevel = editForm.watch("level");
  const eStatus = editForm.watch("status");

  // Queries
  const { data: sections, isLoading } = backend.useQuery("get", "/api/academic/sections", {
    params: {
      query: {
        level: levelFilter === "ALL" ? undefined : (levelFilter as any),
      } as any,
    },
  });

  // Mutations
  const createMutation = backend.useMutation("post", "/api/academic/sections", {
    onSuccess: () => {
      toast.success("Sección creada exitosamente");
      createForm.reset();
      setNewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/sections"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("patch", "/api/academic/sections/{id}", {
    onSuccess: () => {
      toast.success("Sección actualizada con éxito");
      setEditId(null);
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/sections"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/sections/{id}", {
    onSuccess: () => {
      toast.success("Sección eliminada con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/sections"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const handleCreate = (data: any) => {
    if (!data.name.trim() || !data.grade.trim()) {
      toast.error("El nombre y grado son requeridos");
      return;
    }
    createMutation.mutate({
      body: {
        name: data.name,
        grade: data.grade,
        level: data.level as any,
        capacity: Number(data.capacity),
        status: "OPEN",
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (!editId || !data.name.trim() || !data.grade.trim()) {
      toast.error("El nombre y grado son requeridos");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        name: data.name,
        grade: data.grade,
        level: data.level as any,
        capacity: Number(data.capacity),
        status: data.status,
      },
    });
  };

  const handleDelete = (s: any) => {
    if (s.matriculados > 0) {
      toast.warning("No puedes eliminar una sección con estudiantes matriculados.");
      return;
    }
    if (confirm(`¿Estás seguro de eliminar la sección "${s.grade} - ${s.name}"?`)) {
      deleteMutation.mutate({ params: { path: { id: s.id } } });
    }
  };

  const startEdit = (s: any) => {
    setEditId(s.id);
    editForm.reset({
      name: s.name,
      grade: s.grade,
      level: s.level,
      capacity: s.capacity,
      status: s.status || "OPEN",
    });
    setEditOpen(true);
  };

  const list = sections ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 3 · Gestión de Aulas y Aforos</h1>
          <p className="text-muted-foreground text-sm">
            Control de secciones, aforos permitidos y monitoreo en tiempo real del nivel de ocupación estudiantil.
          </p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-2 cursor-pointer">
          <Plus className="size-4" /> Nueva Sección
        </Button>
      </div>

      {/* KPI Section */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Home className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{list.length}</p>
              <p className="text-muted-foreground text-xs font-medium">Aulas Habilitadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Users className="size-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {list.reduce((acc, curr: any) => acc + (curr.matriculados ?? 0), 0)}
              </p>
              <p className="text-muted-foreground text-xs font-medium">Estudiantes Matriculados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Shield className="size-8 text-indigo-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {list.reduce((acc, curr: any) => acc + (curr.capacity ?? 0), 0)}
              </p>
              <p className="text-muted-foreground text-xs font-medium">Aforo Total Disponible</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections List */}
      <Card className="bg-card border-border/80">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Aulas y Distribución</CardTitle>
              <CardDescription>
                Supervisa el porcentaje de ocupación escolar y gestiona las vacantes de cada sección.
              </CardDescription>
            </div>
            <Select value={levelFilter} onValueChange={(val) => setLevelFilter(val ?? "ALL")}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Nivel Educativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los Niveles</SelectItem>
                <SelectItem value="PRIMARY">Primaria</SelectItem>
                <SelectItem value="SECONDARY">Secundaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3">
              <Loader2 className="text-primary size-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Cargando secciones...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 border border-dashed border-border/60 rounded-xl">
              <Home className="size-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No se encontraron aulas.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s: any) => {
                const enrolled = s.matriculados ?? 0;
                const pct = Math.min(100, Math.round((enrolled / s.capacity) * 100));
                let progressColor = "bg-primary";
                if (pct >= 90) progressColor = "bg-red-500";
                else if (pct >= 70) progressColor = "bg-amber-500";
                else progressColor = "bg-emerald-500";

                return (
                  <Card key={s.id} className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {s.level === "PRIMARY" ? "Primaria" : "Secundaria"}
                        </Badge>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="xs" variant="outline" onClick={() => startEdit(s)} className="cursor-pointer">
                            <Pencil className="size-3" />
                          </Button>
                          <Button size="xs" variant="ghost" onClick={() => handleDelete(s)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer">
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-base font-bold text-foreground mt-2">
                        {s.grade} - "{s.name}"
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Estado: {s.status === "OPEN" ? "🟢 Abierta" : "🔴 Cerrada"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">Ocupación</span>
                          <span className="text-foreground tabular-nums">
                            {enrolled} / {s.capacity} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${progressColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground bg-muted/30 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                        <span>Vacantes libres</span>
                        <span className="font-bold text-foreground tabular-nums">
                          {Math.max(0, s.capacity - enrolled)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Section Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Sección</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="grade" className={cn(createErrors.grade && "text-red-500")}>Grado *</Label>
                  <Input
                    id="grade"
                    {...createForm.register("grade")}
                    placeholder="ej. 1ro de Primaria"
                    className={cn(createErrors.grade && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {createErrors.grade?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.grade.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className={cn(createErrors.name && "text-red-500")}>Sección (ej. A, B) *</Label>
                  <Input
                    id="name"
                    {...createForm.register("name")}
                    placeholder="ej. A"
                    className={cn(createErrors.name && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {createErrors.name?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.name.message)}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="level" className={cn(createErrors.level && "text-red-500")}>Nivel Educativo</Label>
                  <Select value={nLevel} onValueChange={(val) => {
                    createForm.setValue("level", val ?? "PRIMARY");
                    createForm.clearErrors("level");
                  }}>
                    <SelectTrigger id="level" className={cn(createErrors.level && "border-red-500 focus:ring-red-500")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIMARY">Primaria</SelectItem>
                      <SelectItem value="SECONDARY">Secundaria</SelectItem>
                    </SelectContent>
                  </Select>
                  {createErrors.level?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.level.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="capacity" className={cn(createErrors.capacity && "text-red-500")}>Aforo Máximo *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...createForm.register("capacity")}
                    min={1}
                    max={100}
                    className={cn(createErrors.capacity && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {createErrors.capacity?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.capacity.message)}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="cursor-pointer">
                {createMutation.isPending ? "Creando..." : "Crear Aula"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Sección / Aula</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-grade" className={cn(editErrors.grade && "text-red-500")}>Grado *</Label>
                  <Input
                    id="edit-grade"
                    {...editForm.register("grade")}
                    className={cn(editErrors.grade && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {editErrors.grade?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.grade.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-name" className={cn(editErrors.name && "text-red-500")}>Sección *</Label>
                  <Input
                    id="edit-name"
                    {...editForm.register("name")}
                    className={cn(editErrors.name && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {editErrors.name?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.name.message)}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5 col-span-1">
                  <Label htmlFor="edit-level" className={cn(editErrors.level && "text-red-500")}>Nivel</Label>
                  <Select value={eLevel} onValueChange={(val) => {
                    editForm.setValue("level", val ?? "PRIMARY");
                    editForm.clearErrors("level");
                  }}>
                    <SelectTrigger id="edit-level" className={cn(editErrors.level && "border-red-500 focus:ring-red-500")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIMARY">Primaria</SelectItem>
                      <SelectItem value="SECONDARY">Secundaria</SelectItem>
                    </SelectContent>
                  </Select>
                  {editErrors.level?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.level.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 col-span-1">
                  <Label htmlFor="edit-capacity" className={cn(editErrors.capacity && "text-red-500")}>Aforo *</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    {...editForm.register("capacity")}
                    min={1}
                    max={100}
                    className={cn(editErrors.capacity && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {editErrors.capacity?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.capacity.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 col-span-1">
                  <Label htmlFor="edit-status" className={cn(editErrors.status && "text-red-500")}>Estado</Label>
                  <Select value={eStatus} onValueChange={(val) => {
                    editForm.setValue("status", val ?? "OPEN");
                    editForm.clearErrors("status");
                  }}>
                    <SelectTrigger id="edit-status" className={cn(editErrors.status && "border-red-500 focus:ring-red-500")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Abierta</SelectItem>
                      <SelectItem value="CLOSED">Cerrada</SelectItem>
                    </SelectContent>
                  </Select>
                  {editErrors.status?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(editErrors.status.message)}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="cursor-pointer">
                {updateMutation.isPending ? "Guardando..." : "Guardar Aula"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
