"use client";

import * as React from "react";
import { Plus, Edit2, Trash2, UserCog, Clock, Briefcase, Users } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";
import type { StaffMember, StaffRole } from "@/lib/mock/types";

export default function RrhhPage() {
  const { staff, addStaffMember, updateStaffMember, deleteStaffMember } = useDemoData();

  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  // Form State
  const [nombres, setNombres] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");
  const [dni, setDni] = React.useState("");
  const [rol, setRol] = React.useState<StaffRole>("docente");
  const [especialidad, setEspecialidad] = React.useState("");
  const [hEntrada, setHEntrada] = React.useState("08:00");
  const [hSalida, setHSalida] = React.useState("16:00");
  const [tolerancia, setTolerancia] = React.useState("5");

  const handleSave = () => {
    const data = {
      nombres,
      apellidos,
      dni,
      rol,
      especialidad,
      horaEntrada: hEntrada,
      horaSalida: hSalida,
      toleranciaMinutos: Number(tolerancia),
      fotoReferencia: "/placeholder-avatar.png"
    };
    if (editingId) updateStaffMember(editingId, data);
    else addStaffMember(data);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setNombres("");
    setApellidos("");
    setDni("");
    setRol("docente");
    setEspecialidad("");
    setHEntrada("08:00");
    setHSalida("16:00");
    setTolerancia("5");
  };

  const startEdit = (s: StaffMember) => {
    setEditingId(s.id);
    setNombres(s.nombres);
    setApellidos(s.apellidos);
    setDni(s.dni);
    setRol(s.rol);
    setEspecialidad(s.especialidad);
    setHEntrada(s.horaEntrada);
    setHSalida(s.horaSalida);
    setTolerancia(s.toleranciaMinutos.toString());
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">E-1 · Gestión de RR.HH.</h1>
          <p className="text-muted-foreground text-sm">
            Maestro de personal, especialidades y configuración de jornadas laborales.
          </p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if(!o) resetForm(); }}>
          <DialogTrigger render={
            <Button className="gap-2">
              <Plus className="size-4" /> Registrar Personal
            </Button>
          } />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar" : "Nuevo"} Expediente de Personal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Nombres</Label>
                  <Input value={nombres} onChange={(e) => setNombres(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Apellidos</Label>
                  <Input value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>DNI</Label>
                  <Input value={dni} onChange={(e) => setDni(e.target.value)} maxLength={8} />
                </div>
                <div className="grid gap-2">
                  <Label>Rol</Label>
                  <select className="border-input h-9 rounded-lg border px-2 text-sm" value={rol} onChange={(e) => setRol(e.target.value as "docente" | "administrativo")}>
                    <option value="docente">Docente</option>
                    <option value="administrativo">Administrativo</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Especialidad / Cargo</Label>
                <Input value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} placeholder="Ej. Matemáticas, Psicología, etc." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Entrada</Label>
                  <Input type="time" value={hEntrada} onChange={(e) => setHEntrada(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Salida</Label>
                  <Input type="time" value={hSalida} onChange={(e) => setHSalida(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Tolerancia (m)</Label>
                  <Input type="number" value={tolerancia} onChange={(e) => setTolerancia(e.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Colaboradores</CardTitle>
            <Users className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tabular-nums">{staff.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total activos en planilla</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Plana Docente</CardTitle>
            <UserCog className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tabular-nums">{staff.filter(s => s.rol === 'docente').length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Especialistas académicos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Administrativos</CardTitle>
            <Briefcase className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tabular-nums">{staff.filter(s => s.rol === 'administrativo').length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Gestión y soporte institucional</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Jornada Promedio</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tabular-nums">8.5h</div>
            <p className="text-[10px] text-muted-foreground mt-1">Horas laboradas por día</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado Maestro de Personal</CardTitle>
          <CardDescription>
            Gestión de datos personales, horarios de marcación y tolerancia permitida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Rol / Especialidad</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead className="text-right">Tolerancia</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-xs">
                    {s.nombres} {s.apellidos}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{s.dni}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <Badge variant={s.rol === "docente" ? "default" : "outline"} className="w-fit text-[10px] h-4 uppercase">
                        {s.rol}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{s.especialidad}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-mono">{s.horaEntrada}</span> – <span className="font-mono">{s.horaSalida}</span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-xs font-semibold text-primary">
                    {s.toleranciaMinutos} min
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon-xs" onClick={() => startEdit(s)}>
                      <Edit2 className="size-3" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" className="text-destructive" onClick={() => { if(confirm("¿Eliminar expediente?")) deleteStaffMember(s.id); }}>
                      <Trash2 className="size-3" />
                    </Button>
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
