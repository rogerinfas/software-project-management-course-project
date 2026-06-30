import * as React from "react";
import { Search, Loader2, Calendar, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "../../_types/collections.types";

interface CollectionsTableProps {
  statusFilter: string;
  setStatusFilter: (val: any) => void;
  search: string;
  setSearch: (val: string) => void;
  loadingCharges: boolean;
  filteredCharges: any[];
  setPayCharge: (val: any) => void;
  setPayOpen: (val: boolean) => void;
  paymentForm: UseFormReturn<PaymentFormValues>;
  deleteChargeMutation: any;
}

export function CollectionsTable({
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
  loadingCharges,
  filteredCharges,
  setPayCharge,
  setPayOpen,
  paymentForm,
  deleteChargeMutation,
}: CollectionsTableProps) {
  return (
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
                                paymentForm.setValue("amount", charge.pendingAmount.toString());
                                setPayOpen(true);
                              }}
                              className="h-7 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
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
                            className="size-8 text-destructive hover:text-destructive cursor-pointer"
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
  );
}
