"use client";

import * as React from "react";
import { Megaphone, Plus, Eye, EyeOff, Trash2, Calendar, AlertTriangle, Info, CalendarDays } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useDemoData } from "@/context/demo-data-context";
import type {
  BulletinCategory,
  BulletinVisibility,
} from "@/lib/mock/types";

const VISIBILIDAD: BulletinVisibility[] = ["publico", "interno"];

export default function ComunicadosPage() {
  const { bulletins, addBulletin, updateBulletin } = useDemoData();

  const [titulo, setTitulo] = React.useState("");
  const [cuerpo, setCuerpo] = React.useState("");
  const [categoria, setCategoria] = React.useState<BulletinCategory>("administrativo");  const [visibilidad, setVisibilidad] = React.useState<BulletinVisibility>("publico");
  const [vigenteHasta, setVigenteHasta] = React.useState("2026-12-31");

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "urgencia": return <AlertTriangle className="size-3 text-destructive" />;
      case "evento": return <CalendarDays className="size-3 text-blue-500" />;
      default: return <Info className="size-3 text-primary" />;
    }
  };

  const toggleVisibility = (id: string, current: string) => {
    updateBulletin(id, { visibilidad: current === "publico" ? "interno" : "publico" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">C-5 · Panel de comunicados</h1>
        <p className="text-muted-foreground text-sm">
          Editor central para anuncios informativos, eventos y urgencias.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="size-5 text-primary" />
              <CardTitle className="text-base">Redactar comunicado</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Título</Label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Suspensión de labores..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Cuerpo del mensaje</Label>
              <Textarea
                value={cuerpo}
                onChange={(e) => setCuerpo(e.target.value)}
                placeholder="Escribe el contenido aquí..."
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Categoría</Label>
                <select
                  className="border-input h-9 rounded-lg border px-2 text-sm capitalize"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as BulletinCategory)}
                >
                  <option value="administrativo">Administrativo</option>
                  <option value="academico">Académico</option>
                  <option value="evento">Evento</option>
                  <option value="urgencia">Urgencia</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Visibilidad inicial</Label>
                <select
                  className="border-input h-9 rounded-lg border px-2 text-sm capitalize"
                  value={visibilidad}
                  onChange={(e) => setVisibilidad(e.target.value as BulletinVisibility)}
                >
                  {VISIBILIDAD.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Fecha de caducidad</Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-9 h-9"
                  value={vigenteHasta}
                  onChange={(e) => setVigenteHasta(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="w-full"
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
              Publicar ahora
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Megaphone className="size-5 text-primary" />
              <CardTitle className="text-base">Gestión de visibilidad</CardTitle>
            </div>
            <CardDescription>
              Controla qué anuncios son visibles para los padres de familia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comunicado</TableHead>
                  <TableHead>Categoría / Vigencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bulletins.map((b) => (
                  <TableRow key={b.id} className={b.visibilidad === "interno" ? "opacity-60 bg-muted/20" : ""}>
                    <TableCell className="max-w-[280px]">
                      <div className="font-semibold text-sm truncate">{b.titulo}</div>
                      <div className="text-muted-foreground line-clamp-1 text-[11px]">
                        {b.cuerpo}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Publicado: {b.publicadoEn}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs capitalize font-medium">
                          {getCategoryIcon(b.categoria)}
                          {b.categoria}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Expira: {b.vigenteHasta}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={b.visibilidad === "publico" ? "default" : "secondary"}
                        className={b.visibilidad === "publico" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {b.visibilidad === "publico" ? "Público" : "Oculto"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="icon-xs"
                        variant="outline"
                        title={b.visibilidad === "publico" ? "Ocultar" : "Publicar"}
                        onClick={() => toggleVisibility(b.id, b.visibilidad as string)}
                      >
                        {b.visibilidad === "publico" ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {bulletins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay comunicados registrados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
