import * as React from "react";
import { Search, Loader2, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface ReceiptsTableProps {
  search: string;
  setSearch: (val: string) => void;
  isLoading: boolean;
  filteredPayments: any[];
  setSelectedPayment: (val: any) => void;
  setInvoiceOpen: (val: boolean) => void;
}

export function ReceiptsTable({
  search,
  setSearch,
  isLoading,
  filteredPayments,
  setSelectedPayment,
  setInvoiceOpen,
}: ReceiptsTableProps) {
  return (
    <Card className="bg-card border-border/80">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Historial de Transacciones</CardTitle>
            <CardDescription>
              Flujo de ingresos registrados en caja. Emite e imprime los comprobantes.
            </CardDescription>
          </div>
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por alumno, concepto o ID..."
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
            <p className="text-sm text-muted-foreground">Cargando transacciones...</p>
          </div>
        ) : filteredPayments?.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Search className="size-12 text-muted-foreground mb-3" />
            <p className="text-base font-semibold">No se encontraron pagos</p>
            <p className="text-sm text-muted-foreground">El historial se actualizará cuando se registre un nuevo cobro.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Recibo</TableHead>
                  <TableHead>Alumno</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Fecha de Pago</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Monto Pagado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments?.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-semibold text-muted-foreground">
                      #{payment.id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground">
                        {payment.charge?.student?.firstName} {payment.charge?.student?.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">DNI: {payment.charge?.student?.dni}</div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {payment.charge?.tariff?.concept}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        <span>{new Date(payment.timestamp).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          payment.method === "CASH"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : payment.method === "TRANSFER"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }
                      >
                        {payment.method === "CASH"
                          ? "Efectivo"
                          : payment.method === "TRANSFER"
                          ? "Transferencia"
                          : "Tarjeta"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-extrabold tabular-nums text-emerald-600">
                      S/ {payment.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setInvoiceOpen(true);
                        }}
                        className="h-8 text-xs font-semibold cursor-pointer"
                      >
                        <FileText className="size-3.5 mr-1" /> Boleta
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
