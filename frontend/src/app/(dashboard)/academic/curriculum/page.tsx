"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, Check, X, BookOpen, GraduationCap, Code, Loader2, Search } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { backend } from "@/lib/api/types/backend";

const courseSchema = z.object({
  name: z.string().min(3, "El nombre del curso debe tener al menos 3 caracteres"),
  description: z.string().optional(),
});

export default function CurriculumPage() {
  const queryClient = useQueryClient();

  // State
  const [search, setSearch] = React.useState("");

  // Dialog open state
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  // React Hook Form for creation
  const createForm = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { formState: { errors: createErrors } } = createForm;

  // React Hook Form for edit
  const editForm = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { formState: { errors: editErrors } } = editForm;

  // Queries
  const { data: courses, isLoading } = backend.useQuery("get", "/api/academic/courses", {
    params: {
      query: {
        search: search || undefined,
      } as any,
    },
  });

  // Mutations
  const createMutation = backend.useMutation("post", "/api/academic/courses", {
    onSuccess: () => {
      toast.success("Curso creado exitosamente");
      createForm.reset();
      setNewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("patch", "/api/academic/courses/{id}", {
    onSuccess: () => {
      toast.success("Curso actualizado con éxito");
      setEditId(null);
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/courses/{id}", {
    onSuccess: () => {
      toast.success("Curso eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const handleCreate = (data: any) => {
    if (!data.name.trim()) {
      toast.error("El nombre del curso es obligatorio");
      return;
    }
    createMutation.mutate({
      body: {
        name: data.name,
        description: data.description || undefined,
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (!editId || !data.name.trim()) {
      toast.error("El nombre del curso es obligatorio");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        name: data.name,
        description: data.description || undefined,
      },
    });
  };

  const handleDelete = (c: any) => {
    if (confirm(`¿Estás seguro que deseas eliminar el curso "${c.name}"?`)) {
      deleteMutation.mutate({ params: { path: { id: c.id } } });
    }
  };

  const startEdit = (c: any) => {
    setEditId(c.id);
    editForm.reset({
      name: c.name,
      description: c.description || "",
    });
    setEditOpen(true);
  };

  const list = courses ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 3 · Plan Curricular y Asignaturas</h1>
          <p className="text-muted-foreground text-sm">
            Gestión integral de materias, asignaturas del plan de estudios y áreas curriculares.
          </p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-2 cursor-pointer">
          <Plus className="size-4" /> Nuevo Curso
        </Button>
      </div>

      {/* KPI Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <BookOpen className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{list.length}</p>
              <p className="text-muted-foreground text-xs font-medium">Asignaturas en la malla</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <GraduationCap className="size-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">Áreas obligatorias</p>
              <p className="text-muted-foreground text-xs font-medium">Matemática, Letras, Ciencias</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Card className="bg-card border-border/80">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Malla Curricular Activa</CardTitle>
              <CardDescription>
                Materias obligatorias y electivas disponibles para la asignación de horarios escolares.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-xs sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar asignatura..."
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
              <p className="text-muted-foreground text-sm">Cargando materias...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 border border-dashed border-border/60 rounded-xl">
              <BookOpen className="size-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No hay asignaturas en el plan de estudios.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c: any) => (
                <Card key={c.id} className="relative overflow-hidden group hover:shadow-md hover:border-primary/40 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                  <CardHeader className="pb-2 pl-6">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-bold text-foreground line-clamp-1">{c.name}</CardTitle>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button size="xs" variant="outline" onClick={() => startEdit(c)} className="cursor-pointer">
                          <Pencil className="size-3" />
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => handleDelete(c)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer">
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-xs font-mono">ID: {c.id.substring(0, 8)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-6">
                    <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">
                      {c.description || "Sin descripción detallada disponible."}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Course Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir Curso al Plan Curricular</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className={cn(createErrors.name && "text-red-500")}>Nombre del Curso *</Label>
                <Input
                  id="name"
                  {...createForm.register("name")}
                  placeholder="ej. Álgebra y Geometría"
                  className={cn(createErrors.name && "border-red-500 focus-visible:ring-red-500")}
                />
                {createErrors.name?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.name.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="desc" className={cn(createErrors.description && "text-red-500")}>Descripción / Silabo (Opcional)</Label>
                <Textarea
                  id="desc"
                  {...createForm.register("description")}
                  placeholder="Describe brevemente las áreas de competencia..."
                  className={cn("min-h-[100px]", createErrors.description && "border-red-500 focus-visible:ring-red-500")}
                />
                {createErrors.description?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.description.message)}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="cursor-pointer">
                {createMutation.isPending ? "Añadiendo..." : "Añadir"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Asignatura</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-name" className={cn(editErrors.name && "text-red-500")}>Nombre del Curso *</Label>
                <Input
                  id="edit-name"
                  {...editForm.register("name")}
                  className={cn(editErrors.name && "border-red-500 focus-visible:ring-red-500")}
                />
                {editErrors.name?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(editErrors.name.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-desc" className={cn(editErrors.description && "text-red-500")}>Descripción / Silabo (Opcional)</Label>
                <Textarea
                  id="edit-desc"
                  {...editForm.register("description")}
                  className={cn("min-h-[100px]", editErrors.description && "border-red-500 focus-visible:ring-red-500")}
                />
                {editErrors.description?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(editErrors.description.message)}</p>
                )}
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
