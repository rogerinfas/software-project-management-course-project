"use client";

import * as React from "react";
import { Search, Loader2, Calendar, FileText, CheckCircle, Receipt, DollarSign, Printer, Download, CreditCard, Landmark, Coins } from "lucide-react";

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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backend } from "@/lib/api/types/backend";

export default function ReceiptsPage() {
  // Filters
  const [search, setSearch] = React.useState("");

  // Receipt popup state
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [invoiceOpen, setInvoiceOpen] = React.useState(false);

  // Queries
  const { data: payments, isLoading } = backend.useQuery(
    "get",
    "/api/treasury/payments",
    {
      params: {
        query: {} as any,
      },
    }
  );

  // Filters
  const filteredPayments = payments?.filter((p: any) => {
    const stdName = `${p.charge?.student?.firstName || ""} ${p.charge?.student?.lastName || ""}`.toLowerCase();
    const concept = (p.charge?.tariff?.concept || "").toLowerCase();
    const searchVal = search.toLowerCase();

    return stdName.includes(searchVal) || concept.includes(searchVal) || p.id.includes(searchVal);
  });

  const totalPaymentsCount = payments?.length || 0;
  const totalCollectedSum = payments?.reduce((acc: number, curr: any) => acc + curr.totalAmount, 0) || 0;
  const cashPaymentsCount = payments?.filter((p: any) => p.method === "CASH").length || 0;
  const bankPaymentsCount = payments?.filter((p: any) => p.method === "TRANSFER").length || 0;
  const cardPaymentsCount = payments?.filter((p: any) => p.method === "CARD").length || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header matching prototype design */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 4 · Emisión de Recibos</h1>
          <p className="text-muted-foreground text-sm">
            Historial de transacciones de cobro en caja e impresión de recibos escolares.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid matching M2 style */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <DollarSign className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">S/ {totalCollectedSum.toFixed(2)}</p>
              <p className="text-muted-foreground text-xs font-medium">Total Recaudado</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Coins className="size-8 text-amber-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{cashPaymentsCount}</p>
              <p className="text-muted-foreground text-xs font-medium">En Efectivo</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Landmark className="size-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{bankPaymentsCount}</p>
              <p className="text-muted-foreground text-xs font-medium">Transferencias</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <CreditCard className="size-8 text-blue-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{cardPaymentsCount}</p>
              <p className="text-muted-foreground text-xs font-medium">Con Tarjeta</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main List matching M2 Style */}
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
                          className="h-8 text-xs font-semibold"
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

      {/* Invoice Receipt Dialog (Mock PDF) */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="rounded-3xl max-w-lg p-0 overflow-hidden border border-border">
          <div className="bg-card p-6 border-b border-border">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Receipt className="size-5 text-primary" /> Boleta de Pago Oficial
            </DialogTitle>
          </div>

          {selectedPayment && (
            <div className="p-6 space-y-6">
              {/* Receipt Body */}
              <div id="printable-receipt" className="border border-border/80 p-5 rounded-2xl space-y-5 bg-card/30 relative">
                <div className="absolute right-6 top-6 opacity-5">
                  <CheckCircle className="size-20 text-emerald-500" />
                </div>
                {/* School logo/meta */}
                <div className="text-center space-y-1">
                  <h3 className="text-md font-bold tracking-tight text-foreground">COLEGIO SAN AGUSTÍN</h3>
                  <p className="text-[11px] text-muted-foreground">R.U.C. 20455678901 • Av. Larco 1250, Miraflores</p>
                  <div className="inline-block px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2">
                    Pago Completado
                  </div>
                </div>

                {/* Meta details grid */}
                <div className="grid grid-cols-2 gap-4 text-xs border-y border-border/60 py-4">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Alumno:</span>
                    <span className="font-semibold text-foreground">
                      {selectedPayment.charge?.student?.firstName} {selectedPayment.charge?.student?.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">DNI Alumno:</span>
                    <span className="font-semibold text-foreground">{selectedPayment.charge?.student?.dni}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Fecha y Hora:</span>
                    <span className="font-semibold text-foreground">{new Date(selectedPayment.timestamp).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Nro Transacción:</span>
                    <span className="font-mono font-semibold text-foreground">
                      REC-{selectedPayment.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Concept and amount breakdown */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Detalle del Pago</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{selectedPayment.charge?.tariff?.concept}</span>
                    <span className="font-bold text-foreground tabular-nums">
                      S/ {selectedPayment.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Method details */}
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-xl text-xs border border-border/60">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-card text-foreground font-semibold">
                      {selectedPayment.method === "CASH"
                        ? "Efectivo"
                        : selectedPayment.method === "TRANSFER"
                        ? "Transferencia"
                        : "Tarjeta"}
                    </Badge>
                    <span className="text-muted-foreground">Método utilizado</span>
                  </div>
                  <div className="font-bold text-foreground">S/ {selectedPayment.totalAmount.toFixed(2)}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="h-9 flex items-center gap-1.5"
                >
                  <Printer className="size-4" /> Imprimir
                </Button>
                <Button
                  onClick={() => setInvoiceOpen(false)}
                  className="h-9 font-semibold"
                >
                  Cerrar Visor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
