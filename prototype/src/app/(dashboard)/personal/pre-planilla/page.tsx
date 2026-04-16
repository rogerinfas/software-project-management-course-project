"use client";

import { Calculator } from "lucide-react";

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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";

export default function PrePlanillaPage() {
  const { prePayroll, recomputePrePayroll } = useDemoData();

  const totales = prePayroll.reduce(
    (acc, r) => {
      acc.sueldoBase += r.sueldoBase;
      acc.descuento += r.descuentoMulta;
      acc.neto += r.neto;
      return acc;
    },
    { sueldoBase: 0, descuento: 0, neto: 0 },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            E-4 · Reporte de pre-planilla
          </h1>
          <p className="text-muted-foreground text-sm">
            Consolidado mensual con tardanzas y descuentos aplicados por el
            motor de reglas. Esta pre-planilla <strong>no</strong> genera
            transferencias bancarias.
          </p>
        </div>
        <Button
          onClick={recomputePrePayroll}
          className="inline-flex items-center gap-2"
        >
          <Calculator className="size-4" />
          Recalcular con reglas vigentes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pre-planilla del periodo</CardTitle>
          <CardDescription>
            El descuento por multa se calcula a partir de las marcaciones
            faciales y las reglas activas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personal</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Días lab.</TableHead>
                <TableHead className="text-right">Hrs. efec.</TableHead>
                <TableHead className="text-right">Tardanza</TableHead>
                <TableHead className="text-right">Descuento</TableHead>
                <TableHead className="text-right">Sueldo base</TableHead>
                <TableHead className="text-right">Neto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prePayroll.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.staffNombre}</TableCell>
                  <TableCell>
                    <Badge
                      variant={r.rol === "docente" ? "default" : "outline"}
                      className="capitalize"
                    >
                      {r.rol}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.diasLaborados}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.horasEfectivas}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.minutosTardanza} min
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    S/ {r.descuentoMulta.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    S/ {r.sueldoBase.toLocaleString("es-PE")}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    S/ {r.neto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="font-semibold">
                  Totales
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  S/ {totales.descuento.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  S/ {totales.sueldoBase.toLocaleString("es-PE")}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  S/ {totales.neto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
