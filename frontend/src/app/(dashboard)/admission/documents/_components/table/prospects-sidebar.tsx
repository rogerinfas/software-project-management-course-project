import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProspectDocumentsState } from "../../_types/documents.types";

interface ProspectsSidebarProps {
  search: string;
  setSearch: (val: string) => void;
  filteredProspects: any[];
  checklists: ProspectDocumentsState;
  selectedProspectId: string | null;
  setSelectedProspectId: (id: string) => void;
}

export function ProspectsSidebar({
  search,
  setSearch,
  filteredProspects,
  checklists,
  selectedProspectId,
  setSelectedProspectId,
}: ProspectsSidebarProps) {
  return (
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
  );
}
