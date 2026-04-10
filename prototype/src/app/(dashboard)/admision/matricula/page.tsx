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
import { sectionHasCapacity } from "@/lib/mock/rules";

export default function MatriculaPage() {
  const { students, sections, tryEnroll } = useDemoData();
  const sinCodigo = students.filter((s) => !s.codigo);
  const [studentId, setStudentId] = React.useState(sinCodigo[0]?.id ?? "");
  const [sectionId, setSectionId] = React.useState(sections[0]?.id ?? "");

  const section = sections.find((s) => s.id === sectionId);
  const pct = section
    ? Math.min(100, Math.round((section.matriculados / section.capacidad) * 100))
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Proceso de matrícula</h1>
        <p className="text-muted-foreground text-sm">
          Asignación de código, grado/sección con control de aforo y lista de
          documentos (demo).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Selección</CardTitle>
            <CardDescription>
              Pruebe la sección &quot;3° primaria A&quot; llena (25/25) o alumnos
              con responsable con deuda (Mateo Condori).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <span className="text-sm font-medium">Alumno sin código</span>
              <select
                className="border-input h-8 w-full rounded-lg border px-2 text-sm"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              >
                {sinCodigo.length === 0 ? (
                  <option value="">Todos tienen código (reinicia demo)</option>
                ) : null}
                {sinCodigo.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombres} {s.apellidos} — DNI {s.personal.dni}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Grado y sección</span>
              <select
                className="border-input h-8 w-full rounded-lg border px-2 text-sm"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.grado} {s.seccion} — {s.matriculados}/{s.capacidad}{" "}
                    {!sectionHasCapacity(s) ? "(lleno)" : ""}
                  </option>
                ))}
              </select>
            </div>
            {section ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Aforo</span>
                  <span>
                    {section.matriculados} / {section.capacidad}
                  </span>
                </div>
                <Progress value={pct} />
                {!sectionHasCapacity(section) ? (
                  <Badge variant="destructive">Sin cupo</Badge>
                ) : (
                  <Badge variant="secondary">Hay cupo</Badge>
                )}
              </div>
            ) : null}
            <Button
              type="button"
              disabled={!studentId}
              onClick={() => tryEnroll(studentId, sectionId)}
            >
              Confirmar matrícula (simulación)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos escaneados</CardTitle>
            <CardDescription>
              DNI, compromiso de honor, contrato de servicios (lista mock tras
              matrícula).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archivo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  "dni_estudiante.pdf",
                  "compromiso_honor.pdf",
                  "contrato_servicios.pdf",
                ].map((f) => (
                  <TableRow key={f}>
                    <TableCell className="font-mono text-xs">{f}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Verificado (demo)</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
