"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

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
import {
  economicGuardianHasDebt,
  sectionHasCapacity,
  simulateEnrollment,
} from "@/lib/mock/rules";

export default function FormalizacionPage() {
  const { students, sections, guardians, tryEnroll } = useDemoData();

  const pendientes = students.filter((s) => !s.codigo);
  const [studentId, setStudentId] = React.useState(pendientes[0]?.id ?? "");
  const [sectionId, setSectionId] = React.useState("");

  const student = students.find((s) => s.id === studentId);
  const sectionOptions = student
    ? sections.filter((sec) => {
        if (student.codigo) return false;
        const section = sec;
        if (
          student.prospectId === undefined &&
          section.nivel !== sections[0].nivel
        ) {
          // no restriction for purely demo students
        }
        return true;
      })
    : [];

  const selectedSection = sections.find((s) => s.id === sectionId);
  const debt = student
    ? economicGuardianHasDebt(student.id, guardians)
    : false;
  const sim =
    student && selectedSection
      ? simulateEnrollment(selectedSection, debt)
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">B-2 · Formalización de matrícula</h1>
        <p className="text-muted-foreground text-sm">
          Valida aforo y deuda previa antes de asignar sección y emitir documentos.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Candidatos a matrícula</CardTitle>
            <CardDescription>
              Alumnos sin código EST aún pendientes de formalizar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendientes.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay candidatos por formalizar.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Seleccionar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendientes.map((p) => {
                    const gua = guardians.find(
                      (x) => x.studentId === p.id && x.responsableEconomico,
                    );
                    return (
                      <TableRow
                        key={p.id}
                        data-selected={p.id === studentId}
                        className="data-[selected=true]:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {p.nombres} {p.apellidos}
                        </TableCell>
                        <TableCell className="font-mono">{p.dni}</TableCell>
                        <TableCell className="text-xs">
                          {gua ? (
                            <>
                              {gua.nombreCompleto}
                              {gua.deudaAniosAnterioresPendiente ? (
                                <Badge variant="destructive" className="ml-2">
                                  deuda previa
                                </Badge>
                              ) : null}
                            </>
                          ) : (
                            <span className="text-muted-foreground">
                              sin responsable
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="xs"
                            variant={p.id === studentId ? "default" : "outline"}
                            onClick={() => setStudentId(p.id)}
                          >
                            Elegir
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asignar sección</CardTitle>
            <CardDescription>
              La asignación respeta aforo y deuda previa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Label>Sección destino</Label>
              <select
                className="border-input h-8 rounded-lg border px-2 text-sm"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                <option value="">— Seleccionar —</option>
                {sectionOptions.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                    disabled={!sectionHasCapacity(s)}
                  >
                    {s.grado} · {s.seccion} ({s.matriculados}/{s.capacidad})
                    {!sectionHasCapacity(s) ? " — lleno" : ""}
                  </option>
                ))}
              </select>
            </div>

            {sim ? (
              <div
                className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
                  sim.ok
                    ? "border-green-500/40 bg-green-50 dark:bg-green-900/20"
                    : "border-red-500/40 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                {sim.ok ? (
                  <CheckCircle2 className="size-4 text-green-600" />
                ) : (
                  <XCircle className="size-4 text-red-600" />
                )}
                <span>{sim.message}</span>
              </div>
            ) : null}

            <Button
              disabled={!student || !selectedSection || !sim?.ok}
              onClick={() => {
                if (student && selectedSection) {
                  tryEnroll(student.id, selectedSection.id);
                  setSectionId("");
                }
              }}
            >
              Formalizar matrícula
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de vacantes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nivel</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Ocupación</TableHead>
                <TableHead>Disponibilidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="capitalize">{s.nivel}</TableCell>
                  <TableCell>{s.grado}</TableCell>
                  <TableCell>{s.seccion}</TableCell>
                  <TableCell className="tabular-nums">
                    {s.matriculados} / {s.capacidad}
                  </TableCell>
                  <TableCell>
                    {sectionHasCapacity(s) ? (
                      <Badge>Disponible</Badge>
                    ) : (
                      <Badge variant="destructive">Lleno</Badge>
                    )}
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
