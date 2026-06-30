"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useProspects, useDocumentsChecklist } from "./_hooks/documents-hooks";

import { DocumentsHeader } from "./_components/header/documents-header";
import { ProspectsSidebar } from "./_components/table/prospects-sidebar";
import { DocumentChecklist } from "./_components/table/document-checklist";

export default function DocumentsPage() {
  const [search, setSearch] = React.useState("");
  const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null);

  const { prospects, isLoading } = useProspects();
  const { checklists, toggleDocument } = useDocumentsChecklist();

  // Filtered prospects
  const filteredProspects = React.useMemo(() => {
    return prospects.filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [prospects, search]);

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
      <DocumentsHeader />

      <div className="grid gap-6 md:grid-cols-3">
        <ProspectsSidebar
          search={search}
          setSearch={setSearch}
          filteredProspects={filteredProspects}
          checklists={checklists}
          selectedProspectId={selectedProspectId}
          setSelectedProspectId={setSelectedProspectId}
        />

        <DocumentChecklist
          selectedProspect={selectedProspect}
          activeChecklist={activeChecklist}
          toggleDocument={toggleDocument}
        />
      </div>
    </div>
  );
}
