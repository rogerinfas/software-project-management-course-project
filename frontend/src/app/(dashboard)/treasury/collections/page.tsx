"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DollarSign, ShieldAlert, CheckCircle, Clock, Calendar, Plus, RefreshCw, Loader2, Search, Trash2, Coins } from "lucide-react";
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

export default function CollectionsPage() {
  const queryClient = useQueryClient();

  // Filter states
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "PENDING" | "PARTIAL" | "PAID">("ALL");

  // Bulk charges dialog
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [bulkTariffId, setBulkTariffId] = React.useState("");
  const [bulkDueDate, setBulkDueDate] = React.useState("");

  // Direct charge dialog
  const [singleOpen, setSingleOpen] = React.useState(false);
  const [sStudentId, setSStudentId] = React.useState("");
  const [sTariffId, setSTariffId] = React.useState("");
  const [sDueDate, setSDueDate] = React.useState("");

  // Register payment inline dialog
  const [payOpen, setPayOpen] = React.useState(false);
  const [payCharge, setPayCharge] = React.useState<any>(null);
  const [payAmount, setPayAmount] = React.useState("");
  const [payMethod, setPayMethod] = React.useState<"CASH" | "CARD" | "TRANSFER">("CASH");

  // Queries
  const { data: charges, isLoading: loadingCharges } = backend.useQuery(
    "get",
    "/api/treasury/charges",
    {
      params: {
        query: {} as any,
      },
    }
  );

  const { data: tariffs } = backend.useQuery(
    "get",
    "/api/treasury/tariffs",
    {
      params: {
        query: {} as any,
      },
    }
  );

  // Fetch students for single charges
  const { data: studentsData } = backend.useQuery(
    "get",
    "/api/enrollment/students" as any,
    {
      params: {
        query: { page: 1, size: 200 } as any,
      },
    }
  );
  const students = (studentsData as any)?.data || [];

  // Mutations
  const generateBulkMutation = backend.useMutation("post", "/api/treasury/charges/bulk", {
    onSuccess: (res: any) => {
      toast.success(`Cargos masivos generados con éxito: ${res.count || 0} alumnos cobrados.`);
      setBulkOpen(false);
      setBulkTariffId("");
      setBulkDueDate("");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/charges"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const createSingleMutation = backend.useMutation("post", "/api/treasury/charges", {
    onSuccess: () => {
      toast.success("Cargo registrado de forma individual");
      setSingleOpen(false);
      setSStudentId("");
      setSTariffId("");
      setSDueDate("");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/charges"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteChargeMutation = backend.useMutation("delete", "/api/treasury/charges/{id}", {
    onSuccess: () => {
      toast.success("Cargo eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/charges"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const registerPaymentMutation = backend.useMutation("post", "/api/treasury/payments", {
    onSuccess: () => {
      toast.success("Pago registrado correctamente");
      setPayOpen(false);
      setPayCharge(null);
      setPayAmount("");
      setPayMethod("CASH");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/charges"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/payments"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkTariffId) {
      toast.error("Selecciona un concepto tarifario");
      return;
    }
    generateBulkMutation.mutate({
      body: {
        tariffId: bulkTariffId,
        dueDate: bulkDueDate ? new Date(bulkDueDate).toISOString() : undefined,
      },
    });
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sStudentId || !sTariffId) {
      toast.error("Selecciona estudiante y concepto tarifario");
      return;
    }
    createSingleMutation.mutate({
      body: {
        studentId: sStudentId,
        tariffId: sTariffId,
        dueDate: sDueDate ? new Date(sDueDate).toISOString() : undefined,
      },
    });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payCharge || !payAmount) return;
    registerPaymentMutation.mutate({
      body: {
        chargeId: payCharge.id,
        amount: parseFloat(payAmount),
        method: payMethod,
      },
    });
  };

  // Computations
  const filteredCharges = charges?.filter((c: any) => {
    const matchesSearch =
      c.student?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      c.student?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      c.student?.dni?.includes(search) ||
      c.tariff?.concept?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = charges?.reduce((acc: number, curr: any) => acc + curr.pendingAmount, 0) || 0;
  const overdueCharges = charges?.filter((c: any) => c.status !== "PAID" && c.dueDate && new Date(c.dueDate) < new Date()).length || 0;
  const paidAmount = charges?.reduce((acc: number, curr: any) => acc + (curr.originalAmount - curr.pendingAmount), 0) || 0;
  const totalAmount = charges?.reduce((acc: number, curr: any) => acc + curr.originalAmount, 0) || 1;
  const collectionPercentage = Number(((paidAmount / totalAmount) * 100).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header matching prototype design */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 4 · Gestión de Cobranzas</h1>
          <p className="text-muted-foreground text-sm">
            Monitorea las cuentas por cobrar, genera cargos mensuales y procesa pagos de alumnos en ventanilla.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setSingleOpen(true)}
            className="inline-flex items-center gap-2 cursor-pointer h-9"
          >
            <Plus className="size-4" /> Cargo Individual
          </Button>
          <Button
            onClick={() => setBulkOpen(true)}
            className="inline-flex items-center gap-2 cursor-pointer h-9"
          >
            <RefreshCw className="size-4 animate-spin-slow" /> Facturación Masiva
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid matching M2 style */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <DollarSign className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">S/ {totalOutstanding.toFixed(2)}</p>
              <p className="text-muted-foreground text-xs font-medium">Por cobrar</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <ShieldAlert className="size-8 text-amber-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{overdueCharges}</p>
              <p className="text-muted-foreground text-xs font-medium">Cargos vencidos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <CheckCircle className="size-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">S/ {paidAmount.toFixed(2)}</p>
              <p className="text-muted-foreground text-xs font-medium">Recaudado histórico</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Clock className="size-8 text-indigo-550 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{collectionPercentage}%</p>
              <p className="text-muted-foreground text-xs font-medium">Eficiencia de cobro</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main List matching M2 Style */}
      <Card className="bg-card border-border/80">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Listado General de Cuentas</CardTitle>
              <CardDescription>
                Búsqueda en tiempo real por DNI, nombre o concepto. Registra cobros manuales.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val || "ALL")}>
                <SelectTrigger className="w-full sm:w-40 h-9">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los Estados</SelectItem>
                  <SelectItem value="PENDING">Pendientes</SelectItem>
                  <SelectItem value="PARTIAL">Pagos Parciales</SelectItem>
                  <SelectItem value="PAID">Completados</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full max-w-xs sm:w-64">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar alumno o DNI..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loadingCharges ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando cuentas...</p>
            </div>
          ) : filteredCharges?.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <Search className="size-12 text-muted-foreground mb-3" />
              <p className="text-base font-semibold">No se encontraron cobros</p>
              <p className="text-sm text-muted-foreground">Ajusta los filtros o genera cargos para iniciar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Concepto Cobrado</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Monto Original</TableHead>
                    <TableHead className="text-right">Pendiente</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCharges?.map((charge: any) => {
                    const isOverdue =
                      charge.status !== "PAID" &&
                      charge.dueDate &&
                      new Date(charge.dueDate) < new Date();
                    return (
                      <TableRow key={charge.id}>
                        <TableCell>
                          <div className="font-semibold text-foreground">
                            {charge.student?.firstName} {charge.student?.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">DNI: {charge.student?.dni}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs capitalize">
                            {charge.student?.level?.toLowerCase() === "primary" ? "Primaria" : "Secundaria"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {charge.tariff?.concept}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="size-3.5 text-muted-foreground" />
                            <span className={isOverdue ? "text-red-500 font-semibold" : ""}>
                              {charge.dueDate ? new Date(charge.dueDate).toLocaleDateString() : "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              charge.status === "PAID"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : charge.status === "PARTIAL"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : isOverdue
                                ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse"
                                : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                            }
                          >
                            {charge.status === "PAID"
                              ? "Completo"
                              : charge.status === "PARTIAL"
                              ? "Parcial"
                              : isOverdue
                              ? "Vencido"
                              : "Pendiente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums text-foreground">
                          S/ {charge.originalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold tabular-nums text-primary">
                          S/ {charge.pendingAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {charge.status !== "PAID" && (
                              <Button
                                onClick={() => {
                                  setPayCharge(charge);
                                  setPayAmount(charge.pendingAmount.toString());
                                  setPayOpen(true);
                                }}
                                className="h-7 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Cobrar
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm("¿Estás seguro de eliminar este cargo registrado?")) {
                                  deleteChargeMutation.mutate({ params: { path: { id: charge.id } } });
                                }
                              }}
                              className="size-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Charges Dialog */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Generación de Cargos Masivos</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBulkSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Concepto Tarifario a Cobrar</Label>
              <Select value={bulkTariffId} onValueChange={(val) => setBulkTariffId(val || "")}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecciona una tarifa" />
                </SelectTrigger>
                <SelectContent>
                  {tariffs?.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.concept} (S/ {t.amount.toFixed(2)}) - {t.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-due-date">Fecha de Vencimiento</Label>
              <Input
                id="bulk-due-date"
                type="date"
                value={bulkDueDate}
                onChange={(e) => setBulkDueDate(e.target.value)}
                required
                className="h-9"
              />
            </div>
            <div className="p-3 bg-muted border border-border rounded-xl text-xs text-muted-foreground leading-relaxed">
              <strong>Nota Importante:</strong> Se generará un cargo financiero individual para todos los estudiantes matriculados en el nivel académico correspondiente al concepto seleccionado.
            </div>
            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBulkOpen(false)}
                className="h-9"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={generateBulkMutation.isPending}
                className="h-9 font-semibold"
              >
                {generateBulkMutation.isPending ? "Generando..." : "Generar Cargos Masivos"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Individual Charge Dialog */}
      <Dialog open={singleOpen} onOpenChange={setSingleOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Generar Cargo Individual</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSingleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Selecciona Alumno</Label>
              <Select value={sStudentId} onValueChange={(val) => setSStudentId(val || "")}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Buscar estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((std: any) => (
                    <SelectItem key={std.id} value={std.id}>
                      {std.firstName} {std.lastName} - DNI: {std.dni} ({std.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Concepto Tarifario</Label>
              <Select value={sTariffId} onValueChange={(val) => setSTariffId(val || "")}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Concepto de cobro" />
                </SelectTrigger>
                <SelectContent>
                  {tariffs?.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.concept} (S/ {t.amount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="single-due-date">Fecha de Vencimiento</Label>
              <Input
                id="single-due-date"
                type="date"
                value={sDueDate}
                onChange={(e) => setSDueDate(e.target.value)}
                required
                className="h-9"
              />
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSingleOpen(false)}
                className="h-9"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createSingleMutation.isPending}
                className="h-9 font-semibold"
              >
                {createSingleMutation.isPending ? "Generando..." : "Asignar Cargo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Payment Inline Dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Registrar Cobro de Caja</DialogTitle>
          </DialogHeader>
          {payCharge && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-2">
              <div className="p-4 bg-muted rounded-xl space-y-2 text-sm border border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estudiante:</span>
                  <span className="font-semibold">{payCharge.student?.firstName} {payCharge.student?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concepto:</span>
                  <span className="font-semibold">{payCharge.tariff?.concept}</span>
                </div>
                <div className="flex justify-between border-t border-border/80 pt-2 mt-2">
                  <span className="text-muted-foreground">Saldo Pendiente:</span>
                  <span className="font-extrabold text-primary tabular-nums">S/ {payCharge.pendingAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pay-amount">Monto Recibido (S/)</Label>
                <Input
                  id="pay-amount"
                  type="number"
                  step="0.01"
                  max={payCharge.pendingAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Select value={payMethod} onValueChange={(val: any) => setPayMethod(val || "CASH")}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                    <SelectItem value="CARD">Tarjeta de Débito / Crédito</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia Bancaria / Yape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPayOpen(false)}
                  className="h-9"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={registerPaymentMutation.isPending}
                  className="h-9 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {registerPaymentMutation.isPending ? "Procesando..." : "Confirmar Cobro"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
