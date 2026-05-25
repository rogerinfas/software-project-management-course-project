"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Printer, Eye, Search, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backend } from "@/lib/api/types/backend";

export default function DocumentosMatriculaPage() {
  const queryClient = useQueryClient();

  // Filters & Selection
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [size] = React.useState(10);

  const [selectedEnrollmentId, setSelectedEnrollmentId] = React.useState<string | null>(null);
  const [previewTipo, setPreviewTipo] = React.useState<"ficha_matricula" | "contrato_servicios">("ficha_matricula");

  // Queries
  const { data: enrollmentsData, isLoading } = backend.useQuery(
    "get",
    "/api/enrollment/documents",
    {
      params: {
        query: {
          page,
          size,
          search: search || undefined,
        },
      },
    }
  );

  const list = enrollmentsData?.data ?? [];
  const selectedEnrollment = selectedEnrollmentId 
    ? list.find((e: any) => e.id === selectedEnrollmentId) 
    : null;

  const today = new Date().toLocaleDateString("es-PE", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleReemit = (e: any) => {
    toast.success(`Ficha de matrícula del alumno ${e.student?.firstName} ${e.student?.lastName} re-emitida con éxito.`);
    queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/documents"] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 2 · Emisión de Ficha de Matrícula</h1>
        <p className="text-muted-foreground text-sm">
          Generación y descarga de la <strong>ficha de matrícula oficial</strong> y el <strong>compromiso de prestación de servicios educativos</strong>.
        </p>
      </div>

      <Card className="bg-card border-border/80">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="size-4.5 text-primary" /> Alumnos Matriculados
              </CardTitle>
              <CardDescription>
                Visualice, imprima o re-emita los expedientes oficiales de matrícula del año lectivo en curso.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-xs sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por DNI o nombre..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3">
              <Loader2 className="text-primary size-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Cargando expedientes académicos...</p>
            </div>
          ) : (
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>Código de Estudiante</TableHead>
                    <TableHead>DNI Alumno</TableHead>
                    <TableHead>Sección Asignada</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-muted-foreground text-center py-6 text-sm">
                        No se encontraron registros de matrícula.
                      </TableCell>
                    </TableRow>
                  )}
                  {list.map((e: any) => (
                    <TableRow key={e.id} className="hover:bg-muted/10">
                      <TableCell className="font-semibold text-foreground">
                        {e.student?.firstName} {e.student?.lastName}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{e.student?.code || "—"}</TableCell>
                      <TableCell className="font-mono text-xs">{e.student?.dni}</TableCell>
                      <TableCell className="text-xs font-medium">
                        {e.student?.section ? `${e.student.section.grade} - ${e.student.section.name}` : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(e.date).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            setSelectedEnrollmentId(e.id);
                            setPreviewTipo("ficha_matricula");
                          }}
                          className="cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="size-3" /> Ver Expediente
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleReemit(e)}
                          className="cursor-pointer inline-flex items-center gap-1"
                        >
                          <Printer className="size-3" /> Re-emitir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {enrollmentsData?.meta && enrollmentsData.meta.totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="cursor-pointer"
              >
                Anterior
              </Button>
              <span className="text-xs text-muted-foreground">
                Página {page} de {enrollmentsData.meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(enrollmentsData.meta.totalPages, p + 1))}
                disabled={page === enrollmentsData.meta.totalPages}
                className="cursor-pointer"
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDF Preview Dialog */}
      <Dialog
        open={!!selectedEnrollmentId}
        onOpenChange={(open) => { if (!open) setSelectedEnrollmentId(null); }}
      >
        <DialogContent className="sm:max-w-2xl bg-card border border-border/80 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold">
              <FileText className="size-5 text-primary" />
              Vista Previa — {previewTipo === "ficha_matricula" ? "Ficha Oficial de Matrícula" : "Compromiso de Prestación de Servicios"}
            </DialogTitle>
          </DialogHeader>

          {selectedEnrollment && (
            <div className="space-y-4 text-sm">
              {/* Doc selector */}
              <div className="flex gap-2 bg-muted/30 p-1 rounded-xl border border-border/60">
                {(["ficha_matricula", "contrato_servicios"] as const).map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setPreviewTipo(tipo)}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                      previewTipo === tipo
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {tipo === "ficha_matricula" ? "Ficha de Matrícula" : "Compromiso de Estudios"}
                  </button>
                ))}
              </div>

              {/* Simulated document */}
              <div className="rounded-xl border border-border bg-white dark:bg-zinc-950 p-6 space-y-4 font-serif text-zinc-900 dark:text-zinc-100 shadow-inner">
                {/* Header */}
                <div className="text-center space-y-1.5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">
                    I.E.P. Madre Santa Beatriz — Arequipa
                  </p>
                  <h2 className="text-sm font-black uppercase tracking-wider font-sans text-zinc-800 dark:text-zinc-200">
                    {previewTipo === "ficha_matricula"
                      ? "FICHA OFICIAL DE MATRÍCULA"
                      : "COMPROMISO DE PRESTACIÓN DE SERVICIOS EDUCATIVOS"}
                  </h2>
                  <p className="text-[10px] text-zinc-500 font-sans">Año Escolar: {selectedEnrollment.year ?? 2026}</p>
                </div>

                <Separator className="border-zinc-200 dark:border-zinc-800" />

                {/* Student data */}
                <div className="font-sans">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                    <Sparkles className="size-3" /> Datos Generales del Estudiante
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                    <div>
                      <span className="text-zinc-500 font-medium">Apellidos y Nombres:</span>{" "}
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {selectedEnrollment.student?.lastName}, {selectedEnrollment.student?.firstName}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-medium">DNI:</span>{" "}
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                        {selectedEnrollment.student?.dni}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-medium">Nivel:</span>{" "}
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">
                        {selectedEnrollment.student?.level === "PRIMARY" ? "Primaria" : "Secundaria"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-medium">Grado:</span>{" "}
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {selectedEnrollment.student?.grade}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-medium">Sección:</span>{" "}
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        Sección {selectedEnrollment.student?.section?.name ?? "A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-medium">Código Estudiante:</span>{" "}
                      <span className="font-mono font-bold text-primary">
                        {selectedEnrollment.student?.code || "ALU-2026-NUEVO"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Guardian data */}
                {selectedEnrollment.student?.guardian && (
                  <>
                    <Separator className="border-zinc-200 dark:border-zinc-800" />
                    <div className="font-sans">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                        <Sparkles className="size-3" /> Responsable Legal / Económico
                      </p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        <div>
                          <span className="text-zinc-500 font-medium">Nombre Completo:</span>{" "}
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {selectedEnrollment.student.guardian.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-medium">DNI:</span>{" "}
                          <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                            {selectedEnrollment.student.guardian.dni}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-medium">Teléfono:</span>{" "}
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {selectedEnrollment.student.guardian.phone}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-medium">Correo Electrónico:</span>{" "}
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {selectedEnrollment.student.guardian.email || "—"}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-zinc-500 font-medium">Ocupación / Profesión:</span>{" "}
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {selectedEnrollment.student.guardian.occupation || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {previewTipo === "contrato_servicios" && (
                  <>
                    <Separator className="border-zinc-200 dark:border-zinc-800" />
                    <div className="text-[10px] font-sans space-y-2 leading-relaxed text-zinc-500 dark:text-zinc-400">
                      <p>El apoderado firmante se compromete voluntaria e irrevocablemente a cumplir con todas las obligaciones económicas derivadas de la prestación del servicio educativo, incluyendo el pago puntual de la matrícula y pensiones mensuales establecidas por la institución para el año académico {selectedEnrollment.year ?? 2026}.</p>
                      <p>Asimismo, declara haber leído y aceptado en su totalidad el Reglamento Interno y las Normas de Convivencia Escolar de la Institución Educativa Madre Santa Beatriz.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-6 pt-4 font-sans">
                      <div className="text-center text-[10px] space-y-1">
                        <div className="border-b border-zinc-300 dark:border-zinc-700 pb-1 mb-1 font-mono text-zinc-400">
                          {selectedEnrollment.student?.guardian?.name}
                        </div>
                        <p className="font-bold text-zinc-700 dark:text-zinc-300">Firma del Apoderado</p>
                        <p className="text-[9px] text-zinc-400">DNI: {selectedEnrollment.student?.guardian?.dni}</p>
                      </div>
                      <div className="text-center text-[10px] space-y-1">
                        <div className="border-b border-zinc-300 dark:border-zinc-700 pb-1 mb-1 text-zinc-400 italic">
                          Firma Autorizada
                        </div>
                        <p className="font-bold text-zinc-700 dark:text-zinc-300">Sello y Firma de Dirección</p>
                        <p className="text-[9px] text-zinc-400">Madre Santa Beatriz - Arequipa</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Footer */}
                <Separator className="border-zinc-200 dark:border-zinc-800" />
                <div className="flex justify-between text-[9px] text-zinc-400 font-sans font-medium">
                  <span>Generado: {today}</span>
                  <span className="font-bold text-primary uppercase">CÓDIGO DE MATRÍCULA: COMPLETO</span>
                  <span>SGA v1.0</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-4" />
                  Imprimir
                </Button>
                <Button size="sm" onClick={() => setSelectedEnrollmentId(null)} className="cursor-pointer">
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
