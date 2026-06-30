import * as React from "react";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";
import { DocumentChecklist, ProspectDocumentsState } from "../_types/documents.types";

export function useDocumentsChecklist() {
  const [checklists, setChecklists] = React.useState<ProspectDocumentsState>({});

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

  const saveChecklists = (newChecklists: ProspectDocumentsState) => {
    setChecklists(newChecklists);
    localStorage.setItem("prospect_documents_checklist", JSON.stringify(newChecklists));
  };

  const toggleDocument = (prospectId: string, docKey: keyof DocumentChecklist) => {
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

  return { checklists, toggleDocument };
}

export function useProspects() {
  const { data: prospectsResponse, isLoading } = backend.useQuery("get", "/api/admission/prospects", {
    query: { page: 1, size: 100 }
  });

  const prospects = React.useMemo(() => {
    if (!prospectsResponse?.data) return [];
    return prospectsResponse.data as any[];
  }, [prospectsResponse]);

  return { prospects, isLoading };
}
