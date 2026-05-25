"use client";

import * as React from "react";
import {
  FileText,
  Search,
  CheckSquare,
  Square,
  AlertCircle,
  Loader2,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { backend } from "@/lib/api/types/backend";

export default function DocumentsPage() {
  const [search, setSearch] = React.useState("");
  const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null);

  // Queries
  const { data: stages, isLoading } = backend.useQuery("get", "/api/admission/stages", {});

  // Extract all prospects
  const prospects = React.useMemo(() => {
    if (!stages) return [];
    return (stages as any).flatMap((s: any) => s.prospects || []);
  }, [stages]);

  // Filtered prospects
  const filteredProspects = React.useMemo(() => {
    return prospects.filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [prospects, search]);

  // Local storage based document checklist to avoid complex DB modifications while keeping it fully interactive
  const [checklists, setChecklists] = React.useState<Record<string, Record<string, boolean>>>({});

  React.useEffect(() => {
    const stored = localStorage.getItem("prospect_documents_checklist");
    if (stored) {
      try {
        setChecklists(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveChecklists = (newChecklists: Record<string, Record<string, boolean>>) => {
    setChecklists(newChecklists);
    localStorage.setItem("prospect_documents_checklist", JSON.stringify(newChecklists));
  };

  const toggleDocument = (prospectId: string, docKey: string) => {
    const current = checklists[prospectId] || {
      dni_alumno: false,
      partida_nacimiento: false,
      dni_padres: false,
      libreta_notas: false,
      certificado_conducta: false,
    };
    const updated = {
      ...checklists,
      [prospectId]: {
        ...current,
        [docKey]: !current[docKey],
      },
    };
    saveChecklists(updated);
    toast.success("Estado del documento actualizado");
  };

  // Selected prospect's checklist
  const activeChecklist = React.useMemo(() => {
    if (!selectedProspectId) return null;
    return checklists[selectedProspectId] || {
      dni_alumno: false,
      partida_nacimiento: false,
      dni_padres: false,
      libreta_notas: false,
      certificado_conducta: false,
    };
  }, [selectedProspectId, checklists]);

  const selectedProspect = React.useMemo(() => {
    return prospects.find((p: any) => p.id === selectedProspectId);
  }, [prospects, selectedProspectId]);

  if (isLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando expedientes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Expedientes y Requisitos</h2>
        <p className="text-muted-foreground text-sm">
          Administra la recepción de documentos obligatorios para el expediente del postulante.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: List of candidates */}
        <div className="bg-card border-border/80 flex flex-col gap-4 rounded-xl border p-4 md:col-span-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar postulante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto max-h-[50vh]">
            {filteredProspects.length === 0 ? (
              <div className="text-muted-foreground py-10 text-center text-xs">
                No hay postulantes registrados
              </div>
            ) : (
              filteredProspects.map((p: any) => {
                const docState = checklists[p.id] || {};
                const completedCount = Object.values(docState).filter(Boolean).length;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProspectId(p.id)}
                    className={`flex flex-col gap-1 rounded-lg p-3 text-left transition-all ${
                      selectedProspectId === p.id
                        ? "bg-primary/10 border-primary border"
                        : "hover:bg-muted/40 border border-transparent"
                    }`}
                  >
                    <span className="font-semibold text-sm">{p.name}</span>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{p.targetGrade}</span>
                      <span className="font-medium text-primary">
                        {completedCount}/5 recibidos
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Checklist details */}
        <div className="bg-card border-border/80 flex flex-col justify-between rounded-xl border p-6 md:col-span-2">
          {selectedProspect && activeChecklist ? (
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
                  const isChecked = activeChecklist[doc.key] || false;
                  return (
                    <button
                      key={doc.key}
                      onClick={() => toggleDocument(selectedProspect.id, doc.key)}
                      className="hover:bg-muted/30 flex items-center gap-3.5 rounded-lg border border-border/50 p-4 text-left transition-all"
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
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <FileCheck2 className="text-muted-foreground/30 mb-4 size-14 stroke-[1.25]" />
              <h3 className="text-foreground text-lg font-semibold">Selecciona un postulante</h3>
              <p className="text-muted-foreground max-w-sm mt-1 text-sm leading-relaxed">
                Selecciona uno de los postulantes de la lista de la izquierda para ver y gestionar su expediente de requisitos obligatorios.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
