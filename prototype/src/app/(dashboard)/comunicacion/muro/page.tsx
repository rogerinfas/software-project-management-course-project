"use client";

import * as React from "react";
import { FileImageIcon, FileTextIcon } from "lucide-react";

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
import { useDemoData } from "@/context/demo-data-context";
import type { BulletinSegment } from "@/lib/mock/types";

export default function MuroPage() {
  const { bulletins, addBulletin } = useDemoData();
  const [filtro, setFiltro] = React.useState<BulletinSegment | "todos">("todos");
  const [titulo, setTitulo] = React.useState("");
  const [cuerpo, setCuerpo] = React.useState("");
  const [segmento, setSegmento] = React.useState<BulletinSegment>("general");

  const lista =
    filtro === "todos"
      ? bulletins
      : bulletins.filter((b) => b.segmento === filtro);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Muro de comunicados</h1>
        <p className="text-muted-foreground text-sm">
          Textos con adjuntos; segmentación: Inicial, Primaria o General (req.txt).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo comunicado</CardTitle>
        </CardHeader>
        <CardContent className="grid max-w-xl gap-4">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Cuerpo</Label>
            <Textarea value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} rows={4} />
          </div>
          <div className="grid gap-2">
            <Label>Segmento</Label>
            <select
              className="border-input h-8 rounded-lg border px-2 text-sm"
              value={segmento}
              onChange={(e) => setSegmento(e.target.value as BulletinSegment)}
            >
              <option value="general">General</option>
              <option value="inicial">Solo Inicial</option>
              <option value="primaria">Solo Primaria</option>
            </select>
          </div>
          <Button
            type="button"
            onClick={() => {
              if (!titulo.trim()) return;
              addBulletin(titulo.trim(), cuerpo.trim(), segmento);
              setTitulo("");
              setCuerpo("");
            }}
          >
            Publicar
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Ver:</span>
        {(
          [
            ["todos", "Todos"],
            ["general", "General"],
            ["inicial", "Inicial"],
            ["primaria", "Primaria"],
          ] as const
        ).map(([v, label]) => (
          <Button
            key={v}
            size="sm"
            variant={filtro === v ? "default" : "outline"}
            onClick={() => setFiltro(v)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {lista.map((b) => (
          <Card key={b.id}>
            <CardHeader>
              <CardTitle className="text-lg">{b.titulo}</CardTitle>
              <CardDescription>
                {b.fecha} —{" "}
                <span className="capitalize">{b.segmento}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm whitespace-pre-wrap">{b.cuerpo}</p>
              {b.adjuntos.length > 0 ? (
                <ul className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                  {b.adjuntos.map((a) => (
                    <li
                      key={a.nombre}
                      className="bg-muted flex items-center gap-1 rounded px-2 py-1"
                    >
                      {a.tipo === "pdf" ? (
                        <FileTextIcon className="size-3.5" />
                      ) : (
                        <FileImageIcon className="size-3.5" />
                      )}
                      {a.nombre}
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
