"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
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

export default function CurriculumPage() {
  const queryClient = useQueryClient();

  // State
  const [search, setSearch] = React.useState("");

  // Create state
  const [newOpen, setNewOpen] = React.useState(false);
  const [nName, setNName] = React.useState("");
  const [nDesc, setNDesc] = React.useState("");

  // Edit state
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [eName, setEName] = React.useState("");
  const [eDesc, setEDesc] = React.useState("");

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
      setNName("");
      setNDesc("");
      setNewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al crear curso");
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
      toast.error(err?.message || "Error al actualizar curso");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/courses/{id}", {
    onSuccess: () => {
      toast.success("Curso eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al eliminar curso");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nName.trim()) {
      toast.error("El nombre del curso es obligatorio");
      return;
    }
    createMutation.mutate({
      body: {
        name: nName,
        description: nDesc || undefined,
      },
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !eName.trim()) {
      toast.error("El nombre del curso es obligatorio");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        name: eName,
        description: eDesc || undefined,
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
    setEName(c.name);
    setEDesc(c.description || "");
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
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Nombre del Curso *</Label>
                <Input
                  id="name"
                  value={nName}
                  onChange={(e) => setNName(e.target.value)}
                  placeholder="ej. Álgebra y Geometría"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="desc">Descripción / Silabo (Opcional)</Label>
                <Textarea
                  id="desc"
                  value={nDesc}
                  onChange={(e) => setNDesc(e.target.value)}
                  placeholder="Describe brevemente las áreas de competencia..."
                  className="min-h-[100px]"
                />
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
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-name">Nombre del Curso *</Label>
                <Input
                  id="edit-name"
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-desc">Descripción / Silabo (Opcional)</Label>
                <Textarea
                  id="edit-desc"
                  value={eDesc}
                  onChange={(e) => setEDesc(e.target.value)}
                  className="min-h-[100px]"
                />
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
