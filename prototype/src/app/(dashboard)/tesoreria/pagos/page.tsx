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
import { interesMora, ordenPrelacionCharges } from "@/lib/mock/rules";

export default function PagosPage() {
  const {
    students,
    charges,
    vouchers,
    setVoucherStatus,
    registerWindowPayment,
  } = useDemoData();
  const [studentId, setStudentId] = React.useState(
    students.find((s) => s.codigo)?.id ?? students[0]?.id,
  );
  const [monto, setMonto] = React.useState("200");
  const [metodo, setMetodo] = React.useState<"efectivo" | "tarjeta">("efectivo");
  const hoy = new Date().toISOString().slice(0, 10);

  const pendientes = ordenPrelacionCharges(
    charges.filter((c) => c.studentId === studentId),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Registro de pagos</h1>
        <p className="text-muted-foreground text-sm">
          Ventanilla (efectivo/tarjeta) con orden de prelación; vouchers
          pendientes de validación.
        </p>
      </div>

      <Tabs defaultValue="ventanilla">
        <TabsList>
          <TabsTrigger value="ventanilla">Ventanilla</TabsTrigger>
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          <TabsTrigger value="deudas">Deudas del estudiante</TabsTrigger>
        </TabsList>

        <TabsContent value="ventanilla" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cobro en ventanilla</CardTitle>
              <CardDescription>
                El sistema aplica el pago a las deudas más antiguas primero.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-md gap-4">
              <div className="grid gap-2">
                <Label>Estudiante</Label>
                <select
                  className="border-input h-8 rounded-lg border px-2 text-sm"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.codigo ?? "Sin código"} — {s.nombres} {s.apellidos}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Monto (S/)</Label>
                <Input
                  type="number"
                  min={0}
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Medio</Label>
                <select
                  className="border-input h-8 rounded-lg border px-2 text-sm"
                  value={metodo}
                  onChange={(e) =>
                    setMetodo(e.target.value as "efectivo" | "tarjeta")
                  }
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
              <Button
                type="button"
                onClick={() =>
                  registerWindowPayment(studentId, Number(monto), metodo)
                }
              >
                Registrar pago
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vouchers" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vouchers cargados por apoderados</CardTitle>
              <CardDescription>
                Tesorería valida foto/comprobante (flujo demo).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apoderado</TableHead>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Ref.</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>{v.apoderadoNombre}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {v.estudianteCodigo}
                      </TableCell>
                      <TableCell>{v.referencia}</TableCell>
                      <TableCell>S/ {v.monto}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            v.status === "aprobado"
                              ? "default"
                              : v.status === "rechazado"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {v.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        {v.status === "pendiente" ? (
                          <>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => setVoucherStatus(v.id, "aprobado")}
                            >
                              Aprobar
                            </Button>
                            <Button
                              size="xs"
                              variant="destructive"
                              onClick={() => setVoucherStatus(v.id, "rechazado")}
                            >
                              Rechazar
                            </Button>
                          </>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deudas" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Orden de prelación + mora</CardTitle>
              <CardDescription>
                Pendientes ordenados por antigüedad; interés diario después del
                vencimiento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid max-w-md gap-2">
                <Label>Estudiante</Label>
                <select
                  className="border-input h-8 rounded-lg border px-2 text-sm"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombres} {s.apellidos}
                    </option>
                  ))}
                </select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Vence</TableHead>
                    <TableHead>Pendiente</TableHead>
                    <TableHead>Interés mora (demo)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendientes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.concepto}</TableCell>
                      <TableCell>{c.fechaVencimiento}</TableCell>
                      <TableCell>S/ {c.montoPendiente}</TableCell>
                      <TableCell>
                        S/{" "}
                        {interesMora(
                          c.montoPendiente,
                          c.fechaVencimiento,
                          hoy,
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
