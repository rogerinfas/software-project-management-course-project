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

export default function CajaDiariaPage() {
  const { cashbook } = useDemoData();
  const total = cashbook.reduce((a, c) => a + c.monto, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Caja diaria</h1>
        <p className="text-muted-foreground text-sm">
          Ingresos detallados por usuario que cobró y medio de pago (req.txt).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporte del día (demo)</CardTitle>
          <CardDescription>
            Total visibilizado: <strong>S/ {total.toFixed(2)}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Cobrador</TableHead>
                <TableHead>Medio</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashbook.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.hora}</TableCell>
                  <TableCell>{c.cobradorNombre}</TableCell>
                  <TableCell className="capitalize">{c.metodo}</TableCell>
                  <TableCell className="text-sm">{c.concepto}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    S/ {c.monto}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
