import * as React from "react";
import { CheckSquare, Square, FileCheck2 } from "lucide-react";
import { DocumentChecklist as DocumentChecklistType } from "../../_types/documents.types";

interface DocumentChecklistProps {
  selectedProspect: any;
  activeChecklist: DocumentChecklistType | null;
  toggleDocument: (prospectId: string, docKey: keyof DocumentChecklistType) => void;
}

export function DocumentChecklist({
  selectedProspect,
  activeChecklist,
  toggleDocument,
}: DocumentChecklistProps) {
  if (!selectedProspect || !activeChecklist) {
    return (
      <div className="bg-card border-border/80 flex flex-col justify-between rounded-xl border p-6 md:col-span-2">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileCheck2 className="text-muted-foreground/30 mb-4 size-14 stroke-[1.25]" />
          <h3 className="text-foreground text-lg font-semibold">Selecciona un postulante</h3>
          <p className="text-muted-foreground max-w-sm mt-1 text-sm leading-relaxed">
            Selecciona uno de los postulantes de la lista de la izquierda para ver y gestionar su expediente de requisitos obligatorios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-border/80 flex flex-col justify-between rounded-xl border p-6 md:col-span-2">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="border-b border-border/60 pb-4">
          <h3 className="text-foreground text-lg font-semibold">{selectedProspect.name}</h3>
          <p className="text-muted-foreground text-xs mt-0.5">
            Grado de postulación: {selectedProspect.targetGrade} · Nivel: {selectedProspect.level}
          </p>
        </div>

        {/* Checklist Items */}
        <div className="flex flex-col gap-3">
          <h4 className="text-foreground text-sm font-semibold mb-2">
            Documentos y Requisitos del Postulante
          </h4>

          {[
            { key: "dni_alumno", label: "Copia simple del DNI del alumno (Legible)" },
            { key: "partida_nacimiento", label: "Partida de Nacimiento Original o copia simple" },
            { key: "dni_padres", label: "Copia simple del DNI de ambos padres" },
            { key: "libreta_notas", label: "Libreta de Notas del año escolar anterior" },
            { key: "certificado_conducta", label: "Certificado de no adeudo del colegio de procedencia" },
          ].map((doc) => {
            const isChecked = activeChecklist[doc.key as keyof DocumentChecklistType] || false;
            return (
              <button
                key={doc.key}
                onClick={() => toggleDocument(selectedProspect.id, doc.key as keyof DocumentChecklistType)}
                className="hover:bg-muted/30 flex items-center gap-3.5 rounded-lg border border-border/50 p-4 text-left transition-all cursor-pointer"
              >
                {isChecked ? (
                  <CheckSquare className="text-primary size-5 shrink-0" />
                ) : (
                  <Square className="text-muted-foreground size-5 shrink-0" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className={`text-sm ${isChecked ? "line-through text-muted-foreground" : "font-medium"}`}>
                    {doc.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
