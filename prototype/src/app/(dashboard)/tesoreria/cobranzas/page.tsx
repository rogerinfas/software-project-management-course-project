"use client";

import * as React from "react";

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
import { interesMora } from "@/lib/mock/rules";
import type { NivelEducativo, PaymentMethod } from "@/lib/mock/types";

const HOY = new Date().toISOString().slice(0, 10);

const ESTADO_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pagado: "default",
  pendiente: "destructive",
  pagado_parcial: "secondary",
  anulado: "outline",
};

export default function CobranzasPage() {
  const {
    students,
    charges,
    generateMassPensionDebt,
    registerWindowPayment,
    treasuryDailyRatePercent,
  } = useDemoData();

  const [studentId, setStudentId] = React.useState(
    students.find((s) => s.codigo)?.id ?? students[0]?.id ?? "",
  );
  const [monto, setMonto] = React.useState(0);
  const [metodo, setMetodo] = React.useState<PaymentMethod>("efectivo");
  const [nivelMasivo, setNivelMasivo] = React.useState<NivelEducativo>("primaria");

  const cargos = charges
    .filter((c) => c.studentId === studentId)
    .sort(
      (a, b) =>
        new Date(a.fechaVencimiento).getTime() -
        new Date(b.fechaVencimiento).getTime(),
    );

  const pendientes = cargos.filter((c) => c.montoPendiente > 0);
  const deuda = pendientes.reduce(
    (a, c) => a + c.montoPendiente + interesMora(c.montoPendiente, c.fechaVencimiento, HOY),
    0,
  );

  const student = students.find((s) => s.id === studentId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">D-2 · Cobranzas</h1>
        <p className="text-muted-foreground text-sm">
          Generación masiva de deuda mensual, estado de cuenta y registro de
          pagos en ventanilla con orden de prelación.
        </p>
      </div>

      <Tabs defaultValue="pagos">
        <TabsList>
          <TabsTrigger value="pagos">Pagos en ventanilla</TabsTrigger>
          <TabsTrigger value="masiva">Generación mensual</TabsTrigger>
        </TabsList>

        <TabsContent value="pagos" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de cuenta</CardTitle>
              <CardDescription>
                Se aplican los pagos a las deudas más antiguas primero (tasa de
                mora: {treasuryDailyRatePercent}%/día).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 md:max-w-md">
                <Label>Alumno</Label>
                <select
                  className="border-input h-8 rounded-lg border px-2 text-sm"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.codigo ?? "pendiente"} — {s.nombres} {s.apellidos}
                    </option>
                  ))}
                </select>
              </div>

              {student ? (
                <>
                  <div className="text-sm">
                    Deuda estimada (capital + mora):{" "}
                    <strong>S/ {deuda.toFixed(2)}</strong>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Concepto</TableHead>
                        <TableHead>Vencimiento</TableHead>
                        <TableHead className="text-right">Original</TableHead>
                        <TableHead className="text-right">Pendiente</TableHead>
                        <TableHead className="text-right">Mora</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cargos.map((c) => {
                        const mora = interesMora(
                          c.montoPendiente,
                          c.fechaVencimiento,
                          HOY,
                        );
                        return (
                          <TableRow key={c.id}>
                            <TableCell>{c.concepto}</TableCell>
                            <TableCell>{c.fechaVencimiento}</TableCell>
                            <TableCell className="text-right tabular-nums">
                              S/ {c.montoOriginal.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              S/ {c.montoPendiente.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              S/ {mora.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={ESTADO_VARIANT[c.status]}>
                                {c.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {cargos.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-muted-foreground text-center text-sm"
                          >
                            Sin cargos registrados para este alumno.
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </>
              ) : null}

              <div className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <div className="grid gap-2">
                  <Label>Monto recibido</Label>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={monto}
                    onChange={(e) => setMonto(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Método</Label>
                  <select
                    className="border-input h-8 rounded-lg border px-2 text-sm"
                    value={metodo}
                    onChange={(e) =>
                      setMetodo(e.target.value as PaymentMethod)
                    }
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
                >
                  Registrar pago
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="masiva" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generación masiva mensual</CardTitle>
              <CardDescription>
                Emite una nueva cuota mensual para todos los alumnos
                matriculados del nivel elegido.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div className="grid gap-2">
                <Label>Nivel</Label>
                <select
                  className="border-input h-8 rounded-lg border px-2 text-sm"
                  value={nivelMasivo}
                  onChange={(e) =>
                    setNivelMasivo(e.target.value as NivelEducativo)
                  }
                >
                  <option value="inicial">Inicial</option>
                  <option value="primaria">Primaria</option>
                </select>
              </div>
              <Button onClick={() => generateMassPensionDebt(nivelMasivo)}>
                Generar cuotas de mayo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
