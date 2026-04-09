"use client";

import * as React from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";

export default function MarcacionPage() {
  const { attendance, addAttendanceMark } = useDemoData();
  const [dni, setDni] = React.useState("");
  const [nombre, setNombre] = React.useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Registro de marcación</h1>
        <p className="text-muted-foreground text-sm">
          DNI o código — pensado para tablet en la entrada (req.txt).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marcar entrada</CardTitle>
          <CardDescription>Simulación de lectura DNI / código de barras.</CardDescription>
        </CardHeader>
        <CardContent className="grid max-w-md gap-4">
          <div className="grid gap-2">
            <Label htmlFor="dni-m">DNI (8 dígitos)</Label>
            <Input
              id="dni-m"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="41234567"
              className="font-mono"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nom-m">Nombre (opcional)</Label>
            <Input
              id="nom-m"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Apellidos y nombres"
            />
          </div>
          <Button type="button" onClick={() => addAttendanceMark(dni, nombre)}>
            Registrar marcación
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marcaciones del día</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.fecha}</TableCell>
                  <TableCell>{a.hora}</TableCell>
                  <TableCell className="font-mono">{a.dni}</TableCell>
                  <TableCell>{a.nombre}</TableCell>
                  <TableCell>{a.tipo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
