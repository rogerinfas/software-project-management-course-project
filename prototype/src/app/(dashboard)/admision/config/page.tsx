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

export default function AdmisionConfigPage() {
  const {
    admissionStages,
    admissionRequirements,
    addAdmissionStage,
    toggleAdmissionRequirement,
  } = useDemoData();

  const [nombre, setNombre] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [obligatorio, setObligatorio] = React.useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          A-1 · Configuración del proceso de admisión
        </h1>
        <p className="text-muted-foreground text-sm">
          Define las etapas del embudo y los documentos exigidos por nivel.
        </p>
      </div>

      <Tabs defaultValue="stages">
        <TabsList>
          <TabsTrigger value="stages">Etapas</TabsTrigger>
          <TabsTrigger value="req">Requisitos por nivel</TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Nueva etapa</CardTitle>
              <CardDescription>
                Se agrega al final del embudo; puedes marcarla como obligatoria.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-xl gap-4">
              <div className="grid gap-2">
                <Label>Nombre</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="p. ej. Evaluación inglés"
                />
              </div>
              <div className="grid gap-2">
                <Label>Descripción</Label>
                <Input
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="opcional"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="stg-ob"
                  checked={obligatorio}
                  onCheckedChange={setObligatorio}
                />
                <Label htmlFor="stg-ob">Obligatoria</Label>
              </div>
              <Button
                onClick={() => {
                  if (!nombre.trim()) return;
                  addAdmissionStage({
                    nombre: nombre.trim(),
                    descripcion: descripcion.trim() || undefined,
                    obligatorio,
                  });
                  setNombre("");
                  setDescripcion("");
                  setObligatorio(true);
                }}
              >
                Agregar etapa
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Etapas actuales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Obligatoria</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admissionStages
                    .slice()
                    .sort((a, b) => a.orden - b.orden)
                    .map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="tabular-nums">{s.orden}</TableCell>
                        <TableCell className="font-medium">{s.nombre}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {s.descripcion ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={s.obligatorio ? "default" : "outline"}>
                            {s.obligatorio ? "Sí" : "No"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="req" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Requisitos documentales por nivel</CardTitle>
              <CardDescription>
                Controla qué documentos son obligatorios para admisión en cada
                nivel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead className="text-right">Obligatorio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admissionRequirements.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="capitalize">{r.nivel}</TableCell>
                      <TableCell>{r.nombreDocumento}</TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={r.obligatorio}
                          onCheckedChange={() => toggleAdmissionRequirement(r.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
