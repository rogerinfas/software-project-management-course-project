"use client";

import * as React from "react";

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

export default function MorosidadPage() {
  const { morosity, students } = useDemoData();
  const [grado, setGrado] = React.useState("");
  const [seccion, setSeccion] = React.useState("");

  const filtrado = morosity.filter((r) => {
    const g = !grado || r.grado.includes(grado);
    const s = !seccion || r.seccion.toLowerCase() === seccion.toLowerCase();
    return g && s;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reporte de morosidad</h1>
        <p className="text-muted-foreground text-sm">
          Padres deudores con filtros por grado y sección (req.txt).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Datos de demostración — {students.length} estudiantes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="grid gap-1">
            <span className="text-xs font-medium">Grado (contiene)</span>
            <input
              className="border-input h-8 rounded-lg border px-2 text-sm"
              placeholder="ej. primaria"
              value={grado}
              onChange={(e) => setGrado(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <span className="text-xs font-medium">Sección</span>
            <input
              className="border-input h-8 w-20 rounded-lg border px-2 text-sm"
              placeholder="A"
              value={seccion}
              onChange={(e) => setSeccion(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Apoderado</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Sec.</TableHead>
                <TableHead className="text-right">Meses</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrado.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.apoderado}</TableCell>
                  <TableCell>{r.estudiante}</TableCell>
                  <TableCell>{r.grado}</TableCell>
                  <TableCell>{r.seccion}</TableCell>
                  <TableCell className="text-right">{r.mesesAdeudados}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    S/ {r.montoTotal}
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
