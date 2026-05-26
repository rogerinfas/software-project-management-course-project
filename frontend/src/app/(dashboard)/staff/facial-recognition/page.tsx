"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Scan, Fingerprint, Clock, AlertTriangle, CheckCircle, ShieldAlert, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { backend } from "@/lib/api/types/backend";

export default function FacialRecognitionPage() {
  const queryClient = useQueryClient();

  // Simulated Terminal State
  const [selectedStaffId, setSelectedStaffId] = React.useState<string>("");
  const [attendanceType, setAttendanceType] = React.useState<"entry" | "exit">("entry");
  const [scanning, setScanning] = React.useState(false);
  const [scanResult, setScanResult] = React.useState<any | null>(null);

  // Queries
  const { data: staffProfiles, isLoading: loadingStaff } = backend.useQuery(
    "get",
    "/api/staff/profiles",
    { params: { query: {} as any } }
  );

  const { data: attendanceLogs, isLoading: loadingLogs } = backend.useQuery(
    "get",
    "/api/staff/attendance",
    { params: { query: {} as any } }
  );

  // Mutation
  const registerMutation = backend.useMutation("post", "/api/staff/attendance", {
    onSuccess: (data: any) => {
      setScanResult(data);
      toast.success("Asistencia registrada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/staff/attendance"] });
      // Clear scanning state after a short delay
      setTimeout(() => {
        setScanning(false);
      }, 1000);
    },
    onError: (err: any) => {
      setScanning(false);
      toast.error(err?.message || "Error al procesar el reconocimiento facial");
    },
  });

  const handleStartScan = () => {
    if (!selectedStaffId) {
      toast.error("Por favor, seleccione un empleado para simular el escaneo.");
      return;
    }
    setScanning(true);
    setScanResult(null);

    // Simulate biometric matching delay of 2 seconds
    setTimeout(() => {
      registerMutation.mutate({
        body: {
          staffId: selectedStaffId,
          type: attendanceType,
          method: "FACIAL",
          timestamp: new Date().toISOString(),
        },
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 5 · Reconocimiento Facial (Simulador)</h1>
          <p className="text-muted-foreground text-sm">
            Terminal biométrico virtual para simular marcaciones de entrada y salida mediante escaneo facial.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Izquierdo: Simulador de Cámara Biométrica */}
        <Card className="lg:col-span-7 bg-card/50 backdrop-blur-sm border-border/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 animate-pulse" />
              Visor Óptico en Vivo
            </CardTitle>
            <CardDescription>
              Escáner simulado en tiempo real con superposición de malla facial y radar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-6 pb-6">
            {/* Cámara de Simulación */}
            <div className="relative w-full aspect-[4/3] max-w-lg mx-auto bg-black rounded-2xl overflow-hidden border-2 border-primary/20 flex items-center justify-center group shadow-2xl">
              {/* Radar Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.08)_0%,transparent_75%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Scanline Animation */}
              {scanning && (
                <div className="absolute left-0 w-full h-1 bg-primary/60 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-[bounce_2s_infinite] z-20" />
              )}

              {/* Camera Frame Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-md group-hover:scale-105 transition-transform" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-md group-hover:scale-105 transition-transform" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-md group-hover:scale-105 transition-transform" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-md group-hover:scale-105 transition-transform" />

              {scanning ? (
                <div className="z-10 flex flex-col items-center gap-4 text-center">
                  <Scan className="w-16 h-16 text-primary animate-spin" />
                  <div className="space-y-1">
                    <p className="text-primary font-bold tracking-widest text-lg animate-pulse uppercase">
                      Analizando Rostro...
                    </p>
                    <p className="text-xs text-muted-foreground/80">Alineando con malla biométrica 3D</p>
                  </div>
                </div>
              ) : scanResult ? (
                <div className="z-10 flex flex-col items-center gap-4 text-center px-6">
                  {scanResult.delayMinutes > 0 ? (
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 animate-bounce">
                      <ShieldAlert className="w-9 h-9" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 animate-bounce">
                      <CheckCircle className="w-9 h-9" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">
                      {scanResult.staff?.user?.name || "Personal Registrado"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {scanResult.staff?.specialty}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {scanResult.type === "entry" ? "Entrada" : "Salida"}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Facial Match 99.8%
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="z-10 flex flex-col items-center gap-3 text-center opacity-40 group-hover:opacity-60 transition-opacity">
                  <Fingerprint className="w-16 h-16 text-primary" />
                  <p className="text-sm font-semibold tracking-wide">Cámara en Espera</p>
                </div>
              )}
            </div>

            {/* Configuración de Escaneo */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Seleccionar Empleado (Simulado)
                  </label>
                  <Select value={selectedStaffId} onValueChange={(val) => setSelectedStaffId(val || "")} disabled={scanning}>
                    <SelectTrigger className="bg-background/50 border-border/40">
                      <SelectValue placeholder="Seleccione personal..." />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingStaff ? (
                        <SelectItem value="loading" disabled>
                          Cargando personal...
                        </SelectItem>
                      ) : (
                        staffProfiles?.map((staff: any) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.user?.name} ({staff.specialty})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tipo de Marcación
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={attendanceType === "entry" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setAttendanceType("entry")}
                      disabled={scanning}
                    >
                      Entrada
                    </Button>
                    <Button
                      type="button"
                      variant={attendanceType === "exit" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setAttendanceType("exit")}
                      disabled={scanning}
                    >
                      Salida
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                className="w-full cursor-pointer"
                onClick={handleStartScan}
                disabled={scanning || !selectedStaffId}
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando Rostro...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5" />
                    Iniciar Escaneo Biométrico
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lado Derecho: Resultados Contables e Historial Rápido */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Resultados de Penalidades */}
          {scanResult && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/80">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-md flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Cálculo de Tardanzas y Penalidad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-border/20">
                  <span className="text-sm text-muted-foreground">Estado del Registro</span>
                  {scanResult.delayMinutes > 0 ? (
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">
                      TARDANZA
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                      A TIEMPO
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/20">
                  <span className="text-sm text-muted-foreground">Hora Registrada</span>
                  <span className="font-semibold text-sm">
                    {new Date(scanResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/20">
                  <span className="text-sm text-muted-foreground">Minutos de Tardanza</span>
                  <span className={`font-bold text-sm ${scanResult.delayMinutes > 0 ? "text-red-500" : "text-emerald-500"}`}>
                    {scanResult.delayMinutes} min
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">Multa Aplicada</span>
                  <span className={`text-lg font-bold ${scanResult.fineAmount > 0 ? "text-red-500" : "text-emerald-500"}`}>
                    S/ {scanResult.fineAmount.toFixed(2)}
                  </span>
                </div>

                {scanResult.delayMinutes > 0 && (
                  <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 flex gap-2 items-start mt-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      El empleado superó su periodo de tolerancia de <strong>{scanResult.staff?.gracePeriod} minutos</strong>. Se aplicó una multa contable calculada por minuto.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Feed de Actividad de Asistencia */}
          <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/80">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-md flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Marcaciones Recientes
              </CardTitle>
              <CardDescription>
                Registro en vivo del terminal biométrico escolar.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto max-h-[350px]">
              {loadingLogs ? (
                <div className="p-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  Cargando logs biométricos...
                </div>
              ) : attendanceLogs?.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No hay marcaciones biométricas registradas hoy.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30 hover:bg-transparent">
                      <TableHead className="text-xs py-2">Empleado</TableHead>
                      <TableHead className="text-xs py-2">Tipo</TableHead>
                      <TableHead className="text-xs py-2">Hora</TableHead>
                      <TableHead className="text-xs py-2 text-right">Multa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceLogs?.slice(0, 10).map((log: any) => (
                      <TableRow key={log.id} className="border-border/30 hover:bg-muted/30">
                        <TableCell className="py-2 text-xs font-semibold">
                          <div>
                            <p>{log.staff?.user?.name}</p>
                            <p className="text-[9px] text-muted-foreground font-normal">{log.staff?.specialty}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-xs">
                          <Badge
                            variant="secondary"
                            className={`text-[9px] px-1.5 py-0.5 ${
                              log.type === "entry"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            }`}
                          >
                            {log.type === "entry" ? "Entrada" : "Salida"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-[10px] text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell className={`py-2 text-xs font-bold text-right ${log.fineAmount > 0 ? "text-red-500" : "text-emerald-500"}`}>
                          {log.fineAmount > 0 ? `S/ ${log.fineAmount.toFixed(2)}` : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
