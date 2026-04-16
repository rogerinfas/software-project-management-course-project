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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoData } from "@/context/demo-data-context";

export default function ExpedientePage() {
  const {
    students,
    guardians,
    sections,
    updateStudentDni,
    setGuardianResponsible,
  } = useDemoData();

  const [studentId, setStudentId] = React.useState(students[0]?.id ?? "");
  const [dni, setDni] = React.useState("");

  const student = students.find((s) => s.id === studentId);
  const section = student?.sectionId
    ? sections.find((x) => x.id === student.sectionId)
    : null;
  const familyGuardians = guardians.filter((g) => g.studentId === studentId);
  const hermanos = student
    ? students.filter((s) => student.hermanosIds.includes(s.id))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">B-1 · Expediente familiar</h1>
        <p className="text-muted-foreground text-sm">
          Maestro del alumno: datos de contacto, apoderados, hermanos y salud.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar alumno</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:max-w-md">
          <Label>Alumno</Label>
          <select
            className="border-input h-8 rounded-lg border px-2 text-sm"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.codigo ?? "Sin código"} — {s.nombres} {s.apellidos}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {student ? (
        <Tabs defaultValue="datos">
          <TabsList>
            <TabsTrigger value="datos">Datos del alumno</TabsTrigger>
            <TabsTrigger value="apoderados">Apoderados</TabsTrigger>
            <TabsTrigger value="hermanos">Hermanos</TabsTrigger>
            <TabsTrigger value="salud">Datos médicos</TabsTrigger>
          </TabsList>

          <TabsContent value="datos" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{student.nombres} {student.apellidos}</CardTitle>
                <CardDescription>
                  {student.codigo ? (
                    <>Código <code className="font-mono">{student.codigo}</code></>
                  ) : (
                    "Aún es postulante — no tiene código de alumno."
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">DNI:</span>{" "}
                  <span className="font-mono">{student.dni}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fecha de nacimiento:</span>{" "}
                  {student.fechaNacimiento}
                </div>
                <div>
                  <span className="text-muted-foreground">Sexo:</span>{" "}
                  {student.sexo === "F" ? "Femenino" : "Masculino"}
                </div>
                <div>
                  <span className="text-muted-foreground">Sección:</span>{" "}
                  {section ? `${section.grado} · ${section.seccion}` : "No matriculado"}
                </div>
                <div className="md:col-span-2 mt-2">
                  <Label>Actualizar DNI (valida 8 dígitos)</Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      placeholder={student.dni}
                      className="max-w-xs font-mono"
                    />
                    <Button
                      onClick={() => {
                        if (updateStudentDni(student.id, dni)) setDni("");
                      }}
                    >
                      Actualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apoderados" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Apoderados</CardTitle>
                <CardDescription>
                  Uno debe ser el <strong>responsable económico</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Parentesco</TableHead>
                      <TableHead>DNI</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Ocupación</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {familyGuardians.map((g) => (
                      <TableRow key={g.id}>
                        <TableCell className="font-medium">{g.nombreCompleto}</TableCell>
                        <TableCell>{g.parentesco}</TableCell>
                        <TableCell className="font-mono">{g.dni}</TableCell>
                        <TableCell className="text-xs">
                          {g.telefono}
                          <br />
                          <span className="text-muted-foreground">{g.correo}</span>
                        </TableCell>
                        <TableCell>{g.ocupacion}</TableCell>
                        <TableCell>
                          {g.responsableEconomico ? (
                            <Badge>
                              {g.deudaAniosAnterioresPendiente
                                ? "Sí (con deuda)"
                                : "Sí"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!g.responsableEconomico ? (
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => setGuardianResponsible(g.id)}
                            >
                              Marcar responsable
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hermanos" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Hermanos en la institución</CardTitle>
              </CardHeader>
              <CardContent>
                {hermanos.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Este alumno no tiene hermanos registrados.
                  </p>
                ) : (
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {hermanos.map((h) => (
                      <li key={h.id}>
                        {h.nombres} {h.apellidos} — {h.codigo ?? "sin código"}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salud" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Ficha de salud</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Grupo sanguíneo:</span>{" "}
                  {student.salud.grupoSanguineo}
                </div>
                <div>
                  <span className="text-muted-foreground">Seguro médico:</span>{" "}
                  {student.salud.seguroMedico}
                </div>
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Alergias:</span>{" "}
                  {student.salud.alergias}
                </div>
                {student.salud.condicionesEspeciales ? (
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">
                      Condiciones especiales:
                    </span>{" "}
                    {student.salud.condicionesEspeciales}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}
