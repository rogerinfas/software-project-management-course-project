"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Check, X, Shield, AlertTriangle, Loader2, Search, Trash2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backend } from "@/lib/api/types/backend";

export default function ApoderadosPage() {
  const queryClient = useQueryClient();

  // Filters & State
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [size] = React.useState(10);

  // Edit inline state
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editDni, setEditDni] = React.useState("");
  const [editName, setEditName] = React.useState("");
  const [editTel, setEditTel] = React.useState("");
  const [editCorreo, setEditCorreo] = React.useState("");
  const [editOcup, setEditOcup] = React.useState("");

  // New apoderado dialog state
  const [newOpen, setNewOpen] = React.useState(false);
  const [nNombre, setNNombre] = React.useState("");
  const [nDni, setNDni] = React.useState("");
  const [nTel, setNTel] = React.useState("");
  const [nCorreo, setNCorreo] = React.useState("");
  const [nOcupacion, setNOcupacion] = React.useState("");

  // Queries
  const { data: guardiansData, isLoading } = backend.useQuery(
    "get",
    "/api/enrollment/guardians",
    {
      params: {
        query: {
          page,
          size,
          search: search || undefined,
        },
      },
    }
  );

  // Mutations
  const createMutation = backend.useMutation("post", "/api/enrollment/guardians", {
    onSuccess: () => {
      toast.success("Apoderado registrado con éxito");
      setNNombre("");
      setNDni("");
      setNTel("");
      setNCorreo("");
      setNOcupacion("");
      setNewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/guardians"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("put", "/api/enrollment/guardians/{id}", {
    onSuccess: () => {
      toast.success("Datos del apoderado actualizados");
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/guardians"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/enrollment/guardians/{id}", {
    onSuccess: () => {
      toast.success("Apoderado eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/guardians"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  function startEdit(g: any) {
    setEditId(g.id);
    setEditDni(g.dni);
    setEditName(g.name);
    setEditTel(g.phone);
    setEditCorreo(g.email || "");
    setEditOcup(g.occupation || "");
  }

  function saveEdit() {
    if (!editId) return;
    if (!editName.trim() || !editDni.trim()) {
      toast.error("El nombre y el DNI son requeridos");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        dni: editDni,
        name: editName,
        phone: editTel,
        email: editCorreo || undefined,
        occupation: editOcup || undefined,
      },
    });
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nNombre.trim() || !nDni.trim() || !nTel.trim()) {
      toast.error("El nombre, DNI y teléfono son obligatorios");
      return;
    }
    createMutation.mutate({
      body: {
        dni: nDni,
        name: nNombre,
        phone: nTel,
        email: nCorreo || undefined,
        occupation: nOcupacion || undefined,
      },
    });
  }

  const handleDelete = (g: any) => {
    if (g.students && g.students.length > 0) {
      toast.warning("No puedes eliminar un apoderado que tiene alumnos asociados.");
      return;
    }
    if (confirm(`¿Seguro que deseas eliminar al apoderado "${g.name}"?`)) {
      deleteMutation.mutate({ params: { path: { id: g.id } } });
    }
  };

  const totalGuardians = guardiansData?.meta?.total ?? 0;
  const list = guardiansData?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 2 · Gestión de Apoderados</h1>
          <p className="text-muted-foreground text-sm">
            Registro y administración de padres de familia, madres o tutores legales de los alumnos.
          </p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-2 cursor-pointer">
          <Plus className="size-4" /> Nuevo apoderado
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Shield className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{totalGuardians}</p>
              <p className="text-muted-foreground text-xs font-medium">Apoderados registrados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Shield className="size-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {list.filter((g: any) => g.email).length}
              </p>
              <p className="text-muted-foreground text-xs font-medium">Con correo electrónico</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <AlertTriangle className="size-8 text-amber-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {list.filter((g: any) => g.dni.endsWith("99")).length}
              </p>
              <p className="text-muted-foreground text-xs font-medium">Con deuda pendiente simulada (DNI ..99)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-card border-border/80">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Listado General</CardTitle>
              <CardDescription>
                Búsqueda en tiempo real por DNI o nombre completo. Edita datos de contacto en línea.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-xs sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por DNI o nombre..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3">
              <Loader2 className="text-primary size-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Cargando apoderados...</p>
            </div>
          ) : (
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <Table className="table-fixed">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Apoderado</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Ocupación</TableHead>
                    <TableHead>Alumnos Asociados</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-muted-foreground text-center py-6 text-sm">
                        No se encontraron apoderados registrados.
                      </TableCell>
                    </TableRow>
                  )}
                  {list.map((g: any) =>
                    editId === g.id ? (
                      <TableRow key={g.id} className="bg-muted/20">
                        <TableCell className="max-w-[160px]">
                          <Input
                            className="h-8 w-full min-w-0 text-xs font-semibold"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="max-w-[100px]">
                          <Input
                            className="h-8 w-full min-w-0 font-mono text-xs"
                            value={editDni}
                            onChange={(e) => setEditDni(e.target.value)}
                            maxLength={8}
                          />
                        </TableCell>
                        <TableCell className="max-w-[160px]">
                          <div className="space-y-1.5 py-1">
                            <Input
                              className="h-7 w-full min-w-0 text-xs"
                              value={editTel}
                              onChange={(e) => setEditTel(e.target.value)}
                              placeholder="Teléfono"
                            />
                            <Input
                              className="h-7 w-full min-w-0 text-xs"
                              value={editCorreo}
                              onChange={(e) => setEditCorreo(e.target.value)}
                              placeholder="Correo"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[140px]">
                          <Input
                            className="h-8 w-full min-w-0 text-xs"
                            value={editOcup}
                            onChange={(e) => setEditOcup(e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {(g.students?.length ?? 0)} alumnos
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1.5">
                          <Button
                            size="xs"
                            onClick={saveEdit}
                            disabled={updateMutation.isPending}
                            className="cursor-pointer"
                          >
                            {updateMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setEditId(null)}
                            className="cursor-pointer"
                          >
                            <X className="size-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={g.id} className="hover:bg-muted/10">
                        <TableCell className="font-semibold text-foreground">{g.name}</TableCell>
                        <TableCell className="font-mono text-xs">{g.dni}</TableCell>
                        <TableCell className="text-xs">
                          <span className="font-medium text-foreground">{g.phone}</span>
                          {g.email && <><br /><span className="text-muted-foreground">{g.email}</span></>}
                        </TableCell>
                        <TableCell className="text-xs">{g.occupation || "—"}</TableCell>
                        <TableCell>
                          {g.students && g.students.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {g.students.map((s: any) => (
                                <Badge key={s.id} variant="secondary" className="text-[10px] py-0.5 justify-start w-fit">
                                  {s.firstName} {s.lastName} ({s.code || "NUEVO"})
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">Ninguno</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1.5">
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => startEdit(g)}
                            className="cursor-pointer"
                          >
                            <Pencil className="size-3" />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => handleDelete(g)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {guardiansData?.meta && guardiansData.meta.totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="cursor-pointer"
              >
                Anterior
              </Button>
              <span className="text-xs text-muted-foreground">
                Página {page} de {guardiansData.meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(guardiansData.meta.totalPages, p + 1))}
                disabled={page === guardiansData.meta.totalPages}
                className="cursor-pointer"
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Apoderado Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Apoderado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-3 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-name">Nombre Completo *</Label>
                <Input
                  id="new-name"
                  value={nNombre}
                  onChange={(e) => setNNombre(e.target.value)}
                  placeholder="ej. Juan Pérez Delgado"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-dni">DNI *</Label>
                  <Input
                    id="new-dni"
                    value={nDni}
                    onChange={(e) => setNDni(e.target.value)}
                    maxLength={8}
                    placeholder="8 dígitos"
                    className="font-mono"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-phone">Teléfono *</Label>
                  <Input
                    id="new-phone"
                    value={nTel}
                    onChange={(e) => setNTel(e.target.value)}
                    placeholder="987654321"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-email">Correo Electrónico</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={nCorreo}
                  onChange={(e) => setNCorreo(e.target.value)}
                  placeholder="juan.perez@ejemplo.com"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-ocup">Ocupación o Profesión</Label>
                <Input
                  id="new-ocup"
                  value={nOcupacion}
                  onChange={(e) => setNOcupacion(e.target.value)}
                  placeholder="ej. Ingeniero de Sistemas"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                * Campos obligatorios. Para simular deudas pasadas y ver el bloqueo de matrícula en acción, introduce un DNI que termine en "99".
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="cursor-pointer">
                {createMutation.isPending ? "Registrando..." : "Registrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
