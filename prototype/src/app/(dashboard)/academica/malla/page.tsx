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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoData } from "@/context/demo-data-context";

export default function MallaPage() {
  const { courses, teachingAssignments, staff, sections } = useDemoData();
  const grados = Array.from(new Set(courses.map((c) => c.grado)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">C-1 · Malla curricular</h1>
        <p className="text-muted-foreground text-sm">
          Cursos por grado y asignación de docentes por sección.
        </p>
      </div>

      <Tabs defaultValue={grados[0]}>
        <TabsList className="flex-wrap">
          {grados.map((g) => (
            <TabsTrigger key={g} value={g}>
              {g}
            </TabsTrigger>
          ))}
        </TabsList>

        {grados.map((g) => {
          const cursos = courses.filter((c) => c.grado === g);
          return (
            <TabsContent key={g} value={g} className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Plan curricular — {g}</CardTitle>
                  <CardDescription>
                    Horas semanales por curso.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Curso</TableHead>
                        <TableHead className="text-right">Hrs./sem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cursos.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.nombre}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {c.horasSemanales}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Carga docente — {g}</CardTitle>
                  <CardDescription>
                    Docente titular por curso y sección.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Curso</TableHead>
                        <TableHead>Sección</TableHead>
                        <TableHead>Docente</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachingAssignments
                        .filter((ta) => {
                          const c = courses.find((x) => x.id === ta.courseId);
                          return c?.grado === g;
                        })
                        .map((ta) => {
                          const curso = courses.find((x) => x.id === ta.courseId);
                          const doc = staff.find((x) => x.id === ta.teacherId);
                          const sec = sections.find(
                            (x) => x.id === ta.sectionId,
                          );
                          return (
                            <TableRow key={ta.id}>
                              <TableCell>{curso?.nombre}</TableCell>
                              <TableCell>
                                {sec ? `${sec.grado} · ${sec.seccion}` : "—"}
                              </TableCell>
                              <TableCell>
                                {doc
                                  ? `${doc.nombres} ${doc.apellidos}`
                                  : "Sin asignar"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
