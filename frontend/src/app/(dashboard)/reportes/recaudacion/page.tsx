"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";

export default function RecaudacionPage() {
  const { collection } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reporte de recaudación</h1>
        <p className="text-muted-foreground text-sm">
          Proyectado (total pensiones) vs recaudado mensualmente (req.txt).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparativa mensual</CardTitle>
          <CardDescription>Cifras ilustrativas en soles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead className="text-right">Proyectado</TableHead>
                <TableHead className="text-right">Recaudado</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collection.map((c) => {
                const pct =
                  c.proyectado > 0
                    ? Math.round((c.recaudado / c.proyectado) * 100)
                    : 0;
                return (
                  <TableRow key={c.mes}>
                    <TableCell>{c.mes}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      S/ {c.proyectado.toLocaleString("es-PE")}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      S/ {c.recaudado.toLocaleString("es-PE")}
                    </TableCell>
                    <TableCell className="text-right">{pct}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {collection.map((c) => {
            const pct =
              c.proyectado > 0
                ? Math.round((c.recaudado / c.proyectado) * 100)
                : 0;
            return (
              <div key={c.mes} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{c.mes}</span>
                  <span>{pct}% recaudado</span>
                </div>
                <Progress value={pct} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
