import * as React from "react";
import { CheckCircle, Printer, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReceiptsDialogProps {
  invoiceOpen: boolean;
  setInvoiceOpen: (val: boolean) => void;
  selectedPayment: any;
}

export function ReceiptsDialog({ invoiceOpen, setInvoiceOpen, selectedPayment }: ReceiptsDialogProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
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
                className="h-9 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="size-4" /> Imprimir
              </Button>
              <Button
                onClick={() => setInvoiceOpen(false)}
                className="h-9 font-semibold cursor-pointer"
              >
                Cerrar Visor
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
