"use client";

import * as React from "react";
import { Camera } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

  const recientes = facialMarks
    .slice()
    .sort((a, b) => (a.fecha + a.hora < b.fecha + b.hora ? 1 : -1))
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          E-2 · Control de asistencia por reconocimiento facial
        </h1>
        <p className="text-muted-foreground text-sm">
          Simulador de marcado por cámara con nivel de confianza y cálculo de
          tardanzas según el horario del trabajador.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marcar asistencia (simulación)</CardTitle>
          <CardDescription>
            Usa la hora actual del navegador para calcular los minutos de
            tardanza respetando la tolerancia configurada.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-2">
            <Label>Personal</Label>
            <select
              className="border-input h-8 rounded-lg border px-2 text-sm"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombres} {s.apellidos} — {s.rol}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={() => simulateFacialMark(staffId)}
            className="inline-flex items-center gap-2"
          >
            <Camera className="size-4" />
            Marcar entrada ahora
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimas marcaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personal</TableHead>
                <TableHead>Fecha</TableHead>
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
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      {person ? `${person.nombres} ${person.apellidos}` : m.staffId}
                    </TableCell>
                    <TableCell>{m.fecha}</TableCell>
                    <TableCell className="font-mono">{m.hora}</TableCell>
                    <TableCell className="capitalize">{m.tipo}</TableCell>
                    <TableCell>
                      <Badge variant={m.confianza >= 95 ? "default" : "outline"}>
                        {m.confianza}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {m.minutosTardanza > 0
                        ? `${m.minutosTardanza} min`
                        : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
