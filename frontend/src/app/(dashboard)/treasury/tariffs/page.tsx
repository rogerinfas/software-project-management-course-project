"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Award, DollarSign, Calendar, ShieldAlert, Loader2, Search } from "lucide-react";
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

const tariffSchema = z.object({
  concept: z.string().min(3, "El concepto debe tener al menos 3 caracteres"),
  amount: z.string().min(1, "Monto es requerido").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "El monto debe ser un número válido mayor a 0",
  }),
  type: z.enum(["ONE_TIME", "MONTHLY", "EXTRA"]),
  level: z.enum(["INITIAL", "PRIMARY", "SECONDARY"]),
});

export default function TariffsPage() {
  const queryClient = useQueryClient();

  // Search & Filter
  const [search, setSearch] = React.useState("");

  // Create & Edit Dialog Visibility / ID
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  // React Hook Form setups
  const createForm = useForm({
    resolver: zodResolver(tariffSchema),
    defaultValues: {
      concept: "",
      amount: "",
      type: "MONTHLY" as "ONE_TIME" | "MONTHLY" | "EXTRA",
      level: "PRIMARY" as "INITIAL" | "PRIMARY" | "SECONDARY",
    },
  });
  const { formState: { errors: createErrors } } = createForm;

  const editForm = useForm({
    resolver: zodResolver(tariffSchema),
    defaultValues: {
      concept: "",
      amount: "",
      type: "MONTHLY" as "ONE_TIME" | "MONTHLY" | "EXTRA",
      level: "PRIMARY" as "INITIAL" | "PRIMARY" | "SECONDARY",
    },
  });
  const { formState: { errors: editErrors } } = editForm;

  // Queries
  const { data: tariffs, isLoading } = backend.useQuery(
    "get",
    "/api/treasury/tariffs",
    {
      params: {
        query: {} as any,
      },
    }
  );

  // Mutations
  const createMutation = backend.useMutation("post", "/api/treasury/tariffs", {
    onSuccess: () => {
      toast.success("Tarifa creada con éxito");
      createForm.reset();
      setNewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/tariffs"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("put", "/api/treasury/tariffs/{id}", {
    onSuccess: () => {
      toast.success("Tarifa actualizada con éxito");
      setEditId(null);
      editForm.reset();
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/tariffs"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/treasury/tariffs/{id}", {
    onSuccess: () => {
      toast.success("Tarifa eliminada con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/tariffs"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const handleCreate = (data: { concept: string; amount: string; type: "ONE_TIME" | "MONTHLY" | "EXTRA"; level: "INITIAL" | "PRIMARY" | "SECONDARY" }) => {
    if (!data.concept || !data.amount) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    createMutation.mutate({
      body: {
        concept: data.concept,
        amount: parseFloat(data.amount),
        type: data.type,
        level: data.level,
      },
    });
  };

  const handleUpdate = (data: { concept: string; amount: string; type: "ONE_TIME" | "MONTHLY" | "EXTRA"; level: "INITIAL" | "PRIMARY" | "SECONDARY" }) => {
    if (!editId || !data.concept || !data.amount) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    updateMutation.mutate({
      params: {
        path: { id: editId },
      },
      body: {
        concept: data.concept,
        amount: parseFloat(data.amount),
        type: data.type,
        level: data.level,
      },
    });
  };

  const openEdit = (tariff: any) => {
    setEditId(tariff.id);
    editForm.setValue("concept", tariff.concept);
    editForm.setValue("amount", tariff.amount.toString());
    editForm.setValue("type", tariff.type);
    editForm.setValue("level", tariff.level);
    setEditOpen(true);
  };

  // Filtered list
  const filteredTariffs = tariffs?.filter((t) =>
    t.concept.toLowerCase().includes(search.toLowerCase())
  );

  // Computations for stats
  const totalConcepts = tariffs?.length || 0;
  const averageAmount = tariffs?.length
    ? Number((tariffs.reduce((acc, curr) => acc + curr.amount, 0) / tariffs.length).toFixed(2))
    : 0.0;
  const primaryCount = tariffs?.filter((t) => t.level === "PRIMARY").length || 0;
  const secondaryCount = tariffs?.filter((t) => t.level === "SECONDARY").length || 0;

  return (
    <div className="space-y-6">
      {/* Header matching prototype design */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 4 · Tarifario Integral</h1>
          <p className="text-muted-foreground text-sm">
            Configuración y administración de conceptos oficiales de cobro por nivel académico.
          </p>
        </div>
        <Button
          onClick={() => setNewOpen(true)}
          className="inline-flex items-center gap-2 cursor-pointer h-9"
        >
          <Plus className="size-4" /> Nueva Tarifa
        </Button>
      </div>

      {/* Metric Cards Grid matching M2 style */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Award className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{totalConcepts}</p>
              <p className="text-muted-foreground text-xs font-medium">Conceptos vigentes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <DollarSign className="size-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">S/ {averageAmount}</p>
              <p className="text-muted-foreground text-xs font-medium">Promedio general</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Calendar className="size-8 text-cyan-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{primaryCount}</p>
              <p className="text-muted-foreground text-xs font-medium">Conceptos Primaria</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <ShieldAlert className="size-8 text-blue-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{secondaryCount}</p>
              <p className="text-muted-foreground text-xs font-medium">Conceptos Secundaria</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main List Card matching M2 Style */}
      <Card className="bg-card border-border/80">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Listado de Conceptos</CardTitle>
              <CardDescription>Visualiza y administra todos los montos académicos del colegio</CardDescription>
            </div>
            <div className="relative w-full max-w-xs sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar concepto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando tarifario...</p>
            </div>
          ) : filteredTariffs?.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <Search className="size-12 text-muted-foreground mb-3" />
              <p className="text-base font-semibold">No se encontraron tarifas</p>
              <p className="text-sm text-muted-foreground">Prueba ajustando los términos de búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Concepto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nivel Académico</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTariffs?.map((tariff) => (
                    <TableRow key={tariff.id}>
                      <TableCell className="font-medium text-foreground">
                        {tariff.concept}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            tariff.type === "MONTHLY"
                              ? "bg-teal-500/10 text-teal-500 border-teal-500/20"
                              : tariff.type === "ONE_TIME"
                              ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }
                        >
                          {tariff.type === "MONTHLY"
                            ? "Mensual"
                            : tariff.type === "ONE_TIME"
                            ? "Único"
                            : "Extraordinario"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                        >
                          {tariff.level === "INITIAL"
                            ? "Inicial"
                            : tariff.level === "PRIMARY"
                            ? "Primaria"
                            : "Secundaria"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums">
                        S/ {tariff.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(tariff)}
                            className="size-8"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm(`¿Estás seguro de eliminar el concepto "${tariff.concept}"?`)) {
                                deleteMutation.mutate({ params: { path: { id: tariff.id } } });
                              }
                            }}
                            className="size-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Nueva Tarifa Escolar</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="concept" className={cn(createErrors.concept && "text-red-500")}>Concepto de Cobro</Label>
              <Input
                id="concept"
                placeholder="Ej. Pensión de Julio, Matrícula 2026..."
                {...createForm.register("concept")}
                className={cn("h-9", createErrors.concept && "border-red-500 focus-visible:ring-red-500")}
              />
              {createErrors.concept?.message && (
                <p className="text-red-500 text-xs mt-1">{String(createErrors.concept.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className={cn(createErrors.amount && "text-red-500")}>Monto (S/)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...createForm.register("amount")}
                className={cn("h-9", createErrors.amount && "border-red-500 focus-visible:ring-red-500")}
              />
              {createErrors.amount?.message && (
                <p className="text-red-500 text-xs mt-1">{String(createErrors.amount.message)}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Cobro</Label>
                <Select value={createForm.watch("type")} onValueChange={(val) => createForm.setValue("type", val as any)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Mensual</SelectItem>
                    <SelectItem value="ONE_TIME">Pago Único</SelectItem>
                    <SelectItem value="EXTRA">Extraordinario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nivel Educativo</Label>
                <Select value={createForm.watch("level")} onValueChange={(val) => createForm.setValue("level", val as any)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INITIAL">Inicial</SelectItem>
                    <SelectItem value="PRIMARY">Primaria</SelectItem>
                    <SelectItem value="SECONDARY">Secundaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewOpen(false)}
                className="h-9"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="h-9 font-semibold"
              >
                {createMutation.isPending ? "Creando..." : "Crear Tarifa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Tarifa</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-concept" className={cn(editErrors.concept && "text-red-500")}>Concepto de Cobro</Label>
              <Input
                id="edit-concept"
                {...editForm.register("concept")}
                className={cn("h-9", editErrors.concept && "border-red-500 focus-visible:ring-red-500")}
              />
              {editErrors.concept?.message && (
                <p className="text-red-500 text-xs mt-1">{String(editErrors.concept.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount" className={cn(editErrors.amount && "text-red-500")}>Monto (S/)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                {...editForm.register("amount")}
                className={cn("h-9", editErrors.amount && "border-red-500 focus-visible:ring-red-500")}
              />
              {editErrors.amount?.message && (
                <p className="text-red-500 text-xs mt-1">{String(editErrors.amount.message)}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Cobro</Label>
                <Select value={editForm.watch("type")} onValueChange={(val) => editForm.setValue("type", val as any)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Mensual</SelectItem>
                    <SelectItem value="ONE_TIME">Pago Único</SelectItem>
                    <SelectItem value="EXTRA">Extraordinario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nivel Educativo</Label>
                <Select value={editForm.watch("level")} onValueChange={(val) => editForm.setValue("level", val as any)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INITIAL">Inicial</SelectItem>
                    <SelectItem value="PRIMARY">Primaria</SelectItem>
                    <SelectItem value="SECONDARY">Secundaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="h-9"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="h-9 font-semibold"
              >
                {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
