"use client";

import * as React from "react";
import { FileText, RefreshCw, Download, Filter, TrendingDown, Users } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";
import { toast } from "sonner";

export default function PrePlanillaPage() {
  const { staff, prePayroll, recomputePrePayroll } = useDemoData();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRecompute = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      recomputePrePayroll();
      setIsRefreshing(false);
      toast.success("Pre-planilla recalculada con éxito.");
    }, 1500);
  };

  const totalDescuentos = prePayroll.reduce((acc, curr) => acc + curr.descuentoMulta, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">E-4 · Reporte de pre-planilla</h1>
          <p className="text-muted-foreground text-sm">
            Consolidado mensual de asistencias, tardanzas y descuentos proyectados.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" /> Exportar CSV
          </Button>
          <Button
            size="sm"
            onClick={handleRecompute}
            disabled={isRefreshing}
            className="gap-2 shadow-lg shadow-primary/10"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Recalcular Todo
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="size-4 text-destructive" /> Total Descuentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {totalDescuentos.toFixed(2)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Acumulado del mes corriente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="size-4 text-blue-500" /> Colaboradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prePayroll.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Con incidencias de tardanza</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="size-4 text-orange-500" /> Mes de Reporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold uppercase tracking-tighter">MAYO 2026</div>
            <p className="text-[10px] text-muted-foreground mt-1">Periodo actual</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consolidado de Incidencias</CardTitle>
          <CardDescription>
            Resumen por trabajador basado en marcaciones biométricas y reglas de asistencia activas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personal</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead className="text-right">Horas Efec.</TableHead>
                <TableHead className="text-right">Tardanza Total</TableHead>
                <TableHead className="text-right">Monto a Descontar</TableHead>
                <TableHead className="text-right">Sueldo Neto</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prePayroll.map((item) => {
                const person = staff.find((s) => s.id === item.staffId);
                const pctNeto = Math.round((item.neto / item.sueldoBase) * 100);
                return (
                  <TableRow key={item.staffId}>
                    <TableCell className="font-medium text-xs">
                      {person ? `${person.apellidos}, ${person.nombres}` : item.staffId}
                    </TableCell>
                    <TableCell className="font-mono text-[10px] text-muted-foreground">{person?.dni}</TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold">{item.horasEfectivas}h</TableCell>
                    <TableCell className="text-right tabular-nums text-xs font-bold text-orange-600">
                      {item.minutosTardanza} min
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-xs font-bold text-destructive">
                      - S/ {item.descuentoMulta.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex flex-col items-end gap-1">
                          <span className="font-black text-xs tabular-nums text-primary">S/ {item.neto.toFixed(2)}</span>
                          <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-primary" style={{ width: `${pctNeto}%` }} />
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.descuentoMulta > 50 ? "destructive" : "outline"} className="text-[9px] uppercase">
                        {item.descuentoMulta > 50 ? "Alerta Grave" : "Proyectado"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
                {prePayroll.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                       <FileText className="size-10 mx-auto mb-2 opacity-20" />
                       <p className="text-sm font-medium">No hay incidencias calculadas.</p>
                       <p className="text-[10px]">Presione &quot;Recalcular&quot; para procesar marcaciones.</p>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-4">
         <AlertCircle className="size-5 text-blue-600 mt-0.5" />
         <div>
            <h4 className="text-sm font-bold text-blue-900">Nota para Contabilidad</h4>
            <p className="text-xs text-blue-700 mt-1">
              Este reporte es referencial. Los descuentos finales deben ser validados contra el libro de incidencias y justificaciones manuales que no forman parte del prototipo de reconocimiento facial.
            </p>
         </div>
      </div>
    </div>
  );
}

// Simple AlertCircle component since I used it but didn't import it correctly above
function AlertCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
