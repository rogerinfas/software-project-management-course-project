import * as React from "react";
import { FileText, Printer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface DocumentPreviewProps {
  selectedEnrollmentId: string | null;
  setSelectedEnrollmentId: (val: string | null) => void;
  selectedEnrollment: any;
  previewTipo: "ficha_matricula" | "contrato_servicios";
  setPreviewTipo: (val: "ficha_matricula" | "contrato_servicios") => void;
  handlePrint: () => void;
  today: string;
}

export function DocumentPreview({
  selectedEnrollmentId,
  setSelectedEnrollmentId,
  selectedEnrollment,
  previewTipo,
  setPreviewTipo,
  handlePrint,
  today,
}: DocumentPreviewProps) {
  return (
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
  );
}
