"use client";

import * as React from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  User,
  XCircle,
} from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useDemoData } from "@/context/demo-data-context";
import type { AppointmentStatus, AppointmentTipo } from "@/lib/mock/types";

const TIPO_LABEL: Record<AppointmentTipo, string> = {
  entrevista_familiar: "Entrevista familiar",
  evaluacion_academica: "Eval. académica",
  evaluacion_psicologica: "Eval. psicológica",
};

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; variant: "default" | "secondary" | "destructive"; icon: React.ElementType }
> = {
  programada: { label: "Programada", variant: "secondary", icon: Clock },
  realizada: { label: "Realizada", variant: "default", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", variant: "destructive", icon: XCircle },
};

export default function CitasAdmisionPage() {
  const { prospects, appointments, addAppointment, updateAppointmentStatus } =
    useDemoData();

  const today = new Date().toISOString().slice(0, 10);

  const [open, setOpen] = React.useState(false);
  const [prospectId, setProspectId] = React.useState(prospects[0]?.id ?? "");
  const [tipo, setTipo] = React.useState<AppointmentTipo>("entrevista_familiar");
  const [fecha, setFecha] = React.useState(today);
  const [horaInicio, setHoraInicio] = React.useState("09:00");
  const [horaFin, setHoraFin] = React.useState("09:45");
  const [responsable, setResponsable] = React.useState("Lic. Luisa Rojas");
  const [lugar, setLugar] = React.useState("Sala de Admisión");
  const [notas, setNotas] = React.useState("");

  // Filtros
  const [filtroEstado, setFiltroEstado] = React.useState<AppointmentStatus | "todos">("todos");

  const sorted = [...appointments].sort((a, b) =>
    a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : a.horaInicio.localeCompare(b.horaInicio),
  );

  const filtered = filtroEstado === "todos"
    ? sorted
    : sorted.filter((a) => a.estado === filtroEstado);

  const todayList = sorted.filter((a) => a.fecha === today);
  const upcomingList = sorted.filter(
    (a) => a.fecha > today && a.estado === "programada",
  );

  function handleAdd() {
    if (!prospectId || !fecha || !horaInicio || !horaFin || !responsable || !lugar) return;
    addAppointment({
      prospectId,
      tipo,
      fecha,
      horaInicio,
      horaFin,
      responsable,
      lugar,
      estado: "programada",
      notas: notas.trim() || undefined,
    });
    setNotas("");
    setOpen(false);
  }

  const getProspectName = (id: string) =>
    prospects.find((p) => p.id === id)?.nombre ?? id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">A-3 · Agenda de Citas</h1>
          <p className="text-muted-foreground text-sm">
            Programa y gestiona entrevistas y evaluaciones del proceso de admisión.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="inline-flex items-center gap-2">
                <Plus className="size-4" />
                Nueva cita
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Programar nueva cita</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Prospecto</Label>
                <select
                  className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
                  value={prospectId}
                  onChange={(e) => setProspectId(e.target.value)}
                >
                  {prospects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} — {p.gradoPostulado}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Tipo de cita</Label>
                <select
                  className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as AppointmentTipo)}
                >
                  <option value="entrevista_familiar">Entrevista familiar</option>
                  <option value="evaluacion_academica">Evaluación académica</option>
                  <option value="evaluacion_psicologica">Evaluación psicológica</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3 grid gap-2 sm:col-span-1">
                  <Label>Fecha</Label>
                  <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Inicio</Label>
                  <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Fin</Label>
                  <Input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Responsable</Label>
                  <Input value={responsable} onChange={(e) => setResponsable(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Lugar</Label>
                  <Input value={lugar} onChange={(e) => setLugar(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Notas (opcional)</Label>
                <Textarea
                  rows={2}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Indicaciones previas, documentos a traer, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleAdd}>Guardar cita</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen rápido */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <CalendarClock className="size-8 text-blue-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {upcomingList.length}
              </p>
              <p className="text-muted-foreground text-xs">Próximas programadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <CheckCircle2 className="size-8 text-green-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {appointments.filter((a) => a.estado === "realizada").length}
              </p>
              <p className="text-muted-foreground text-xs">Realizadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <XCircle className="size-8 text-red-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {appointments.filter((a) => a.estado === "cancelada").length}
              </p>
              <p className="text-muted-foreground text-xs">Canceladas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Citas de hoy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Citas de hoy — {today}</CardTitle>
          <CardDescription>
            {todayList.length === 0
              ? "No hay citas agendadas para hoy."
              : `${todayList.length} cita${todayList.length !== 1 ? "s" : ""} registrada${todayList.length !== 1 ? "s" : ""}.`}
          </CardDescription>
        </CardHeader>
        {todayList.length > 0 && (
          <CardContent className="space-y-3">
            {todayList.map((apt) => {
              const cfg = STATUS_CONFIG[apt.estado];
              const Icon = cfg.icon;
              return (
                <div key={apt.id} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm">{getProspectName(apt.prospectId)}</p>
                      <p className="text-muted-foreground text-xs">{TIPO_LABEL[apt.tipo]}</p>
                    </div>
                    <Badge variant={cfg.variant} className="inline-flex items-center gap-1">
                      <Icon className="size-3" />
                      {cfg.label}
                    </Badge>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {apt.horaInicio} – {apt.horaFin}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" />
                      {apt.lugar}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="size-3" />
                      {apt.responsable}
                    </span>
                  </div>
                  {apt.notas && (
                    <p className="mt-2 text-xs text-muted-foreground italic">{apt.notas}</p>
                  )}
                  {apt.estado === "programada" && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="xs"
                        onClick={() => updateAppointmentStatus(apt.id, "realizada")}
                      >
                        Marcar realizada
                      </Button>
                      <Button
                        size="xs"
                        variant="destructive"
                        onClick={() => updateAppointmentStatus(apt.id, "cancelada")}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>

      {/* Todas las citas */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Todas las citas</CardTitle>
              <CardDescription>Historial completo ordenado por fecha.</CardDescription>
            </div>
            <select
              className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as AppointmentStatus | "todos")}
            >
              <option value="todos">Todos los estados</option>
              <option value="programada">Programada</option>
              <option value="realizada">Realizada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.length === 0 && (
              <p className="text-muted-foreground text-sm">Sin citas para el filtro seleccionado.</p>
            )}
            {filtered.map((apt) => {
              const cfg = STATUS_CONFIG[apt.estado];
              const Icon = cfg.icon;
              return (
                <div
                  key={apt.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getProspectName(apt.prospectId)}</p>
                    <p className="text-muted-foreground text-xs">
                      {TIPO_LABEL[apt.tipo]} · {apt.fecha} {apt.horaInicio}–{apt.horaFin} · {apt.lugar}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={cfg.variant} className="inline-flex items-center gap-1">
                      <Icon className="size-3" />
                      {cfg.label}
                    </Badge>
                    {apt.estado === "programada" && (
                      <>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(apt.id, "realizada")}
                        >
                          Realizada
                        </Button>
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => updateAppointmentStatus(apt.id, "cancelada")}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
