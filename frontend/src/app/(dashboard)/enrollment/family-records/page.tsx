"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Check, X, Users2, ShieldAlert, Loader2, FileSpreadsheet, Contact } from "lucide-react";
import { toast } from "sonner";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { backend } from "@/lib/api/types/backend";

export default function ExpedientePage() {
  const queryClient = useQueryClient();

  const [studentId, setStudentId] = React.useState("");
  
  // Inline edit state
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editDni, setEditDni] = React.useState("");
  const [editName, setEditName] = React.useState("");
  const [editTel, setEditTel] = React.useState("");
  const [editCorreo, setEditCorreo] = React.useState("");
  const [editOcup, setEditOcup] = React.useState("");

  // Queries
  const { data: studentsData, isLoading: isLoadingStudents } = backend.useQuery(
    "get",
    "/api/enrollment/students",
    { params: { query: { page: 1, size: 100 } } }
  );

  const students = studentsData?.data ?? [];

  // Automatically select first student if none selected
  React.useEffect(() => {
    if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [students, studentId]);

  const activeStudent = students.find((s: any) => s.id === studentId) as any;

  // Siblings: Students who share the exact same guardian
  const siblings = activeStudent && activeStudent.guardianId
    ? students.filter((s: any) => s.guardianId === activeStudent.guardianId && s.id !== activeStudent.id)
    : [];

  const updateMutation = backend.useMutation("put", "/api/enrollment/guardians/{id}", {
    onSuccess: () => {
      toast.success("Apoderado actualizado en el expediente");
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/students"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al actualizar apoderado");
    },
  });

  function startEdit(g: any) {
    setEditId(g.id);
    setEditDni(g.dni);
    setEditName(g.name);
    setEditTel(g.phone);
    setEditCorreo(g.email || "");
    setEditOcup(g.occupation || "");
  }

  function saveEdit() {
    if (!editId) return;
    if (!editName.trim() || !editDni.trim()) {
      toast.error("El nombre y DNI son obligatorios");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        dni: editDni,
        name: editName,
        phone: editTel,
        email: editCorreo || undefined,
        occupation: editOcup || undefined,
      },
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-sans">Módulo 2 · Expediente Familiar</h1>
        <p className="text-muted-foreground text-sm font-sans">
          Ficha consolidada del alumno, apoderados legales y vinculación automática de hermanos en el colegio.
        </p>
      </div>

      {isLoadingStudents ? (
        <div className="flex h-60 flex-col items-center justify-center gap-3">
          <Loader2 className="text-primary size-8 animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">Cargando alumnos matriculados...</p>
        </div>
      ) : (
        <>
          {/* Selector de Alumno */}
          <Card className="bg-card border-border/80">
            <CardHeader>
              <CardTitle className="text-base font-sans flex items-center gap-2">
                <Contact className="size-4.5 text-primary" /> Seleccionar Alumno
              </CardTitle>
              <CardDescription className="font-sans">
                Elija un estudiante matriculado para ver su expediente y vínculos familiares.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-md">
              <select
                className="w-full border border-border/80 bg-background hover:bg-muted/10 h-10 rounded-xl px-3 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setEditId(null);
                }}
              >
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.code || "REGISTRO NUEVO"} — {s.lastName}, {s.firstName} ({s.dni})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {activeStudent ? (
            <Tabs defaultValue="datos" className="w-full space-y-4">
              <TabsList className="bg-muted/30 border border-border/60 p-1 rounded-xl">
                <TabsTrigger value="datos" className="rounded-lg font-semibold text-xs tracking-tight cursor-pointer px-4">Datos del Estudiante</TabsTrigger>
                <TabsTrigger value="apoderados" className="rounded-lg font-semibold text-xs tracking-tight cursor-pointer px-4">Apoderados Legales</TabsTrigger>
                <TabsTrigger value="hermanos" className="rounded-lg font-semibold text-xs tracking-tight cursor-pointer px-4">Vinculación Familiar ({siblings.length})</TabsTrigger>
              </TabsList>

              {/* ── Datos del alumno ── */}
              <TabsContent value="datos" className="space-y-4 pt-2">
                <Card className="bg-card border-border/80">
                  <CardHeader>
                    <CardTitle className="font-bold text-lg font-sans text-foreground">
                      {activeStudent.firstName} {activeStudent.lastName}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      Código de Estudiante: <span className="text-primary font-bold">{activeStudent.code || "NUEVO"}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm font-sans md:grid-cols-2">
                    <div className="bg-muted/20 border border-border/40 rounded-xl p-4 flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Documento Nacional de Identidad</span>
                      <span className="font-mono text-base font-bold text-foreground">{activeStudent.dni}</span>
                    </div>
                    <div className="bg-muted/20 border border-border/40 rounded-xl p-4 flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Nivel Académico</span>
                      <span className="text-base font-bold text-foreground capitalize">
                        {activeStudent.level === "PRIMARY" ? "Primaria" : "Secundaria"}
                      </span>
                    </div>
                    <div className="bg-muted/20 border border-border/40 rounded-xl p-4 flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Grado Escolar</span>
                      <span className="text-base font-bold text-foreground">{activeStudent.grade}</span>
                    </div>
                    <div className="bg-muted/20 border border-border/40 rounded-xl p-4 flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Sección / Aula</span>
                      <span className="text-base font-bold text-foreground">
                        {activeStudent.section ? `${activeStudent.section.grade} - ${activeStudent.section.name}` : "Sin sección"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Apoderados ── */}
              <TabsContent value="apoderados" className="space-y-4 pt-2">
                <Card className="bg-card border-border/80">
                  <CardHeader>
                    <CardTitle className="text-base font-sans flex items-center gap-2">
                      <ShieldAlert className="size-4.5 text-primary" /> Tutores Registrados
                    </CardTitle>
                    <CardDescription className="font-sans">
                      Responsable legal y económico a cargo del alumno. Edite la información de contacto directamente.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeStudent.guardian ? (
                      <div className="border border-border/60 rounded-xl overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/30 font-sans">
                            <TableRow>
                              <TableHead>Nombre Completo</TableHead>
                              <TableHead>DNI</TableHead>
                              <TableHead>Teléfono</TableHead>
                              <TableHead>Correo Electrónico</TableHead>
                              <TableHead>Ocupación</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="font-sans">
                            {editId === activeStudent.guardian.id ? (
                              <TableRow className="bg-muted/20">
                                <TableCell>
                                  <Input
                                    className="h-8 text-xs font-semibold"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    className="h-8 w-28 font-mono text-xs"
                                    value={editDni}
                                    onChange={(e) => setEditDni(e.target.value)}
                                    maxLength={8}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    className="h-8 text-xs"
                                    value={editTel}
                                    onChange={(e) => setEditTel(e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    className="h-8 text-xs"
                                    value={editCorreo}
                                    onChange={(e) => setEditCorreo(e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    className="h-8 text-xs"
                                    value={editOcup}
                                    onChange={(e) => setEditOcup(e.target.value)}
                                  />
                                </TableCell>
                                <TableCell className="text-right space-x-1.5">
                                  <Button
                                    size="xs"
                                    onClick={saveEdit}
                                    disabled={updateMutation.isPending}
                                    className="cursor-pointer"
                                  >
                                    {updateMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => setEditId(null)}
                                    className="cursor-pointer"
                                  >
                                    <X className="size-3" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow>
                                <TableCell className="font-bold text-foreground">{activeStudent.guardian.name}</TableCell>
                                <TableCell className="font-mono text-xs">{activeStudent.guardian.dni}</TableCell>
                                <TableCell className="font-semibold text-xs text-foreground">{activeStudent.guardian.phone}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{activeStudent.guardian.email || "—"}</TableCell>
                                <TableCell className="text-xs">{activeStudent.guardian.occupation || "—"}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => startEdit(activeStudent.guardian)}
                                    className="cursor-pointer"
                                  >
                                    <Pencil className="size-3" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border rounded-xl">
                        <Users2 className="size-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground font-sans">Ningún apoderado asignado.</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Vinculación familiar ── */}
              <TabsContent value="hermanos" className="space-y-4 pt-2">
                <Card className="bg-card border-border/80">
                  <CardHeader>
                    <CardTitle className="text-base font-sans flex items-center gap-2">
                      <Users2 className="size-4.5 text-primary" /> Hermanos en la Institución
                    </CardTitle>
                    <CardDescription className="font-sans">
                      Detección automática en base al apoderado legal registrado.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="font-sans">
                    {siblings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl text-center">
                        <Users2 className="size-8 text-muted-foreground/60 mb-2 animate-pulse" />
                        <span className="text-sm text-muted-foreground">Este alumno no registra hermanos vinculados en la institución.</span>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {siblings.map((h: any) => (
                          <div key={h.id} className="border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all rounded-xl p-4 flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-sm text-foreground">{h.firstName} {h.lastName}</span>
                              <span className="font-mono text-[10px] text-muted-foreground">DNI: {h.dni}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant="secondary" className="text-[10px]">
                                {h.code || "NUEVO"}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {h.section ? `${h.section.grade} - ${h.section.name}` : "Sin sección"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : null}
        </>
      )}
    </div>
  );
}
