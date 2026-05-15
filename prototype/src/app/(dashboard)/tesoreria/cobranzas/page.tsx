"use client";

import * as React from "react";
import { Search, Wallet, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type {
  NivelEducativo,
  PaymentMethod,
} from "@/lib/mock/types";

const ESTADO_VARIANT: Record<string, "outline" | "default" | "secondary"> = {
  pendiente: "outline",
  pagado: "default",
  parcial: "secondary",
};

export default function CobranzasPage() {
  const {
    students,
    charges,
    payments,
    generateMassPensionDebt,
    registerWindowPayment,
  } = useDemoData();

  const [studentId, setStudentId] = React.useState(students[0]?.id ?? "");
  const [monto, setMonto] = React.useState(0);
  const [metodo, setMetodo] = React.useState<PaymentMethod>("efectivo");
  const [nivelMasivo, setNivelMasivo] = React.useState<NivelEducativo>("primaria");

  const currentStudent = students.find((s) => s.id === studentId);
  const studentCharges = charges.filter((c) => c.studentId === studentId);
  const studentPayments = payments.filter((p) => p.studentId === studentId);

  const totalDeuda = studentCharges
    .filter((c) => c.status !== "pagado")
    .reduce((acc, curr) => acc + (curr.montoTotal - curr.montoPagado), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">D-2 · Cobranzas</h1>
          <p className="text-muted-foreground text-sm">
            Gestión de pagos manuales y estados de cuenta por alumno.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-lg border">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Recaudación Mayo</p>
            <p className="text-lg font-mono font-bold text-primary">S/ 42,500.00</p>
          </div>
          <TrendingUp className="size-8 text-primary opacity-20" />
        </div>
      </div>

      <Tabs defaultValue="ventanilla">
        <TabsList>
          <TabsTrigger value="ventanilla">Pago en Ventanilla</TabsTrigger>
          <TabsTrigger value="masiva">Generación Masiva</TabsTrigger>
        </TabsList>

        <TabsContent value="ventanilla" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="size-4 text-primary" />
                  <CardTitle className="text-base">Buscar Alumno</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Seleccionar estudiante</Label>
                  <select
                    className="border-input h-10 rounded-lg border px-3 text-sm"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.apellidos}, {s.nombres} ({s.grado})
                      </option>
                    ))}
                  </select>
                </div>
                {currentStudent && (
                  <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Estado académico:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Matriculado</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Deuda Total:</span>
                      <span className={`text-sm font-bold ${totalDeuda > 0 ? "text-destructive" : "text-green-600"}`}>
                        S/ {totalDeuda.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <Tabs defaultValue="deudas">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <TabsList className="h-8">
                      <TabsTrigger value="deudas" className="text-xs">Deudas y Cargos</TabsTrigger>
                      <TabsTrigger value="historial" className="text-xs">Historial de Pagos</TabsTrigger>
                    </TabsList>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Wallet className="size-4 text-primary" /> Caja
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <TabsContent value="deudas" className="mt-0 space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Concepto</TableHead>
                          <TableHead>Vence</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                          <TableHead className="text-right">Saldo</TableHead>
                          <TableHead className="text-right">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentCharges.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium text-xs">{c.concepto}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{c.fechaVencimiento || "—"}</TableCell>
                            <TableCell className="text-right tabular-nums text-xs">S/ {c.montoTotal.toFixed(2)}</TableCell>
                            <TableCell className="text-right tabular-nums text-xs font-bold">
                              S/ {(c.montoTotal - c.montoPagado).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={ESTADO_VARIANT[c.status]} className="text-[10px] uppercase">
                                {c.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {studentCharges.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground text-xs italic">
                              Sin cargos registrados.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    <div className="grid gap-3 rounded-md border p-4 bg-primary/5 md:grid-cols-[1fr_1fr_auto] md:items-end">
                      <div className="grid gap-2">
                        <Label className="text-xs">Monto recibido</Label>
                        <Input
                          type="number"
                          value={monto}
                          onChange={(e) => setMonto(Number(e.target.value))}
                          className="h-9"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">Método</Label>
                        <select
                          className="border-input h-9 rounded-lg border px-2 text-sm"
                          value={metodo}
                          onChange={(e) => setMetodo(e.target.value as PaymentMethod)}
                        >
                          <option value="efectivo">Efectivo</option>
                          <option value="tarjeta">Tarjeta</option>
                          <option value="transferencia">Transferencia</option>
                        </select>
                      </div>
                      <Button
                        disabled={!studentId || monto <= 0}
                        onClick={() => {
                          registerWindowPayment(studentId, monto, metodo);
                          setMonto(0);
                        }}
                        className="h-9"
                      >
                        Aplicar Pago
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                      <AlertCircle className="size-3" /> Los pagos se aplican automáticamente a las deudas más antiguas (prelación).
                    </p>
                  </TabsContent>

                  <TabsContent value="historial" className="mt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Método</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                          <TableHead className="text-right">Operación</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentPayments.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="text-xs">{new Date(p.fecha).toLocaleDateString()}</TableCell>
                            <TableCell className="capitalize text-xs">{p.metodo}</TableCell>
                            <TableCell className="text-right tabular-nums text-xs font-bold text-green-600">
                              S/ {p.monto.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[10px] text-muted-foreground">
                              #{p.id.split('_')[1] || p.id}
                            </TableCell>
                          </TableRow>
                        ))}
                        {studentPayments.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-xs italic">
                              Aún no hay pagos registrados.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="masiva" className="pt-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                <CardTitle>Emisión masiva de pensiones</CardTitle>
              </div>
              <CardDescription>
                Este proceso genera automáticamente el cargo de pensión para todos los alumnos del nivel seleccionado.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div className="grid gap-2">
                <Label>Nivel Educativo</Label>
                <select
                  className="border-input h-10 rounded-lg border px-3 text-sm bg-background"
                  value={nivelMasivo}
                  onChange={(e) => setNivelMasivo(e.target.value as NivelEducativo)}
                >
                  <option value="inicial">Inicial</option>
                  <option value="primaria">Primaria</option>
                </select>
              </div>
              <Button size="lg" onClick={() => generateMassPensionDebt(nivelMasivo)}>
                Generar cuotas de JUNIO
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
