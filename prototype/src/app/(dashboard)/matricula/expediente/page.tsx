"use client";

import * as React from "react";
import { Plus, Pencil, Check, X, Users2 } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoData } from "@/context/demo-data-context";

export default function ExpedientePage() {
  const {
    students,
    guardians,
    sections,
    updateStudentDni,
    setGuardianResponsible,
    addGuardian,
    updateGuardian,
    linkSibling,
  } = useDemoData();

  const [studentId, setStudentId] = React.useState(students[0]?.id ?? "");
  const [dni, setDni] = React.useState("");

  // Edit apoderado inline
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editDni, setEditDni] = React.useState("");
  const [editTel, setEditTel] = React.useState("");
  const [editCorreo, setEditCorreo] = React.useState("");
  const [editOcup, setEditOcup] = React.useState("");

  // New apoderado dialog
  const [newOpen, setNewOpen] = React.useState(false);
  const [nNombre, setNNombre] = React.useState("");
  const [nDni, setNDni] = React.useState("");
  const [nTel, setNTel] = React.useState("");
  const [nCorreo, setNCorreo] = React.useState("");
  const [nParentesco, setNParentesco] = React.useState("Padre");
  const [nOcupacion, setNOcupacion] = React.useState("");
  const [nResponsable, setNResponsable] = React.useState(false);

  // Link sibling
  const [siblingId, setSiblingId] = React.useState("");

  const student = students.find((s) => s.id === studentId);
  const section = student?.sectionId
    ? sections.find((x) => x.id === student.sectionId)
    : null;
  const familyGuardians = guardians.filter((g) => g.studentId === studentId);
  const hermanos = student
    ? students.filter((s) => student.hermanosIds.includes(s.id))
    : [];
  const siblingOptions = students.filter(
    (s) => s.id !== studentId && !student?.hermanosIds.includes(s.id),
  );

  function startEdit(g: (typeof guardians)[0]) {
    setEditId(g.id);
    setEditDni(g.dni);
    setEditTel(g.telefono);
    setEditCorreo(g.correo);
    setEditOcup(g.ocupacion);
  }

  function saveEdit() {
    if (!editId) return;
    updateGuardian(editId, {
      dni: editDni,
      telefono: editTel,
      correo: editCorreo,
      ocupacion: editOcup,
    });
    setEditId(null);
  }

  function handleAddGuardian() {
    if (!nNombre.trim() || !nDni.trim() || !studentId) return;
    addGuardian({
      studentId,
      nombreCompleto: nNombre.trim(),
      dni: nDni.trim(),
      telefono: nTel.trim(),
      correo: nCorreo.trim(),
      parentesco: nParentesco,
      ocupacion: nOcupacion.trim(),
      responsableEconomico: nResponsable,
      deudaAniosAnterioresPendiente: false,
    });
    setNNombre(""); setNDni(""); setNTel(""); setNCorreo("");
    setNOcupacion(""); setNResponsable(false);
    setNewOpen(false);
  }

  function handleLinkSibling() {
    if (!siblingId || !studentId) return;
    linkSibling(studentId, siblingId);
    setSiblingId("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">B-1 · Expediente familiar</h1>
        <p className="text-muted-foreground text-sm">
          Datos del alumno, apoderados registrados y vinculación familiar.
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
            onChange={(e) => { setStudentId(e.target.value); setEditId(null); }}
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
            <TabsTrigger value="apoderados">
              Apoderados ({familyGuardians.length})
            </TabsTrigger>
            <TabsTrigger value="hermanos">
              Vinculación familiar ({hermanos.length})
            </TabsTrigger>
          </TabsList>

          {/* ── Datos del alumno ── */}
          <TabsContent value="datos" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{student.nombres} {student.apellidos}</CardTitle>
                <CardDescription>
                  {student.codigo ? (
                    <>Código <code className="font-mono">{student.codigo}</code> · {section ? `${section.grado} ${section.seccion}` : "Sin sección"}</>
                  ) : (
                    "Aún es postulante — pendiente de formalizar matrícula."
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">DNI actual:</span>{" "}
                  <span className="font-mono">{student.dni}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fecha de nac.:</span>{" "}
                  {student.fechaNacimiento}
                </div>
                <div>
                  <span className="text-muted-foreground">Sexo:</span>{" "}
                  {student.sexo === "F" ? "Femenino" : "Masculino"}
                </div>
                <div>
                  <span className="text-muted-foreground">Nivel:</span>{" "}
                  {section ? section.nivel : "—"}
                </div>
                <div className="md:col-span-2 mt-2 space-y-2">
                  <Label>Actualizar DNI (8 dígitos)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      placeholder={student.dni}
                      maxLength={8}
                      className="max-w-xs font-mono"
                    />
                    <Button
                      onClick={() => { if (updateStudentDni(student.id, dni)) setDni(""); }}
                    >
                      Actualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Apoderados ── */}
          <TabsContent value="apoderados" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Uno debe estar marcado como <strong>responsable económico</strong>.
              </p>
              <Dialog open={newOpen} onOpenChange={setNewOpen}>
                <DialogTrigger
                  render={
                    <Button size="sm" className="inline-flex items-center gap-2">
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
                      <Label>Nombre completo</Label>
                      <Input value={nNombre} onChange={(e) => setNNombre(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>DNI</Label>
                      <Input value={nDni} onChange={(e) => setNDni(e.target.value)} maxLength={8} className="font-mono" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Parentesco</Label>
                      <select
                        className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
                        value={nParentesco}
                        onChange={(e) => setNParentesco(e.target.value)}
                      >
                        {["Padre", "Madre", "Abuelo/a", "Tío/a", "Tutor legal"].map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
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
                      <Switch checked={nResponsable} onCheckedChange={setNResponsable} id="resp-sw" />
                      <Label htmlFor="resp-sw">Responsable económico</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddGuardian}>Registrar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="pt-4">
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
                    {familyGuardians.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-muted-foreground text-center text-sm">
                          Sin apoderados registrados.
                        </TableCell>
                      </TableRow>
                    )}
                    {familyGuardians.map((g) =>
                      editId === g.id ? (
                        <TableRow key={g.id} className="bg-muted/30">
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
                              <Badge>{g.deudaAniosAnterioresPendiente ? "Sí (con deuda)" : "Sí"}</Badge>
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
          </TabsContent>

          {/* ── Vinculación familiar ── */}
          <TabsContent value="hermanos" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="size-5" />
                  Hermanos en la institución
                </CardTitle>
                <CardDescription>
                  Vincula a los hermanos del alumno que también estudian en la institución.
                  El vínculo aplica automáticamente en ambas direcciones.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hermanos.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Sin hermanos vinculados.</p>
                ) : (
                  <ul className="space-y-2">
                    {hermanos.map((h) => {
                      const sec = h.sectionId ? sections.find((s) => s.id === h.sectionId) : null;
                      return (
                        <li key={h.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                          <span className="font-medium">{h.nombres} {h.apellidos}</span>
                          <span className="text-muted-foreground text-xs">
                            {h.codigo ?? "sin código"} · {sec ? `${sec.grado} ${sec.seccion}` : "sin sección"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="flex items-end gap-2 pt-2 border-t">
                  <div className="flex-1 grid gap-2">
                    <Label>Vincular nuevo hermano</Label>
                    <select
                      className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
                      value={siblingId}
                      onChange={(e) => setSiblingId(e.target.value)}
                    >
                      <option value="">— Seleccionar alumno —</option>
                      {siblingOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombres} {s.apellidos} ({s.codigo ?? "sin código"})
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleLinkSibling} disabled={!siblingId}>
                    Vincular
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}
