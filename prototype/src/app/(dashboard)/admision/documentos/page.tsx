"use client";

import * as React from "react";
import { FileImage, FileText, Upload } from "lucide-react";

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
import { useDemoData } from "@/context/demo-data-context";
import type { DocumentValidationStatus } from "@/lib/mock/types";

const ESTADO_VARIANT: Record<
  DocumentValidationStatus,
  "default" | "secondary" | "destructive"
> = {
  validado: "default",
  cargado: "secondary",
  observado: "destructive",
};

export default function DocumentosAdmisionPage() {
  const {
    prospects,
    prospectDocuments,
    admissionRequirements,
    addProspectDocument,
    setProspectDocumentStatus,
  } = useDemoData();

  const [prospectId, setProspectId] = React.useState(prospects[0]?.id ?? "");
  const [tipoDoc, setTipoDoc] = React.useState(
    admissionRequirements[0]?.nombreDocumento ?? "",
  );
  const [nombreArchivo, setNombreArchivo] = React.useState("");
  const [tamanoKb, setTamanoKb] = React.useState(120);

  const docs = prospectDocuments.filter((d) => d.prospectId === prospectId);
  const prospect = prospects.find((p) => p.id === prospectId);
  const requisitosNivel = prospect
    ? admissionRequirements.filter((r) => r.nivel === prospect.nivel)
    : [];

  function submit() {
    if (!prospectId || !tipoDoc || !nombreArchivo.trim()) return;
    addProspectDocument({
      prospectId,
      nombreArchivo: nombreArchivo.trim(),
      tipoDocumento: tipoDoc,
      estado: "cargado",
      tamanoKb,
    });
    setNombreArchivo("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          A-3 · Repositorio digital de documentos
        </h1>
        <p className="text-muted-foreground text-sm">
          Carga, almacenamiento y validación de los documentos del postulante.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subir documento</CardTitle>
          <CardDescription>
            Selecciona el prospecto, el tipo de documento y un nombre de archivo
            simulado.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Prospecto</Label>
            <select
              className="border-input h-8 rounded-lg border px-2 text-sm"
              value={prospectId}
              onChange={(e) => setProspectId(e.target.value)}
            >
              {prospects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {p.gradoPostulado}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Tipo de documento</Label>
            <select
              className="border-input h-8 rounded-lg border px-2 text-sm"
              value={tipoDoc}
              onChange={(e) => setTipoDoc(e.target.value)}
            >
              {requisitosNivel.map((r) => (
                <option key={r.id} value={r.nombreDocumento}>
                  {r.nombreDocumento} {r.obligatorio ? "(obligatorio)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Nombre del archivo</Label>
            <Input
              value={nombreArchivo}
              onChange={(e) => setNombreArchivo(e.target.value)}
              placeholder="dni_postulante.pdf"
            />
          </div>
          <div className="grid gap-2">
            <Label>Tamaño (KB)</Label>
            <Input
              type="number"
              min={1}
              value={tamanoKb}
              onChange={(e) => setTamanoKb(Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-2">
            <Button onClick={submit} className="inline-flex items-center gap-2">
              <Upload className="size-4" />
              Cargar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos del prospecto</CardTitle>
          <CardDescription>
            Valida, observa o marca los documentos como definitivos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Archivo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Subido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((d) => {
                const Icon = d.nombreArchivo.endsWith(".pdf")
                  ? FileText
                  : FileImage;
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        <Icon className="text-muted-foreground size-4" />
                        {d.nombreArchivo}
                      </span>
                    </TableCell>
                    <TableCell>{d.tipoDocumento}</TableCell>
                    <TableCell className="tabular-nums">{d.tamanoKb} KB</TableCell>
                    <TableCell>{d.subidoEn}</TableCell>
                    <TableCell>
                      <Badge variant={ESTADO_VARIANT[d.estado]}>{d.estado}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() =>
                          setProspectDocumentStatus(d.id, "validado")
                        }
                      >
                        Validar
                      </Button>
                      <Button
                        size="xs"
                        variant="destructive"
                        onClick={() =>
                          setProspectDocumentStatus(d.id, "observado")
                        }
                      >
                        Observar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {docs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground text-center text-sm">
                    Este prospecto aún no tiene documentos cargados.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
