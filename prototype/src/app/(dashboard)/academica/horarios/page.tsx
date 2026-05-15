"use client";

import * as React from "react";
import { Plus, Calendar, Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  const {
    sections,
    scheduleSlots,
    courses,
    staff,
    classrooms,
    addScheduleSlot,
    deleteScheduleSlot,
  } = useDemoData();

  const [sectionId, setSectionId] = React.useState(sections[0]?.id ?? "");

  // New Slot Form
  const [open, setOpen] = React.useState(false);
  const [dia, setDia] = React.useState<typeof DIAS[number]>("lunes");
  const [horaInicio, setHoraInicio] = React.useState("08:00");
  const [horaFin, setHoraFin] = React.useState("09:30");
  const [courseId, setCourseId] = React.useState("");
  const [teacherId, setTeacherId] = React.useState("");
  const [classroomId, setClassroomId] = React.useState("");

  const slots = scheduleSlots
    .filter((s) => s.sectionId === sectionId)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const ocupacionAula = classrooms.map((room) => ({
    ...room,
    slots: scheduleSlots.filter((s) => s.classroomId === room.id).length,
  }));

  const handleAddSlot = () => {
    if (!courseId || !teacherId || !classroomId) return;
    addScheduleSlot({
      dia,
      horaInicio,
      horaFin,
      courseId,
      teacherId,
      sectionId,
      classroomId,
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">C-2 · Horarios y asignación de aulas</h1>
          <p className="text-muted-foreground text-sm">
            Programación de clases semanales y gestión de ambientes.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="flex items-center gap-2">
                <Plus className="size-4" /> Programar clase
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Programar nuevo bloque horario</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Día</Label>
                  <select
                    className="border-input h-9 rounded-lg border px-2 text-sm capitalize"
                    value={dia}
                    onChange={(e) => setDia(e.target.value as typeof DIAS[number])}
                  >
                    {DIAS.map((d) => (
                      <option key={d} value={d}>{d}</option>
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
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>{s.grado} · {s.seccion}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Hora Inicio</Label>
                  <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Hora Fin</Label>
                  <Input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Curso</Label>
                <select
                  className="border-input h-9 rounded-lg border px-2 text-sm"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">— Seleccionar curso —</option>
                  {courses
                    .filter((c) => {
                      const sec = sections.find((s) => s.id === sectionId);
                      return !sec || c.grado === sec.grado;
                    })
                    .map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Docente</Label>
                  <select
                    className="border-input h-9 rounded-lg border px-2 text-sm"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                  >
                    <option value="">— Seleccionar —</option>
                    {staff.filter(s => s.rol === 'docente').map((t) => (
                      <option key={t.id} value={t.id}>{t.apellidos}, {t.nombres}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Aula</Label>
                  <select
                    className="border-input h-9 rounded-lg border px-2 text-sm"
                    value={classroomId}
                    onChange={(e) => setClassroomId(e.target.value)}
                  >
                    <option value="">— Seleccionar —</option>
                    {classrooms.map((r) => (
                      <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddSlot}>Programar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <div>
                <CardTitle>Horario por sección</CardTitle>
                <CardDescription>Semana tipo de lunes a viernes.</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Ver sección:</Label>
              <select
                className="border-input h-8 rounded-lg border px-2 text-xs"
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-5">
            {DIAS.map((dia) => {
              const daySlots = slots.filter((s) => s.dia === dia);
              return (
                <div key={dia} className="rounded-md border p-3 bg-muted/20">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{dia}</p>
                  {daySlots.length === 0 ? (
                    <p className="text-muted-foreground text-[10px] italic">Sin clases.</p>
                  ) : (
                    <ul className="space-y-2 text-xs">
                      {daySlots.map((sl) => {
                        const curso = courses.find((c) => c.id === sl.courseId);
                        const doc = staff.find((x) => x.id === sl.teacherId);
                        const room = classrooms.find(
                          (x) => x.id === sl.classroomId,
                        );
                        return (
                          <li key={sl.id} className="group relative rounded border bg-background p-2 shadow-sm transition-all hover:ring-1 hover:ring-primary/50">
                            <button
                              onClick={() => { if(confirm("¿Eliminar bloque?")) deleteScheduleSlot(sl.id) }}
                              className="absolute -right-1 -top-1 hidden size-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm group-hover:flex"
                            >
                              <Plus className="size-3 rotate-45" />
                            </button>
                            <div className="font-bold text-primary">{curso?.nombre}</div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                              <Clock className="size-3" /> {sl.horaInicio} – {sl.horaFin}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin className="size-3" /> {room?.nombre}
                            </div>
                            <div className="text-[10px] font-medium mt-1 truncate">
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
          <CardTitle className="text-base">Ocupación de aulas</CardTitle>
          <CardDescription>Bloques semanales programados por ambiente físico.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aula</TableHead>
                <TableHead>Piso</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Bloques programados</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ocupacionAula.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nombre}</TableCell>
                  <TableCell className="tabular-nums font-mono">{r.piso}</TableCell>
                  <TableCell className="tabular-nums font-mono">{r.capacidad}</TableCell>
                  <TableCell>
                    <Badge variant={r.slots > 0 ? "default" : "outline"} className={r.slots > 5 ? "bg-orange-500" : ""}>
                      {r.slots} bloques
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Operativa
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
