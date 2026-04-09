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

export default function HorariosPage() {
  const { schedules } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Horarios administrativos</h1>
        <p className="text-muted-foreground text-sm">
          Entrada, salida y tolerancia para docentes y administrativos (Arequipa).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración actual (mock)</CardTitle>
          <CardDescription>Editables en una versión con backend.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Tolerancia (min)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="capitalize">{s.rol}</TableCell>
                  <TableCell>{s.horaEntrada}</TableCell>
                  <TableCell>{s.horaSalida}</TableCell>
                  <TableCell>{s.toleranciaMinutos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
