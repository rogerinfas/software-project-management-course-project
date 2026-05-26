"use client";

import * as React from "react";
import { AlertCircle, Calendar, Printer, DollarSign, Clock, ShieldAlert, Award, FileText, CheckCircle2, Loader2, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { backend } from "@/lib/api/types/backend";

export default function PrePayrollPage() {
  // Queries
  const { data: attendanceLogs, isLoading: loadingLogs } = backend.useQuery(
    "get",
    "/api/staff/attendance",
    { params: { query: {} as any } }
  );

  // Filter entry records only for payroll analysis
  const entryRecords = React.useMemo(() => {
    if (!attendanceLogs) return [];
    return attendanceLogs.filter((r: any) => r.type === "entry");
  }, [attendanceLogs]);

  // Pre-Payroll KPI Metrics
  const metrics = React.useMemo(() => {
    if (entryRecords.length === 0) return { totalLateMinutes: 0, totalFines: 0, avgDelay: 0, punctualityRate: 100 };
    const totalLateMinutes = entryRecords.reduce((acc: number, r: any) => acc + r.delayMinutes, 0);
    const totalFines = entryRecords.reduce((acc: number, r: any) => acc + r.fineAmount, 0);
    const lateEntries = entryRecords.filter((r: any) => r.delayMinutes > 0).length;
    const avgDelay = lateEntries > 0 ? Math.round(totalLateMinutes / lateEntries) : 0;
    const punctualityRate = Math.round(((entryRecords.length - lateEntries) / entryRecords.length) * 100);
    return { totalLateMinutes, totalFines, avgDelay, punctualityRate };
  }, [entryRecords]);

  // Group fines by staff member for summary sheet
  const staffSummaries = React.useMemo(() => {
    if (entryRecords.length === 0) return [];
    const grouped: Record<string, { name: string; specialty: string; entries: number; lates: number; minutes: number; fines: number }> = {};

    for (const r of entryRecords) {
      const staffId = String(r.staffId);
      const name = String(r.staff?.user?.name || "Sin nombre");
      const specialty = String(r.staff?.specialty || "General");

      if (!grouped[staffId]) {
        grouped[staffId] = { name, specialty, entries: 0, lates: 0, minutes: 0, fines: 0 };
      }

      grouped[staffId].entries += 1;
      if (r.delayMinutes > 0) {
        grouped[staffId].lates += 1;
        grouped[staffId].minutes += r.delayMinutes;
        grouped[staffId].fines += r.fineAmount;
      }
    }

    return Object.values(grouped);
  }, [entryRecords]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0 print:bg-white print:text-black">
      {/* Encabezado (Oculto en Impresión) */}
      <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 5 · Pre-Planilla y Control de Asistencia</h1>
          <p className="text-muted-foreground text-sm">
            Cálculo automático de deducciones de planilla por retraso biométrico, penalidades y porcentaje de puntualidad.
          </p>
        </div>
        <Button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 cursor-pointer"
        >
          <Printer className="size-4" />
          Imprimir Reporte Oficial
        </Button>
      </div>

      {/* Título de Impresión Contable Oficial (Visible solo en Impresión) */}
      <div className="hidden print:flex flex-col items-center text-center gap-2 border-b-2 border-black pb-4 mb-6">
        <h2 className="text-2xl font-black uppercase tracking-wider">Colegio San Agustín</h2>
        <h3 className="text-md font-bold uppercase text-gray-600">Reporte Oficial de Pre-Planilla - Deducciones de Asistencia</h3>
        <p className="text-xs text-gray-500">Generado de forma automatizada por el Terminal Biométrico del Sistema Académico</p>
        <p className="text-xs text-gray-400">Fecha de Emisión: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Tarjetas de Métricas KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80 print:border-black print:shadow-none">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider print:text-black">Retrasos Acumulados</p>
              <h3 className="text-2xl font-bold text-red-500">{metrics.totalLateMinutes} min</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 print:hidden">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80 print:border-black print:shadow-none">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider print:text-black">Total Penalidades</p>
              <h3 className="text-2xl font-bold text-red-500">S/ {metrics.totalFines.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 print:hidden">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80 print:border-black print:shadow-none">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider print:text-black">Tardanza Promedio</p>
              <h3 className="text-2xl font-bold">{metrics.avgDelay} min</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 print:hidden">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80 print:border-black print:shadow-none">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider print:text-black">Tasa de Puntualidad</p>
              <h3 className={`text-2xl font-bold ${metrics.punctualityRate >= 85 ? "text-emerald-500" : "text-amber-500"}`}>
                {metrics.punctualityRate}%
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 print:hidden">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:grid-cols-1 print:gap-4">
        {/* Tabla Izquierda: Reporte Resumido de Planilla */}
        <Card className="lg:col-span-8 bg-card/50 backdrop-blur-sm border-border/80 print:border-black print:shadow-none">
          <CardHeader className="pb-3 border-b border-border/20 print:border-black">
            <CardTitle className="text-md flex items-center gap-2">
              <FileText className="w-5 h-5 print:text-black" />
              Resumen Consolidado de Descuentos
            </CardTitle>
            <CardDescription className="print:hidden">
              Total acumulado de tardanzas, faltas y multas aplicadas por empleado en el mes corriente.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            {loadingLogs ? (
              <div className="p-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                Procesando planilla de asistencia...
              </div>
            ) : staffSummaries.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No hay marcaciones suficientes para estructurar el consolidado contable.
              </div>
            ) : (
              <Table className="print:border-collapse">
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent print:border-black">
                    <TableHead className="font-semibold text-xs print:text-black">Empleado</TableHead>
                    <TableHead className="font-semibold text-xs print:text-black">Marcaciones</TableHead>
                    <TableHead className="font-semibold text-xs print:text-black">Tardanzas</TableHead>
                    <TableHead className="font-semibold text-xs print:text-black">Minutos Retraso</TableHead>
                    <TableHead className="font-semibold text-xs text-right print:text-black">Monto Descuento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffSummaries.map((summary: any, index: number) => (
                    <TableRow key={index} className="border-border/30 hover:bg-muted/30 print:border-black">
                      <TableCell>
                        <div>
                          <p className="text-sm font-bold print:text-black">{summary.name}</p>
                          <p className="text-[10px] text-muted-foreground print:text-gray-500">{summary.specialty}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{summary.entries}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            summary.lates > 0
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20 print:bg-transparent print:text-black print:border-black"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          {summary.lates} tardías
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-semibold">{summary.minutes} min</TableCell>
                      <TableCell className="text-sm font-bold text-right text-red-500 print:text-black">
                        S/ {summary.fines.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Lado Derecho: Bitácora de Auditoría en Vivo */}
        <Card className="lg:col-span-4 bg-card/50 backdrop-blur-sm border-border/80 print:hidden">
          <CardHeader className="pb-3 border-b border-border/20">
            <CardTitle className="text-md flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Historial Operativo
            </CardTitle>
            <CardDescription>
              Detalle cronológico de llegadas del terminal biométrico.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto flex-1 max-h-[420px]">
            {loadingLogs ? (
              <div className="p-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                Cargando logs...
              </div>
            ) : entryRecords.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No hay marcaciones de entradas registradas hoy.
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {entryRecords.map((log: any) => (
                  <div key={log.id} className="p-4 hover:bg-muted/10 transition-colors flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold">{log.staff?.user?.name}</h4>
                        <p className="text-[9px] text-muted-foreground">{log.staff?.specialty}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] ${
                          log.delayMinutes > 0
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        }`}
                      >
                        {log.delayMinutes > 0 ? `LATE +${log.delayMinutes}m` : "ON TIME"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                      <span>{new Date(log.timestamp).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {log.fineAmount > 0 && (
                        <span className="text-red-500 font-extrabold">S/ {log.fineAmount.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Firmas de Autorización de Pre-Planilla (Visible solo en Impresión) */}
      <div className="hidden print:grid grid-cols-2 gap-12 mt-20 pt-10 border-t border-gray-300">
        <div className="flex flex-col items-center">
          <div className="w-48 h-0.5 bg-black mb-2" />
          <p className="text-xs font-bold">Firma del Encargado de RRHH</p>
          <p className="text-[10px] text-gray-500">Control Biométrico de Asistencia</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-48 h-0.5 bg-black mb-2" />
          <p className="text-xs font-bold">Firma de la Dirección Académica</p>
          <p className="text-[10px] text-gray-500">Colegio San Agustín</p>
        </div>
      </div>
    </div>
  );
}
