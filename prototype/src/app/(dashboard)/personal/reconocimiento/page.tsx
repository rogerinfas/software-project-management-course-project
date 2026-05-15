"use client";

import * as React from "react";
import { Camera, Scan, ShieldCheck, History, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";

export default function ReconocimientoPage() {
  const { staff, facialMarks, simulateFacialMark } = useDemoData();
  const [staffId, setStaffId] = React.useState(staff[0]?.id ?? "");
  const [scanning, setScanning] = React.useState(false);
  const [scanResult, setScanResult] = React.useState<boolean | null>(null);

  const recientes = facialMarks
    .slice()
    .sort((a, b) => (a.fecha + a.hora < b.fecha + b.hora ? 1 : -1))
    .slice(0, 20);

  const handleScan = () => {
    setScanning(true);
    setScanResult(null);
    
    // Simulate scanning delay
    setTimeout(() => {
      setScanning(false);
      setScanResult(true);
      simulateFacialMark(staffId);
      
      setTimeout(() => {
        setScanResult(null);
      }, 3000);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          E-2 · Control de asistencia por reconocimiento facial
        </h1>
        <p className="text-muted-foreground text-sm">
          Interfaz de marcado biométrico (simulación). Detecta rostro y calcula tardanza.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 overflow-hidden border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center gap-2">
              <Camera className="size-4 text-primary" />
              <CardTitle className="text-base">Terminal de Marcado</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Colaborador en frente</Label>
                <select
                  className="border-input h-11 rounded-xl border px-3 text-sm bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.apellidos}, {s.nombres} ({s.rol})
                    </option>
                  ))}
                </select>
              </div>

              {/* MOCK CAMERA VIEW */}
              <div className="relative aspect-video rounded-2xl bg-black overflow-hidden flex items-center justify-center border-4 border-muted">
                {scanning && (
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute inset-x-4 top-0 h-1 bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_infinite_ease-in-out]" />
                    <div className="absolute inset-0 bg-primary/5" />
                  </div>
                )}
                
                {scanResult ? (
                  <div className="z-20 flex flex-col items-center animate-in zoom-in duration-300">
                    <div className="size-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
                      <ShieldCheck className="size-12 text-white" />
                    </div>
                    <p className="text-white font-bold mt-4 text-lg">IDENTIFICADO</p>
                    <p className="text-green-400 text-xs font-mono">Confianza: 98.4%</p>
                  </div>
                ) : scanning ? (
                  <div className="z-20 text-center">
                    <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-xs font-bold tracking-widest uppercase">Escaneando...</p>
                  </div>
                ) : (
                  <div className="text-center opacity-40 group hover:opacity-100 transition-opacity">
                    <User className="size-24 text-white mx-auto mb-2" />
                    <p className="text-white text-[10px] font-bold tracking-tighter uppercase">Esperando detección</p>
                  </div>
                )}

                {/* OVERLAYS */}
                <div className="absolute top-4 right-4 text-[10px] font-mono text-white/50 space-y-1">
                   <p>FPS: 30</p>
                   <p>RESOL: 1080p</p>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                   <div className="size-2 bg-red-600 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold text-white uppercase tracking-widest">REC LIVE</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleScan}
                disabled={scanning}
                className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 gap-2"
              >
                <Scan className="size-5" />
                Procesar Identificación
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="size-4 text-primary" />
                <CardTitle className="text-base">Últimas Marcaciones</CardTitle>
              </div>
              <Badge variant="outline">Hoy: {new Date().toLocaleDateString()}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Personal</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Confianza</TableHead>
                  <TableHead className="text-right">Tardanza</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recientes.map((m) => {
                  const person = staff.find((s) => s.id === m.staffId);
                  return (
                    <TableRow key={m.id} className="h-12">
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                            {person?.nombres[0]}{person?.apellidos[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-none">{person?.nombres} {person?.apellidos}</p>
                            <p className="text-[10px] text-muted-foreground">{person?.rol}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold">{m.hora}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[9px] h-4 uppercase ${m.tipo === 'entrada' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-orange-600 border-orange-200 bg-orange-50'}`}>
                          {m.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <div className="h-1 w-10 bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-green-500" style={{ width: `${m.confianza}%` }} />
                           </div>
                           <span className="text-[10px] font-mono">{m.confianza}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-xs font-bold">
                        {m.minutosTardanza > 0 ? (
                          <span className="text-destructive">{m.minutosTardanza} min</span>
                        ) : (
                          <span className="text-green-600">Puntual</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  );
}
