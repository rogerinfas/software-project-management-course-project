"use client";

import * as React from "react";
import { FileText, Printer, Eye } from "lucide-react";

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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";

export default function DocumentosMatriculaPage() {
  const { students, guardians, sections, enrollmentDocuments, emitEnrollmentDocs } =
    useDemoData();

  const [previewStudentId, setPreviewStudentId] = React.useState<string | null>(null);
  const [previewTipo, setPreviewTipo] = React.useState<"ficha_matricula" | "contrato_servicios">("ficha_matricula");

  const previewStudent = previewStudentId
    ? students.find((s) => s.id === previewStudentId)
    : null;
  const previewSection = previewStudent?.sectionId
    ? sections.find((s) => s.id === previewStudent.sectionId)
    : null;
  const previewGuardian = previewStudentId
    ? guardians.find((g) => g.studentId === previewStudentId && g.responsableEconomico)
    : null;
  const previewDocs = previewStudentId
    ? enrollmentDocuments.filter((d) => d.studentId === previewStudentId)
    : [];

  const enrolledStudents = students.filter((s) => s.codigo);
  const today = new Date().toLocaleDateString("es-PE", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">B-4 · Emisión de Ficha de Matrícula</h1>
        <p className="text-muted-foreground text-sm">
          Generación de la <strong>ficha de matrícula</strong> y el{" "}
          <strong>compromiso de prestación de servicios educativos</strong> firmado.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alumnos matriculados</CardTitle>
          <CardDescription>
            Visualiza, re-emite o descarga (simulado) los documentos por alumno.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Documentos emitidos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrolledStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground text-center text-sm">
                    Sin alumnos matriculados aún.
                  </TableCell>
                </TableRow>
              )}
              {enrolledStudents.map((s) => {
                const sec = s.sectionId ? sections.find((x) => x.id === s.sectionId) : null;
                const docs = enrollmentDocuments.filter((d) => d.studentId === s.id);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      {s.nombres} {s.apellidos}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{s.codigo}</TableCell>
                    <TableCell className="text-xs">
                      {sec ? `${sec.grado} · ${sec.seccion}` : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {docs.map((d) => (
                          <Badge
                            key={d.id}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted text-[10px]"
                            onClick={() => {
                              setPreviewStudentId(s.id);
                              setPreviewTipo(d.tipo);
                            }}
                          >
                            {d.tipo === "ficha_matricula" ? "Ficha" : "Contrato"} · {d.generadoEn}
                          </Badge>
                        ))}
                        {docs.length === 0 && (
                          <span className="text-muted-foreground text-xs">sin emisión</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setPreviewStudentId(s.id);
                          setPreviewTipo("ficha_matricula");
                        }}
                      >
                        <Eye className="mr-1 size-3.5" />
                        Vista previa
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => emitEnrollmentDocs(s.id)}
                      >
                        <Printer className="mr-1 size-3.5" />
                        Re-emitir
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PDF Preview Dialog */}
      <Dialog
        open={!!previewStudentId}
        onOpenChange={(open) => { if (!open) setPreviewStudentId(null); }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Vista previa — {previewTipo === "ficha_matricula" ? "Ficha de Matrícula" : "Compromiso de Estudios"}
            </DialogTitle>
          </DialogHeader>

          {previewStudent && (
            <div className="space-y-4 text-sm">
              {/* Doc selector */}
              <div className="flex gap-2">
                {(["ficha_matricula", "contrato_servicios"] as const).map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setPreviewTipo(tipo)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all ${
                      previewTipo === tipo
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {tipo === "ficha_matricula" ? "Ficha de Matrícula" : "Compromiso de Estudios"}
                  </button>
                ))}
              </div>

              {/* Simulated document */}
              <div className="rounded-lg border bg-white dark:bg-zinc-950 p-5 space-y-4 font-serif text-zinc-900 dark:text-zinc-100">
                {/* Header */}
                <div className="text-center space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    I.E.P. Madre Santa Beatriz — Arequipa
                  </p>
                  <h2 className="text-base font-bold uppercase tracking-wide">
                    {previewTipo === "ficha_matricula"
                      ? "FICHA DE MATRÍCULA 2026"
                      : "COMPROMISO DE PRESTACIÓN DE SERVICIOS EDUCATIVOS 2026"}
                  </h2>
                  <p className="text-xs text-muted-foreground">Año escolar 2026</p>
                </div>

                <Separator />

                {/* Student data */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Datos del alumno
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    <div><span className="text-muted-foreground">Apellidos y nombres:</span> <span className="font-semibold">{previewStudent.apellidos}, {previewStudent.nombres}</span></div>
                    <div><span className="text-muted-foreground">DNI:</span> <span className="font-mono">{previewStudent.dni}</span></div>
                    <div><span className="text-muted-foreground">Fecha nacimiento:</span> {previewStudent.fechaNacimiento}</div>
                    <div><span className="text-muted-foreground">Sexo:</span> {previewStudent.sexo === "F" ? "Femenino" : "Masculino"}</div>
                    {previewSection && (
                      <>
                        <div><span className="text-muted-foreground">Nivel:</span> <span className="capitalize">{previewSection.nivel}</span></div>
                        <div><span className="text-muted-foreground">Grado:</span> {previewSection.grado}</div>
                        <div><span className="text-muted-foreground">Sección:</span> {previewSection.seccion}</div>
                        <div><span className="text-muted-foreground">Código:</span> <span className="font-mono">{previewStudent.codigo}</span></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Guardian data */}
                {previewGuardian && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Apoderado / responsable económico
                      </p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                        <div><span className="text-muted-foreground">Nombre:</span> {previewGuardian.nombreCompleto}</div>
                        <div><span className="text-muted-foreground">Parentesco:</span> {previewGuardian.parentesco}</div>
                        <div><span className="text-muted-foreground">DNI:</span> <span className="font-mono">{previewGuardian.dni}</span></div>
                        <div><span className="text-muted-foreground">Teléfono:</span> {previewGuardian.telefono}</div>
                        <div className="col-span-2"><span className="text-muted-foreground">Correo:</span> {previewGuardian.correo}</div>
                        <div><span className="text-muted-foreground">Ocupación:</span> {previewGuardian.ocupacion}</div>
                      </div>
                    </div>
                  </>
                )}

                {previewTipo === "contrato_servicios" && (
                  <>
                    <Separator />
                    <div className="text-xs space-y-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
                      <p>El apoderado firmante se compromete a cumplir con las obligaciones económicas derivadas de la prestación del servicio educativo, incluyendo el pago oportuno de pensiones mensuales y demás conceptos establecidos en el tarifario vigente para el año escolar <strong>2026</strong>.</p>
                      <p>Asimismo, declara conocer y aceptar el Reglamento Interno de la institución educativa y se compromete a velar por el cumplimiento de las normas de convivencia escolar.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-6">
                      <div className="text-center text-xs space-y-1">
                        <div className="border-b border-zinc-400 pb-1 mb-1">&nbsp;</div>
                        <p>Firma del apoderado</p>
                        <p className="text-muted-foreground">{previewGuardian?.nombreCompleto ?? "—"}</p>
                      </div>
                      <div className="text-center text-xs space-y-1">
                        <div className="border-b border-zinc-400 pb-1 mb-1">&nbsp;</div>
                        <p>Sello y firma de Dirección</p>
                        <p className="text-muted-foreground">I.E.P. Madre Santa Beatriz</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Footer */}
                <Separator />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Emitido: {today}</span>
                  <span>Documentos emitidos: {previewDocs.length}</span>
                  <span>Sistema SGA · v1.0</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2"
                >
                  <Printer className="size-4" />
                  Imprimir
                </Button>
                <Button size="sm" onClick={() => setPreviewStudentId(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
