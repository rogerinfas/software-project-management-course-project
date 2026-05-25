"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Check, X, Megaphone, Bell, Calendar, HelpCircle, Loader2, Search } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { backend } from "@/lib/api/types/backend";

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();

  // Filters & Search
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");

  // Create Announcement Dialog
  const [newOpen, setNewOpen] = React.useState(false);
  const [nTitle, setNTitle] = React.useState("");
  const [nContent, setNContent] = React.useState("");
  const [nCategory, setNCategory] = React.useState("Informativo");
  const [nExpiresAt, setNExpiresAt] = React.useState("");

  // Edit State
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [eTitle, setETitle] = React.useState("");
  const [eContent, setEContent] = React.useState("");
  const [eCategory, setECategory] = React.useState("Informativo");
  const [eExpiresAt, setEExpiresAt] = React.useState("");

  // Queries
  const { data: communications, isLoading } = backend.useQuery(
    "get",
    "/api/academic/communications",
    {
      params: {
        query: {
          category: categoryFilter === "ALL" ? undefined : categoryFilter,
          search: search || undefined,
        } as any,
      },
    }
  );

  // Mutations
  const createMutation = backend.useMutation("post", "/api/academic/communications", {
    onSuccess: () => {
      toast.success("Comunicado publicado con éxito");
      setNTitle("");
      setNContent("");
      setNCategory("Informativo");
      setNExpiresAt("");
      setNewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/communications"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al publicar comunicado");
    },
  });

  const updateMutation = backend.useMutation("patch", "/api/academic/communications/{id}", {
    onSuccess: () => {
      toast.success("Comunicado actualizado con éxito");
      setEditId(null);
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/communications"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al actualizar comunicado");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/communications/{id}", {
    onSuccess: () => {
      toast.success("Comunicado eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/communications"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al eliminar comunicado");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nTitle.trim() || !nContent.trim()) {
      toast.error("El título y el contenido son obligatorios");
      return;
    }
    createMutation.mutate({
      body: {
        title: nTitle,
        content: nContent,
        category: nCategory,
        expiresAt: nExpiresAt ? new Date(nExpiresAt).toISOString() : null,
      } as any,
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    if (!eTitle.trim() || !eContent.trim()) {
      toast.error("El título y el contenido son obligatorios");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        title: eTitle,
        content: eContent,
        category: eCategory,
        expiresAt: eExpiresAt ? new Date(eExpiresAt).toISOString() : null,
      } as any,
    });
  };

  const handleDelete = (c: any) => {
    if (confirm(`¿Estás seguro que deseas eliminar el comunicado "${c.title}"?`)) {
      deleteMutation.mutate({ params: { path: { id: c.id } } });
    }
  };

  const startEdit = (c: any) => {
    setEditId(c.id);
    setETitle(c.title);
    setEContent(c.content);
    setECategory(c.category);
    setEExpiresAt(c.expiresAt ? new Date(c.expiresAt).toISOString().split("T")[0] : "");
    setEditOpen(true);
  };

  const list = communications ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 3 · Comunicados y Anuncios</h1>
          <p className="text-muted-foreground text-sm">
            Publicación y administración de novedades, alertas y eventos dirigidos a la comunidad educativa.
          </p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" /> Crear comunicado
        </Button>
      </div>

      {/* KPI Section */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Megaphone className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{list.length}</p>
              <p className="text-muted-foreground text-xs font-medium">Comunicados Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Bell className="size-8 text-red-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {list.filter((c: any) => c.category === "Urgente").length}
              </p>
              <p className="text-muted-foreground text-xs font-medium">Alertas Urgentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Calendar className="size-8 text-indigo-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {list.filter((c: any) => c.category === "Evento").length}
              </p>
              <p className="text-muted-foreground text-xs font-medium">Eventos Programados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls & List */}
      <Card className="bg-card border-border/80">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Muro de Comunicados</CardTitle>
              <CardDescription>
                Filtra por categoría o busca palabras claves. Las alertas críticas aparecen destacadas en rojo.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full max-w-md sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar comunicado..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val ?? "ALL")}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                  <SelectItem value="Evento">Evento</SelectItem>
                  <SelectItem value="Informativo">Informativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3">
              <Loader2 className="text-primary size-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Cargando comunicados...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 border border-dashed border-border/60 rounded-xl">
              <Megaphone className="size-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No hay comunicados registrados.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((c: any) => {
                let badgeClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                if (c.category === "Urgente") badgeClass = "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse";
                if (c.category === "Evento") badgeClass = "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";

                return (
                  <Card key={c.id} className="relative overflow-hidden group hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className={`${badgeClass} border`}>
                          {c.category}
                        </Badge>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="xs" variant="outline" onClick={() => startEdit(c)} className="cursor-pointer">
                            <Pencil className="size-3" />
                          </Button>
                          <Button size="xs" variant="ghost" onClick={() => handleDelete(c)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer">
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-base font-bold line-clamp-1 mt-2">{c.title}</CardTitle>
                      <CardDescription className="text-xs">
                        Publicado el {new Date(c.createdAt || "").toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4 min-h-[5rem]">
                        {c.content}
                      </p>
                      {c.expiresAt && (
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/5 px-2 py-1 rounded w-fit border border-amber-500/10">
                          Vence el {new Date(c.expiresAt).toLocaleDateString()}
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

      {/* New Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Comunicado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={nTitle}
                  onChange={(e) => setNTitle(e.target.value)}
                  placeholder="ej. Comunicado de matrícula extemporánea"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="content">Contenido del Comunicado *</Label>
                <Textarea
                  id="content"
                  value={nContent}
                  onChange={(e) => setNContent(e.target.value)}
                  placeholder="Escribe el cuerpo del mensaje..."
                  className="min-h-[120px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={nCategory} onValueChange={(val) => setNCategory(val ?? "Informativo")}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Informativo">Informativo</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                      <SelectItem value="Evento">Evento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="expires">Vencimiento (Opcional)</Label>
                  <Input
                    id="expires"
                    type="date"
                    value={nExpiresAt}
                    onChange={(e) => setNExpiresAt(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="cursor-pointer">
                {createMutation.isPending ? "Publicando..." : "Publicar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Comunicado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-title">Título *</Label>
                <Input
                  id="edit-title"
                  value={eTitle}
                  onChange={(e) => setETitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-content">Contenido del Comunicado *</Label>
                <Textarea
                  id="edit-content"
                  value={eContent}
                  onChange={(e) => setEContent(e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Select value={eCategory} onValueChange={(val) => setECategory(val ?? "Informativo")}>
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Informativo">Informativo</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                      <SelectItem value="Evento">Evento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-expires">Vencimiento (Opcional)</Label>
                  <Input
                    id="edit-expires"
                    type="date"
                    value={eExpiresAt}
                    onChange={(e) => setEExpiresAt(e.target.value)}
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
