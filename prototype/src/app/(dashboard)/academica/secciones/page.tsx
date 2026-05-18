"use client";

import * as React from "react";
import { Plus, Power, LayoutGrid } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoData } from "@/context/demo-data-context";

const SECCIONES_VALIDAS = ["A", "B", "C"];

export default function SeccionesPage() {
  const { sections, addSection, updateSection } = useDemoData();

  const [open, setOpen] = React.useState(false);
  const [grado, setGrado] = React.useState("1° primaria");
  const [seccion, setSeccion] = React.useState("A");
  const [nivel, setNivel] = React.useState<"inicial" | "primaria">("primaria");
  const [capacidad, setCapacidad] = React.useState("25");

  const handleAdd = () => {
    addSection({
      grado,
      seccion,
      nivel,
      capacidad: parseInt(capacidad),
      status: "abierta",
    });
    setOpen(false);
  };

  const toggleStatus = (id: string, current: string) => {
    updateSection(id, { status: current === "abierta" ? "cerrada" : "abierta" });
  };

  const niveles = ["inicial", "primaria"] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">C-4 · Registro de secciones</h1>
          <p className="text-muted-foreground text-sm">
            Gestión de apertura y cierre de secciones por grado y nivel.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="flex items-center gap-2">
                <Plus className="size-4" /> Abrir sección
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Abrir nueva sección</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Nivel</Label>
                  <Select value={nivel} onValueChange={(v) => setNivel(v as "inicial" | "primaria")}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inicial">Inicial</SelectItem>
                      <SelectItem value="primaria">Primaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Grado</Label>
                  <Select value={grado} onValueChange={(v) => setGrado(v || "")}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Grado" />
                    </SelectTrigger>
                    <SelectContent>
                      {nivel === "inicial"
                        ? ["Inicial 3 años", "Inicial 4 años", "Inicial 5 años"].map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))
                        : ["1° primaria", "2° primaria", "3° primaria", "4° primaria", "5° primaria", "6° primaria"].map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Sección</Label>
                  <Select value={seccion} onValueChange={(v) => setSeccion(v || "")}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Sección" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECCIONES_VALIDAS.map((s) => (
                        <SelectItem key={s} value={s}>
                          Sección {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Capacidad máxima</Label>
                  <Input
                    type="number"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>Abrir sección</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {niveles.map((n) => {
          const secs = sections.filter((s) => s.nivel === n);
          return (
            <Card key={n}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LayoutGrid className="size-5 text-primary" />
                  <CardTitle className="capitalize">Nivel {n}</CardTitle>
                </div>
                <CardDescription>
                  Listado de secciones habilitadas para {n}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grado / Sección</TableHead>
                      <TableHead>Capacidad</TableHead>
                      <TableHead>Matriculados</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {secs
                      .sort((a, b) => a.grado.localeCompare(b.grado))
                      .map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>
                            <div className="font-medium">{s.grado}</div>
                            <div className="text-muted-foreground text-xs font-mono">
                              Sección {s.seccion}
                            </div>
                          </TableCell>
                          <TableCell className="tabular-nums font-mono">{s.capacidad}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="tabular-nums font-mono">{s.matriculados}</span>
                              <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden hidden sm:block">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${(s.matriculados / s.capacidad) * 100}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={s.status === "abierta" ? "default" : "outline"}
                              className={s.status === "abierta" ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {s.status === "abierta" ? "Abierta" : "Cerrada"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="xs"
                              variant={s.status === "abierta" ? "outline" : "default"}
                              onClick={() => toggleStatus(s.id, s.status)}
                              className="inline-flex items-center gap-2"
                            >
                              <Power className="size-3" />
                              {s.status === "abierta" ? "Cerrar" : "Abrir"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    {secs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No hay secciones registradas en este nivel.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
