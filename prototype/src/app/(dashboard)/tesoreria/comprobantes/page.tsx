"use client";

import * as React from "react";
import { FileText, Download, Printer, AlertTriangle, Send } from "lucide-react";

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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoData } from "@/context/demo-data-context";
import type { Receipt } from "@/lib/mock/types";
import { toast } from "sonner";

export default function ComprobantesPage() {
  const { receipts, morosity, collection } = useDemoData();
  const [selectedReceipt, setSelectedReceipt] = React.useState<Receipt | null>(null);

  const handleRemind = (parent: string) => {
    toast.success(`Recordatorio enviado a ${parent} vía WhatsApp.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          D-3 · Comprobantes internos y morosidad
        </h1>
        <p className="text-muted-foreground text-sm">
          Repositorio de recibos y monitoreo preventivo de deudas.
        </p>
      </div>

      <Tabs defaultValue="comprobantes">
        <TabsList>
          <TabsTrigger value="comprobantes">Comprobantes</TabsTrigger>
          <TabsTrigger value="morosidad">Monitor de Morosidad</TabsTrigger>
          <TabsTrigger value="flujo">Recaudación Anual</TabsTrigger>
        </TabsList>

        <TabsContent value="comprobantes" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Últimos recibos emitidos</CardTitle>
              <CardDescription>
                Historial correlativo de ingresos a caja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serie-N°</TableHead>
                    <TableHead>Emitido</TableHead>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono font-medium text-xs">
                        {r.serie}-{String(r.numero).padStart(4, "0")}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(r.emitidoEn).toLocaleString("es-PE", { dateStyle: 'short', timeStyle: 'short' })}
                      </TableCell>
                      <TableCell className="text-xs">{r.estudianteNombre}</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground max-w-[150px] truncate">
                        {r.concepto}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-bold text-xs">
                        S/ {r.montoTotal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon-xs"
                          variant="outline"
                          onClick={() => setSelectedReceipt(r)}
                        >
                          <FileText className="size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="morosidad" className="pt-4">
          <Card className="border-destructive/20">
            <CardHeader className="bg-destructive/5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-destructive" />
                <CardTitle>Alerta de Morosidad</CardTitle>
              </div>
              <CardDescription>
                Seguimiento de cuotas vencidas por apoderado.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apoderado</TableHead>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Meses Adeudados</TableHead>
                    <TableHead className="text-right">Total Pendiente</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {morosity.map((m) => (
                    <TableRow key={`${m.apoderado}-${m.estudiante}`}>
                      <TableCell className="font-medium text-xs">{m.apoderado}</TableCell>
                      <TableCell className="text-xs">{m.estudiante}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {Array.from({ length: m.mesesAdeudados }).map((_, i) => (
                            <Badge key={i} variant="destructive" className="h-4 px-1 text-[8px]">Mes {i+1}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-bold text-destructive text-xs">
                        S/ {m.montoTotal.toLocaleString("es-PE")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="xs" variant="ghost" className="h-7 text-primary hover:text-primary" onClick={() => handleRemind(m.apoderado)}>
                          <Send className="mr-1 size-3" /> Notificar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flujo" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cumplimiento de Cobranzas</CardTitle>
              <CardDescription>Comparativa mensual de ingresos proyectados.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mes</TableHead>
                    <TableHead className="text-right">Proyectado</TableHead>
                    <TableHead className="text-right">Recaudado</TableHead>
                    <TableHead className="text-right">Eficacia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collection.map((m) => {
                    const pct = m.proyectado > 0 ? Math.round((m.recaudado / m.proyectado) * 100) : 0;
                    return (
                      <TableRow key={m.mes}>
                        <TableCell className="font-medium text-xs uppercase">{m.mes}</TableCell>
                        <TableCell className="text-right tabular-nums text-xs text-muted-foreground">S/ {m.proyectado.toLocaleString("es-PE")}</TableCell>
                        <TableCell className="text-right tabular-nums text-xs font-bold">S/ {m.recaudado.toLocaleString("es-PE")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                             <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                               <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                             </div>
                             <span className="text-[10px] font-mono">{pct}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* PDF Receipt Preview Dialog */}
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-none shadow-2xl">
          <div className="bg-primary p-6 text-primary-foreground">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="size-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">MB</span>
                </div>
                <div>
                  <h3 className="font-bold leading-tight">IEP MADRE SANTA BEATRIZ</h3>
                  <p className="text-[10px] opacity-80">RUC: 20450987654</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/10">RECIBO INTERNO</Badge>
                <p className="text-lg font-mono font-bold mt-1">
                  {selectedReceipt?.serie}-{String(selectedReceipt?.numero).padStart(4, "0")}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-center opacity-70">Av. Las Camelias 456, San Isidro, Lima</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div>
                <p className="text-muted-foreground font-bold uppercase tracking-wider mb-1">Pagado por:</p>
                <p className="font-semibold text-black uppercase">{selectedReceipt?.estudianteNombre}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground font-bold uppercase tracking-wider mb-1">Fecha de emisión:</p>
                <p className="font-semibold text-black">{new Date(selectedReceipt?.emitidoEn).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="h-8 hover:bg-transparent">
                    <TableHead className="text-[10px]">CONCEPTO</TableHead>
                    <TableHead className="text-right text-[10px]">IMPORTE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="h-12">
                    <TableCell className="text-[11px] font-medium py-2">
                      {selectedReceipt?.concepto}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-xs">
                      S/ {selectedReceipt?.montoTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border border-dashed">
              <span className="text-xs font-bold">TOTAL RECAUDADO</span>
              <span className="text-lg font-mono font-bold text-primary">S/ {selectedReceipt?.montoTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-center gap-8 py-4 opacity-50 grayscale pointer-events-none">
              <div className="flex flex-col items-center">
                <div className="size-16 border-2 border-primary rounded-full" />
                <span className="text-[8px] mt-1">FIRMA CAJA</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="size-16 border-2 border-primary rounded-full" />
                <span className="text-[8px] mt-1">SELLO IEP</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 flex justify-end gap-2 border-t">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Generando archivo...")}>
              <Download className="size-4" /> Descargar
            </Button>
            <Button size="sm" className="gap-2" onClick={() => window.print()}>
              <Printer className="size-4" /> Imprimir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
