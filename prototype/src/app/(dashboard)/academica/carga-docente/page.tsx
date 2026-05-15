"use client";

import * as React from "react";
import { UserPlus, Search, GraduationCap } from "lucide-react";

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
import { useDemoData } from "@/context/demo-data-context";

export default function CargaDocentePage() {
  const { courses, teachingAssignments, staff, sections, assignTeacher } =
    useDemoData();

  const [filtro, setFiltro] = React.useState("");
  const teachers = staff.filter((s) => s.rol === "docente");

  // State for assignment form
  const [courseId, setCourseId] = React.useState("");
  const [sectionId, setSectionId] = React.useState("");
  const [teacherId, setTeacherId] = React.useState("");

  const filteredAssignments = teachingAssignments.filter((ta) => {
    const curso = courses.find((c) => c.id === ta.courseId);
    const docente = staff.find((s) => s.id === ta.teacherId);
    const searchStr = `${curso?.nombre} ${docente?.nombres} ${docente?.apellidos}`.toLowerCase();
    return searchStr.includes(filtro.toLowerCase());
  });

  const handleAssign = () => {
    if (!courseId || !sectionId || !teacherId) return;
    assignTeacher({ courseId, sectionId, teacherId });
    // Reset form partially
    setTeacherId("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">C-3 · Carga docente</h1>
        <p className="text-muted-foreground text-sm">
          Asignación de cursos y secciones a cada profesor del plantel.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Formulario de Asignación */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              <CardTitle className="text-base">Nueva asignación</CardTitle>
            </div>
            <CardDescription>Vincula un docente a un curso y sección.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Curso</Label>
              <select
                className="border-input h-9 rounded-lg border px-2 text-sm"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">— Seleccionar curso —</option>
                {courses
                  .sort((a, b) => a.grado.localeCompare(b.grado))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.grado}] {c.nombre}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Sección</Label>
              <select
                className="border-input h-9 rounded-lg border px-2 text-sm"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                <option value="">— Seleccionar sección —</option>
                {sections
                  .filter((s) => {
                    const curso = courses.find((c) => c.id === courseId);
                    return !curso || s.grado === curso.grado;
                  })
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.grado} · {s.seccion} ({s.nivel})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Docente titular</Label>
              <select
                className="border-input h-9 rounded-lg border px-2 text-sm"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option value="">— Seleccionar profesor —</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.apellidos}, {t.nombres} ({t.especialidad})
                  </option>
                ))}
              </select>
            </div>

            <Button
              className="w-full"
              disabled={!courseId || !sectionId || !teacherId}
              onClick={handleAssign}
            >
              Asignar docente
            </Button>
          </CardContent>
        </Card>

        {/* Listado de Asignaciones */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" />
                <CardTitle className="text-base">Maestro de carga docente</CardTitle>
              </div>
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar curso o docente..."
                  className="pl-9 h-9"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso / Grado</TableHead>
                  <TableHead>Sección</TableHead>
                  <TableHead>Docente</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((ta) => {
                  const curso = courses.find((c) => c.id === ta.courseId);
                  const docente = staff.find((s) => s.id === ta.teacherId);
                  const seccion = sections.find((s) => s.id === ta.sectionId);
                  return (
                    <TableRow key={ta.id}>
                      <TableCell>
                        <div className="font-medium">{curso?.nombre}</div>
                        <div className="text-muted-foreground text-xs">{curso?.grado}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {seccion?.grado} · {seccion?.seccion}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {docente ? (
                          <>
                            <div className="text-sm font-medium">
                              {docente.nombres} {docente.apellidos}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {docente.especialidad}
                            </div>
                          </>
                        ) : (
                          <span className="text-destructive text-sm italic">Sin docente</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="success" className="bg-green-500/10 text-green-600 border-green-500/20">
                          Activo
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredAssignments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No se encontraron asignaciones.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
