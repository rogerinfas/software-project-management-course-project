"use client";

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

export default function TarifarioPage() {
  const { tariffConcepts, discounts, treasuryDailyRatePercent } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tarifario y descuentos</h1>
        <p className="text-muted-foreground text-sm">
          Conceptos (matrícula, cuota ingreso, pensiones Mar–Dic), becas y
          descuentos. Tasa de interés diario por mora (config demo):{" "}
          <strong>{treasuryDailyRatePercent}%</strong>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conceptos de cobro</CardTitle>
          <CardDescription>Definición base para generación de deudas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead className="text-right">Monto (S/)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tariffConcepts.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.nombre}</TableCell>
                  <TableCell>{t.tipo === "mensual" ? "Mensual" : "Único"}</TableCell>
                  <TableCell className="max-w-xs text-xs text-muted-foreground">
                    {t.meses?.join(", ") ?? "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {t.montoBase}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Becas y descuentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Aplica a</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.nombre}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {d.aplicaA}
                  </TableCell>
                  <TableCell className="text-right">{d.porcentaje}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
