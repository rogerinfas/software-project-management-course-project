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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const guardianSchema = z.object({
  name: z.string().min(5, "El nombre completo debe tener al menos 5 caracteres"),
  dni: z.string().length(8, "DNI debe tener exactamente 8 caracteres"),
  phone: z.string().min(6, "Teléfono inválido"),
  email: z.string().email("Correo electrónico inválido").or(z.literal("")),
  occupation: z.string().optional(),
});

export default function ApoderadosPage() {
  const queryClient = useQueryClient();

  // Filters & State
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [size] = React.useState(10);

  // Edit inline state
  const [editId, setEditId] = React.useState<string | null>(null);

  // New apoderado dialog state
  const [newOpen, setNewOpen] = React.useState(false);

  // React Hook Form setups
  const createForm = useForm({
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      name: "",
      dni: "",
      phone: "",
      email: "",
      occupation: "",
    },
  });
  const { formState: { errors: createErrors } } = createForm;

  const editForm = useForm({
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      name: "",
      dni: "",
      phone: "",
      email: "",
      occupation: "",
    },
  });
  const { formState: { errors: editErrors } } = editForm;

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
      createForm.reset();
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
      editForm.reset();
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
    editForm.setValue("name", g.name);
    editForm.setValue("dni", g.dni);
    editForm.setValue("phone", g.phone);
    editForm.setValue("email", g.email || "");
    editForm.setValue("occupation", g.occupation || "");
  }

  function saveEdit(data: { name: string; dni: string; phone: string; email: string; occupation?: string }) {
    if (!editId) return;
    if (!data.name.trim() || !data.dni.trim()) {
      toast.error("El nombre y el DNI son requeridos");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        dni: data.dni,
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        occupation: data.occupation || undefined,
      },
    });
  }

  function handleAdd(data: { name: string; dni: string; phone: string; email: string; occupation?: string }) {
    if (!data.name.trim() || !data.dni.trim() || !data.phone.trim()) {
      toast.error("El nombre, DNI y teléfono son obligatorios");
      return;
    }
    createMutation.mutate({
      body: {
        dni: data.dni,
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        occupation: data.occupation || undefined,
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
                    <TableHead className="w-[18%]">Apoderado</TableHead>
                    <TableHead className="w-[11%]">DNI</TableHead>
                    <TableHead className="w-[13%]">Teléfono</TableHead>
                    <TableHead className="w-[17%]">Correo</TableHead>
                    <TableHead className="w-[15%]">Ocupación</TableHead>
                    <TableHead className="w-[14%]">Alumnos Asociados</TableHead>
                    <TableHead className="w-[12%] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-muted-foreground text-center py-6 text-sm">
                        No se encontraron apoderados registrados.
                      </TableCell>
                    </TableRow>
                  )}
                  {list.map((g: any) =>
                    editId === g.id ? (
                      <TableRow key={g.id} className="bg-muted/20">
                        <TableCell className="overflow-hidden">
                          <Input
                            className={cn("h-8 w-full text-xs font-semibold bg-background", editErrors.name && "border-red-500 focus-visible:ring-red-500")}
                            {...editForm.register("name")}
                          />
                          {editErrors.name?.message && (
                            <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.name.message)}</p>
                          )}
                        </TableCell>
                        <TableCell className="overflow-hidden">
                          <Input
                            className={cn("h-8 w-full font-mono text-xs bg-background", editErrors.dni && "border-red-500 focus-visible:ring-red-500")}
                            maxLength={8}
                            {...editForm.register("dni")}
                          />
                          {editErrors.dni?.message && (
                            <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.dni.message)}</p>
                          )}
                        </TableCell>
                        <TableCell className="overflow-hidden">
                          <Input
                            className={cn("h-8 w-full text-xs bg-background", editErrors.phone && "border-red-500 focus-visible:ring-red-500")}
                            placeholder="Teléfono"
                            {...editForm.register("phone")}
                          />
                          {editErrors.phone?.message && (
                            <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.phone.message)}</p>
                          )}
                        </TableCell>
                        <TableCell className="overflow-hidden">
                          <Input
                            className={cn("h-8 w-full text-xs bg-background", editErrors.email && "border-red-500 focus-visible:ring-red-500")}
                            placeholder="Correo"
                            {...editForm.register("email")}
                          />
                          {editErrors.email?.message && (
                            <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.email.message)}</p>
                          )}
                        </TableCell>
                        <TableCell className="overflow-hidden">
                          <Input
                            className={cn("h-8 w-full text-xs bg-background", editErrors.occupation && "border-red-500 focus-visible:ring-red-500")}
                            {...editForm.register("occupation")}
                          />
                          {editErrors.occupation?.message && (
                            <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.occupation.message)}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {(g.students?.length ?? 0)} alumnos
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1.5">
                          <Button
                            size="xs"
                            onClick={editForm.handleSubmit(saveEdit)}
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
                        <TableCell className="text-xs font-medium">{g.phone}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{g.email || "—"}</TableCell>
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
          <form onSubmit={createForm.handleSubmit(handleAdd)} className="space-y-4">
            <div className="grid gap-3 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-name" className={cn(createErrors.name && "text-red-500")}>Nombre Completo *</Label>
                <Input
                  id="new-name"
                  placeholder="ej. Juan Pérez Delgado"
                  {...createForm.register("name")}
                  className={cn(createErrors.name && "border-red-500 focus-visible:ring-red-500")}
                />
                {createErrors.name?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.name.message)}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-dni" className={cn(createErrors.dni && "text-red-500")}>DNI *</Label>
                  <Input
                    id="new-dni"
                    maxLength={8}
                    placeholder="8 dígitos"
                    className={cn("font-mono", createErrors.dni && "border-red-500 focus-visible:ring-red-500")}
                    {...createForm.register("dni")}
                  />
                  {createErrors.dni?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.dni.message)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-phone" className={cn(createErrors.phone && "text-red-500")}>Teléfono *</Label>
                  <Input
                    id="new-phone"
                    placeholder="987654321"
                    {...createForm.register("phone")}
                    className={cn(createErrors.phone && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {createErrors.phone?.message && (
                    <p className="text-red-500 text-xs mt-0.5">{String(createErrors.phone.message)}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-email" className={cn(createErrors.email && "text-red-500")}>Correo Electrónico</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="juan.perez@ejemplo.com"
                  {...createForm.register("email")}
                  className={cn(createErrors.email && "border-red-500 focus-visible:ring-red-500")}
                />
                {createErrors.email?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.email.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-ocup" className={cn(createErrors.occupation && "text-red-500")}>Ocupación o Profesión</Label>
                <Input
                  id="new-ocup"
                  placeholder="ej. Ingeniero de Sistemas"
                  {...createForm.register("occupation")}
                  className={cn(createErrors.occupation && "border-red-500 focus-visible:ring-red-500")}
                />
                {createErrors.occupation?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.occupation.message)}</p>
                )}
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
