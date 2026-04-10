"use client";

import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoData } from "@/context/demo-data-context";

export default function AlumnosPage() {
  const { students, sections, updateStudentDni } = useDemoData();
  const [selectedId, setSelectedId] = React.useState(students[0]?.id ?? "");
  const student = students.find((s) => s.id === selectedId);
  const [dniEdit, setDniEdit] = React.useState(student?.personal.dni ?? "");

  React.useEffect(() => {
    if (student) setDniEdit(student.personal.dni);
  }, [student]);

  if (!student) {
    return <p className="text-muted-foreground text-sm">No hay alumnos en el mock.</p>;
  }

  const section = sections.find((s) => s.id === student.sectionId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ficha digital del alumno</h1>
        <p className="text-muted-foreground text-sm">
          Datos personales (DNI 8 dígitos), salud y procedencia.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {students.map((s) => (
          <Button
            key={s.id}
            variant={s.id === selectedId ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedId(s.id)}
          >
            {s.nombres} {s.apellidos}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {student.nombres} {student.apellidos}
          </CardTitle>
          <CardDescription>
            Código: {student.codigo ?? "Pendiente de matrícula"} — Aula:{" "}
            {section
              ? `${section.grado} ${section.seccion}`
              : "Sin asignar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">Personales</TabsTrigger>
              <TabsTrigger value="salud">Salud</TabsTrigger>
              <TabsTrigger value="procedencia">Procedencia</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-4 pt-4">
              <div className="grid max-w-md gap-2">
                <Label htmlFor="dni">DNI (validación de formato)</Label>
                <div className="flex gap-2">
                  <Input
                    id="dni"
                    value={dniEdit}
                    onChange={(e) => setDniEdit(e.target.value)}
                    maxLength={8}
                    className="max-w-xs font-mono"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => updateStudentDni(student.id, dniEdit)}
                  >
                    Validar y guardar
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  Debe constar de exactamente 8 dígitos (req.txt).
                </p>
              </div>
              <div className="grid max-w-md gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Fecha de nacimiento</Label>
                  <Input readOnly value={student.personal.fechaNacimiento} />
                </div>
                <div className="grid gap-2">
                  <Label>Sexo</Label>
                  <Input readOnly value={student.personal.sexo === "M" ? "Masculino" : "Femenino"} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="salud" className="space-y-4 pt-4">
              <div className="grid max-w-lg gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Grupo sanguíneo</Label>
                  <Input readOnly value={student.salud.grupoSanguineo} />
                </div>
                <div className="grid gap-2">
                  <Label>Seguro médico</Label>
                  <Input readOnly value={student.salud.seguroMedico} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Alergias</Label>
                  <Input readOnly value={student.salud.alergias} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="procedencia" className="space-y-4 pt-4">
              <div className="grid max-w-lg gap-2">
                <Label>Colegio anterior</Label>
                <Input readOnly value={student.procedencia.colegioAnterior} />
              </div>
              <div className="grid max-w-md gap-2">
                <Label>Código modular</Label>
                <Input readOnly value={student.procedencia.codigoModular} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Documentos de matrícula</AlertTitle>
        <AlertDescription>
          {student.documentosMatricula.length === 0
            ? "Aún no hay documentos cargados (DNI, compromiso de honor, contrato)."
            : student.documentosMatricula.join(", ")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
