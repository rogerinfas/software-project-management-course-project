"use client";

import * as React from "react";

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
import { useDemoData } from "@/context/demo-data-context";
import type { ProspectStatus } from "@/lib/mock/types";

const statusLabel: Record<ProspectStatus, string> = {
  pendiente: "Pendiente",
  entrevista: "Entrevista",
  aceptado: "Aceptado",
  retirado: "Retirado",
};

function statusVariant(s: ProspectStatus): "default" | "secondary" | "outline" | "destructive" {
  switch (s) {
    case "aceptado":
      return "default";
    case "entrevista":
      return "secondary";
    case "retirado":
      return "destructive";
    default:
      return "outline";
  }
}

export default function ProspectosPage() {
  const { prospects, addProspect, updateProspectStatus } = useDemoData();
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [celular, setCelular] = React.useState("");
  const [grado, setGrado] = React.useState("1° primaria");

  function submit() {
    if (!nombre.trim() || !celular.trim()) return;
    addProspect({
      nombre: nombre.trim(),
      celular: celular.trim(),
      gradoPostulado: grado,
      estado: "pendiente",
    });
    setNombre("");
    setCelular("");
    setGrado("1° primaria");
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de prospectos</h1>
          <p className="text-muted-foreground text-sm">
            Registro de interesados y seguimiento de estado del pipeline.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Nuevo prospecto
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar prospecto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nombre completo</Label>
                <Input
                  id="nom"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Apellidos y nombres"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cel">Celular</Label>
                <Input
                  id="cel"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="959000000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grado">Grado al que postula</Label>
                <select
                  id="grado"
                  className="border-input bg-background h-8 w-full rounded-lg border px-2 text-sm"
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                >
                  <option>Inicial 5 años</option>
                  <option>1° primaria</option>
                  <option>2° primaria</option>
                  <option>3° primaria</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={submit}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
          <CardDescription>
            Estados: pendiente, entrevista, aceptado, retirado (según req.txt).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prospects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.celular}</TableCell>
                  <TableCell>{p.gradoPostulado}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(p.estado)}>
                      {statusLabel[p.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <select
                      className="border-input h-8 rounded-md border px-2 text-xs"
                      value={p.estado}
                      onChange={(e) =>
                        updateProspectStatus(p.id, e.target.value as ProspectStatus)
                      }
                    >
                      {(Object.keys(statusLabel) as ProspectStatus[]).map((k) => (
                        <option key={k} value={k}>
                          {statusLabel[k]}
                        </option>
                      ))}
                    </select>
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
