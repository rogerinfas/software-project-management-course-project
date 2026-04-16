"use client";

import { Badge } from "@/components/ui/badge";
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

export default function RrhhPage() {
  const { staff } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">E-1 · Gestión de RR.HH.</h1>
        <p className="text-muted-foreground text-sm">
          Registro del personal docente y administrativo, especialidad, horario
          y tolerancia para el control de asistencia.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal registrado</CardTitle>
          <CardDescription>
            {staff.filter((s) => s.rol === "docente").length} docentes ·{" "}
            {staff.filter((s) => s.rol === "administrativo").length} administrativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead className="text-right">Tolerancia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    {s.nombres} {s.apellidos}
                  </TableCell>
                  <TableCell className="font-mono">{s.dni}</TableCell>
                  <TableCell>
                    <Badge
                      variant={s.rol === "docente" ? "default" : "outline"}
                      className="capitalize"
                    >
                      {s.rol}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.especialidad}</TableCell>
                  <TableCell>
                    {s.horaEntrada} – {s.horaSalida}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {s.toleranciaMinutos} min
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
