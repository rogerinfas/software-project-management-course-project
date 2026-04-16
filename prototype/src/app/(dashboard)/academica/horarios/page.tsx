"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
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

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes"] as const;

export default function HorariosPage() {
  const { sections, scheduleSlots, courses, staff, classrooms } = useDemoData();
  const [sectionId, setSectionId] = React.useState(sections[0]?.id ?? "");

  const slots = scheduleSlots
    .filter((s) => s.sectionId === sectionId)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const ocupacionAula = classrooms.map((room) => ({
    ...room,
    slots: scheduleSlots.filter((s) => s.classroomId === room.id).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">C-2 · Horarios y asignación de aulas</h1>
        <p className="text-muted-foreground text-sm">
          Visualiza el horario por sección y la disponibilidad de los ambientes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Horario por sección</CardTitle>
          <CardDescription>Semana tipo de lunes a viernes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:max-w-xs">
            <Label>Sección</Label>
            <select
              className="border-input h-8 rounded-lg border px-2 text-sm"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.grado} · {s.seccion}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {DIAS.map((dia) => {
              const daySlots = slots.filter((s) => s.dia === dia);
              return (
                <div key={dia} className="rounded-md border p-3">
                  <p className="mb-2 text-xs font-semibold uppercase">{dia}</p>
                  {daySlots.length === 0 ? (
                    <p className="text-muted-foreground text-xs">Sin clases.</p>
                  ) : (
                    <ul className="space-y-2 text-xs">
                      {daySlots.map((sl) => {
                        const curso = courses.find((c) => c.id === sl.courseId);
                        const doc = staff.find((x) => x.id === sl.teacherId);
                        const room = classrooms.find(
                          (x) => x.id === sl.classroomId,
                        );
                        return (
                          <li key={sl.id} className="rounded bg-muted/60 p-2">
                            <div className="font-medium">{curso?.nombre}</div>
                            <div className="text-muted-foreground">
                              {sl.horaInicio}–{sl.horaFin} · {room?.nombre}
                            </div>
                            <div className="text-muted-foreground">
                              {doc?.nombres} {doc?.apellidos}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ocupación de aulas</CardTitle>
          <CardDescription>Bloques semanales programados por aula.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aula</TableHead>
                <TableHead>Piso</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Bloques programados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ocupacionAula.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nombre}</TableCell>
                  <TableCell className="tabular-nums">{r.piso}</TableCell>
                  <TableCell className="tabular-nums">{r.capacidad}</TableCell>
                  <TableCell>
                    <Badge variant={r.slots > 0 ? "default" : "outline"}>
                      {r.slots}
                    </Badge>
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
