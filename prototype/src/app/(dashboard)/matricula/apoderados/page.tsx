"use client";

import * as React from "react";
import { Plus, Pencil, Check, X, Shield, AlertTriangle } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoData } from "@/context/demo-data-context";

export default function ApoderadosPage() {
  const {
    students,
    guardians,
    setGuardianResponsible,
    addGuardian,
    updateGuardian,
  } = useDemoData();

  // Filters
  const [filtroStudent, setFiltroStudent] = React.useState<string>("todos");

  // Edit inline
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editDni, setEditDni] = React.useState("");
  const [editTel, setEditTel] = React.useState("");
  const [editCorreo, setEditCorreo] = React.useState("");
  const [editOcup, setEditOcup] = React.useState("");

  // New apoderado dialog
  const [newOpen, setNewOpen] = React.useState(false);
  const [nStudentId, setNStudentId] = React.useState(students[0]?.id ?? "");
  const [nNombre, setNNombre] = React.useState("");
  const [nDni, setNDni] = React.useState("");
  const [nTel, setNTel] = React.useState("");
  const [nCorreo, setNCorreo] = React.useState("");
  const [nParentesco, setNParentesco] = React.useState("Padre");
  const [nOcupacion, setNOcupacion] = React.useState("");
  const [nResponsable, setNResponsable] = React.useState(false);

  const getStudentName = (id: string) => {
    const s = students.find((x) => x.id === id);
    return s ? `${s.nombres} ${s.apellidos}` : id;
  };

  const visible =
    filtroStudent === "todos"
      ? guardians
      : guardians.filter((g) => g.studentId === filtroStudent);

  function startEdit(g: (typeof guardians)[0]) {
    setEditId(g.id);
    setEditDni(g.dni);
    setEditTel(g.telefono);
    setEditCorreo(g.correo);
    setEditOcup(g.ocupacion);
  }

  function saveEdit() {
    if (!editId) return;
    updateGuardian(editId, { dni: editDni, telefono: editTel, correo: editCorreo, ocupacion: editOcup });
    setEditId(null);
  }

  function handleAdd() {
    if (!nNombre.trim() || !nDni.trim()) return;
    addGuardian({
      studentId: nStudentId,
      nombreCompleto: nNombre.trim(),
      dni: nDni.trim(),
      telefono: nTel.trim(),
      correo: nCorreo.trim(),
      parentesco: nParentesco,
      ocupacion: nOcupacion.trim(),
      responsableEconomico: nResponsable,
      deudaAniosAnterioresPendiente: false,
    });
    setNNombre(""); setNDni(""); setNTel(""); setNCorreo(""); setNOcupacion(""); setNResponsable(false);
    setNewOpen(false);
  }

  const totalConDeuda = guardians.filter(
    (g) => g.responsableEconomico && g.deudaAniosAnterioresPendiente,
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">B-2 · Gestión de Apoderados</h1>
          <p className="text-muted-foreground text-sm">
            Registro de padre, madre o tutor legal con DNI, ocupación y contacto.
          </p>
        </div>
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogTrigger
            render={
              <Button className="inline-flex items-center gap-2">
                <Plus className="size-4" /> Nuevo apoderado
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar apoderado</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2 sm:grid-cols-2">
              <div className="col-span-2 grid gap-2">
                <Label>Alumno</Label>
                <Select value={nStudentId} onValueChange={(v) => setNStudentId(v || "")}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Seleccionar alumno" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nombres} {s.apellidos} ({s.codigo ?? "sin código"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 grid gap-2">
                <Label>Nombre completo</Label>
                <Input value={nNombre} onChange={(e) => setNNombre(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>DNI</Label>
                <Input value={nDni} onChange={(e) => setNDni(e.target.value)} maxLength={8} className="font-mono" />
              </div>
              <div className="grid gap-2">
                <Label>Parentesco</Label>
                <Select value={nParentesco} onValueChange={(v) => setNParentesco(v || "")}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Parentesco" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Padre", "Madre", "Abuelo/a", "Tío/a", "Tutor legal"].map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input value={nTel} onChange={(e) => setNTel(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Correo</Label>
                <Input type="email" value={nCorreo} onChange={(e) => setNCorreo(e.target.value)} />
              </div>
              <div className="col-span-2 grid gap-2">
                <Label>Ocupación</Label>
                <Input value={nOcupacion} onChange={(e) => setNOcupacion(e.target.value)} />
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <Switch checked={nResponsable} onCheckedChange={setNResponsable} id="new-resp" />
                <Label htmlFor="new-resp">Marcar como responsable económico</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewOpen(false)}>Cancelar</Button>
              <Button onClick={handleAdd}>Registrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Shield className="size-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{guardians.length}</p>
              <p className="text-muted-foreground text-xs">Apoderados registrados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <Shield className="size-8 text-green-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {guardians.filter((g) => g.responsableEconomico).length}
              </p>
              <p className="text-muted-foreground text-xs">Responsables económicos</p>
            </div>
          </CardContent>
        </Card>
        <Card className={totalConDeuda > 0 ? "border-red-500/50" : ""}>
          <CardContent className="flex items-center gap-4 pt-5 pb-5">
            <AlertTriangle className={`size-8 shrink-0 ${totalConDeuda > 0 ? "text-red-500" : "text-muted-foreground"}`} />
            <div>
              <p className="text-2xl font-bold tabular-nums">{totalConDeuda}</p>
              <p className="text-muted-foreground text-xs">Con deuda años anteriores</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Todos los apoderados</CardTitle>
              <CardDescription>
                Filtra por alumno y edita datos de contacto directamente.
              </CardDescription>
            </div>
            <Select value={filtroStudent} onValueChange={(v) => setFiltroStudent(v || "")}>
              <SelectTrigger className="h-8 w-[200px]">
                <SelectValue placeholder="Filtrar por alumno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los alumnos</SelectItem>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nombres} {s.apellidos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Apoderado</TableHead>
                <TableHead>Parentesco</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Ocupación</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-muted-foreground text-center text-sm">
                    Sin apoderados.
                  </TableCell>
                </TableRow>
              )}
              {visible.map((g) =>
                editId === g.id ? (
                  <TableRow key={g.id} className="bg-muted/30">
                    <TableCell className="text-xs text-muted-foreground">{getStudentName(g.studentId)}</TableCell>
                    <TableCell className="font-medium">{g.nombreCompleto}</TableCell>
                    <TableCell>{g.parentesco}</TableCell>
                    <TableCell>
                      <Input className="h-7 w-28 font-mono text-xs" value={editDni} onChange={(e) => setEditDni(e.target.value)} maxLength={8} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Input className="h-7 text-xs" value={editTel} onChange={(e) => setEditTel(e.target.value)} placeholder="Teléfono" />
                        <Input className="h-7 text-xs" value={editCorreo} onChange={(e) => setEditCorreo(e.target.value)} placeholder="Correo" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input className="h-7 text-xs" value={editOcup} onChange={(e) => setEditOcup(e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={g.responsableEconomico ? "default" : "outline"}>
                        {g.responsableEconomico ? "Sí" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="xs" onClick={saveEdit}><Check className="size-3" /></Button>
                      <Button size="xs" variant="outline" onClick={() => setEditId(null)}><X className="size-3" /></Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={g.id}>
                    <TableCell className="text-xs text-muted-foreground">{getStudentName(g.studentId)}</TableCell>
                    <TableCell className="font-medium">{g.nombreCompleto}</TableCell>
                    <TableCell>{g.parentesco}</TableCell>
                    <TableCell className="font-mono text-xs">{g.dni}</TableCell>
                    <TableCell className="text-xs">
                      {g.telefono}<br />
                      <span className="text-muted-foreground">{g.correo}</span>
                    </TableCell>
                    <TableCell className="text-xs">{g.ocupacion}</TableCell>
                    <TableCell>
                      {g.responsableEconomico ? (
                        <Badge variant={g.deudaAniosAnterioresPendiente ? "destructive" : "default"}>
                          {g.deudaAniosAnterioresPendiente ? "Sí (deuda)" : "Sí"}
                        </Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="xs" variant="outline" onClick={() => startEdit(g)}>
                        <Pencil className="size-3" />
                      </Button>
                      {!g.responsableEconomico && (
                        <Button size="xs" variant="outline" onClick={() => setGuardianResponsible(g.id)}>
                          Responsable
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
