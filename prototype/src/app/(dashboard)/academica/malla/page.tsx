"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoData } from "@/context/demo-data-context";
import type { Course } from "@/lib/mock/types";

export default function MallaPage() {
  const { courses, addCourse, updateCourse, deleteCourse } = useDemoData();
  const grados = Array.from(new Set(courses.map((c) => c.grado))).sort();

  // New Course Dialog
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [grado, setGrado] = React.useState(grados[0] || "1° primaria");
  const [horas, setHoras] = React.useState("4");

  // Edit Course
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editNombre, setEditNombre] = React.useState("");
  const [editHoras, setEditHoras] = React.useState("");

  const handleAdd = () => {
    if (!nombre.trim()) return;
    addCourse({
      nombre: nombre.trim(),
      grado,
      horasSemanales: parseInt(horas),
    });
    setNombre("");
    setOpen(false);
  };

  const handleEdit = (c: Course) => {
    setEditingId(c.id);
    setEditNombre(c.nombre);
    setEditHoras(c.horasSemanales.toString());
  };

  const handleUpdate = () => {
    if (!editingId || !editNombre.trim()) return;
    updateCourse(editingId, {
      nombre: editNombre.trim(),
      horasSemanales: parseInt(editHoras),
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">C-1 · Malla curricular</h1>
          <p className="text-muted-foreground text-sm">
            Configuración de cursos y horas lectivas por grado.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="flex items-center gap-2">
                <Plus className="size-4" /> Nuevo curso
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar nuevo curso</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre del curso</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Robótica, Música..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Grado</Label>
                  <select
                    className="border-input h-10 rounded-lg border px-2 text-sm"
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                  >
                    {[
                      "Inicial 3 años",
                      "Inicial 4 años",
                      "Inicial 5 años",
                      "1° primaria",
                      "2° primaria",
                      "3° primaria",
                      "4° primaria",
                      "5° primaria",
                      "6° primaria",
                    ].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Horas semanales</Label>
                  <Input
                    type="number"
                    value={horas}
                    onChange={(e) => setHoras(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>Crear curso</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue={grados[0]}>
        <TabsList className="flex-wrap h-auto p-1 bg-muted">
          {grados.map((g) => (
            <TabsTrigger key={g} value={g} className="px-4 py-2">
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
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-5 text-primary" />
                    <div>
                      <CardTitle>Plan curricular — {g}</CardTitle>
                      <CardDescription>
                        Cursos oficiales y horas asignadas.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Curso</TableHead>
                        <TableHead className="text-center">Hrs./sem</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cursos.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">
                            {editingId === c.id ? (
                              <Input
                                value={editNombre}
                                onChange={(e) => setEditNombre(e.target.value)}
                                className="h-8 max-w-[200px]"
                              />
                            ) : (
                              c.nombre
                            )}
                          </TableCell>
                          <TableCell className="text-center tabular-nums">
                            {editingId === c.id ? (
                              <Input
                                type="number"
                                value={editHoras}
                                onChange={(e) => setEditHoras(e.target.value)}
                                className="h-8 w-20 mx-auto"
                              />
                            ) : (
                              c.horasSemanales
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {editingId === c.id ? (
                              <>
                                <Button size="xs" onClick={handleUpdate}>
                                  Guardar
                                </Button>
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancelar
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="xs"
                                  variant="outline"
                                  onClick={() => handleEdit(c)}
                                >
                                  <Pencil className="size-3 mr-1" /> Editar
                                </Button>
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => {
                                    if (confirm("¿Eliminar este curso?"))
                                      deleteCourse(c.id);
                                  }}
                                >
                                  <Trash2 className="size-3" />
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {cursos.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground py-8"
                          >
                            No hay cursos configurados para este grado.
                          </TableCell>
                        </TableRow>
                      )}
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
