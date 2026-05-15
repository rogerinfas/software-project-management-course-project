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
  const selectedSection = sections.find((s) => s.id === sectionId);
  const debt = student ? economicGuardianHasDebt(student.id, guardians) : false;
  const sim =
    student && selectedSection
      ? simulateEnrollment(selectedSection, debt)
      : null;

  // Group sections by nivel for clearer selection
  const niveles = Array.from(new Set(sections.map((s) => s.nivel)));

  function ocupPct(s: (typeof sections)[0]) {
    return Math.round((s.matriculados / s.capacidad) * 100);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">B-3 · Formalización de Matrícula</h1>
        <p className="text-muted-foreground text-sm">
          Valida vacantes y deuda previa antes de asignar{" "}
          <strong>Grado · Nivel · Sección</strong> y formalizar la matrícula.
        </p>
      </div>

      {/* Vacantes por nivel — visual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estado de vacantes por sección</CardTitle>
          <CardDescription>
            Verde: disponible · Amarillo: &gt;80% ocupado · Rojo: lleno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {niveles.map((nivel) => (
              <div key={nivel}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground capitalize">
                  {nivel}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sections
                    .filter((s) => s.nivel === nivel)
                    .map((s) => {
                      const pct = ocupPct(s);
                      const color =
                        !sectionHasCapacity(s)
                          ? "bg-red-500"
                          : pct >= 80
                          ? "bg-yellow-400"
                          : "bg-green-500";
                      return (
                        <div
                          key={s.id}
                          className={`rounded-lg border p-3 ${
                            sectionId === s.id ? "ring-2 ring-primary" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              {s.grado} · {s.seccion}
                            </span>
                            {sectionHasCapacity(s) ? (
                              <Badge className="text-[10px]">Disponible</Badge>
                            ) : (
                              <Badge variant="destructive" className="text-[10px]">Lleno</Badge>
                            )}
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${color}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <p className="text-muted-foreground text-xs mt-1 tabular-nums">
                            {s.matriculados} / {s.capacidad} ({pct}%)
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formalización */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Candidatos a matrícula</CardTitle>
            <CardDescription>
              Alumnos sin código EST pendientes de formalizar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendientes.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Todos los alumnos ya están matriculados.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Responsable económico</TableHead>
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
                        <TableCell className="font-mono text-xs">{p.dni}</TableCell>
                        <TableCell className="text-xs">
                          {gua ? (
                            <>
                              {gua.nombreCompleto}
                              {gua.deudaAniosAnterioresPendiente && (
                                <Badge variant="destructive" className="ml-2">
                                  deuda previa
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground">sin responsable</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="xs"
                            variant={p.id === studentId ? "default" : "outline"}
                            onClick={() => { setStudentId(p.id); setSectionId(""); }}
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
              Selecciona Nivel → Grado → Sección. El sistema verifica aforo y deuda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!student ? (
              <p className="text-muted-foreground text-sm">Elige un alumno de la tabla.</p>
            ) : (
              <>
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  <p className="font-medium">{student.nombres} {student.apellidos}</p>
                  <p className="text-muted-foreground text-xs">DNI: {student.dni}</p>
                  {debt && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      ⚠ Responsable económico tiene deuda previa
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Sección destino</Label>
                  <select
                    className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                  >
                    <option value="">— Seleccionar —</option>
                    {niveles.map((nivel) => (
                      <optgroup key={nivel} label={nivel.charAt(0).toUpperCase() + nivel.slice(1)}>
                        {sections
                          .filter((s) => s.nivel === nivel)
                          .map((s) => (
                            <option
                              key={s.id}
                              value={s.id}
                              disabled={!sectionHasCapacity(s)}
                            >
                              {s.grado} · Sección {s.seccion} ({s.matriculados}/{s.capacidad})
                              {!sectionHasCapacity(s) ? " — LLENO" : ""}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {sim && (
                  <div
                    className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
                      sim.ok
                        ? "border-green-500/40 bg-green-50 dark:bg-green-900/20"
                        : "border-red-500/40 bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    {sim.ok ? (
                      <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span>{sim.message}</span>
                  </div>
                )}

                <Button
                  className="w-full"
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
