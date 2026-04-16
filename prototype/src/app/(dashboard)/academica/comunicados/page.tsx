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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";
import type {
  BulletinCategory,
  BulletinVisibility,
} from "@/lib/mock/types";

const VISIBILIDAD: BulletinVisibility[] = ["publico", "interno"];
const CATEGORIAS: BulletinCategory[] = [
  "administrativo",
  "academico",
  "evento",
  "urgencia",
];

export default function ComunicadosPage() {
  const { bulletins, addBulletin } = useDemoData();

  const [titulo, setTitulo] = React.useState("");
  const [cuerpo, setCuerpo] = React.useState("");
  const [categoria, setCategoria] = React.useState<BulletinCategory>("academico");
  const [visibilidad, setVisibilidad] = React.useState<BulletinVisibility>("publico");
  const [vigenteHasta, setVigenteHasta] = React.useState("");

  React.useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setVigenteHasta(d.toISOString().slice(0, 10));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">C-3 · Panel de comunicados</h1>
        <p className="text-muted-foreground text-sm">
          Publica avisos por categoría y controla su visibilidad (interna o
          pública).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo comunicado</CardTitle>
          <CardDescription>
            Los comunicados públicos se muestran en la{" "}
            <code className="text-xs">/landing</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2 md:col-span-2">
            <Label>Título</Label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Cuerpo</Label>
            <Textarea
              rows={4}
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Categoría</Label>
            <select
              className="border-input h-8 rounded-lg border px-2 text-sm capitalize"
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value as BulletinCategory)
              }
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Visibilidad</Label>
            <select
              className="border-input h-8 rounded-lg border px-2 text-sm capitalize"
              value={visibilidad}
              onChange={(e) =>
                setVisibilidad(e.target.value as BulletinVisibility)
              }
            >
              {VISIBILIDAD.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Vigente hasta</Label>
            <Input
              type="date"
              value={vigenteHasta}
              onChange={(e) => setVigenteHasta(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Button
              onClick={() => {
                if (!titulo.trim() || !cuerpo.trim()) return;
                addBulletin({
                  titulo: titulo.trim(),
                  cuerpo: cuerpo.trim(),
                  categoria,
                  visibilidad,
                  vigenteHasta,
                });
                setTitulo("");
                setCuerpo("");
              }}
            >
              Publicar comunicado
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comunicados recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Visibilidad</TableHead>
                <TableHead>Publicado</TableHead>
                <TableHead>Vigente hasta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bulletins.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="max-w-[360px]">
                    <div className="font-medium">{b.titulo}</div>
                    <div className="text-muted-foreground line-clamp-2 text-xs">
                      {b.cuerpo}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{b.categoria}</TableCell>
                  <TableCell>
                    <Badge
                      variant={b.visibilidad === "publico" ? "default" : "outline"}
                    >
                      {b.visibilidad}
                    </Badge>
                  </TableCell>
                  <TableCell>{b.publicadoEn}</TableCell>
                  <TableCell>{b.vigenteHasta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
