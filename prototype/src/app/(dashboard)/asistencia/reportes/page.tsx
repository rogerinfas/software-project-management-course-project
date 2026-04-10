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

export default function AsistenciaReportesPage() {
  const { tardiness } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tardanzas y faltas</h1>
        <p className="text-muted-foreground text-sm">
          Reporte mensual para planilla: horas efectivas trabajadas (datos demo).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen mensual</CardTitle>
          <CardDescription>Abril 2026 — prototipo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personal</TableHead>
                <TableHead className="text-right">Días tardanza</TableHead>
                <TableHead className="text-right">Faltas</TableHead>
                <TableHead className="text-right">Horas efectivas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tardiness.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.personalNombre}</TableCell>
                  <TableCell className="text-right">{t.diasTardanza}</TableCell>
                  <TableCell className="text-right">{t.faltas}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {t.horasEfectivas} h
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
