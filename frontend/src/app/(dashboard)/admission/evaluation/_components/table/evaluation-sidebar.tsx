import * as React from "react";
import { Search, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EvaluationSidebarProps {
  search: string;
  setSearch: (val: string) => void;
  filteredProspects: any[];
  selectedProspectId: string | null;
  setSelectedProspectId: (id: string) => void;
}

export function EvaluationSidebar({
  search,
  setSearch,
  filteredProspects,
  selectedProspectId,
  setSelectedProspectId,
}: EvaluationSidebarProps) {
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
            const status = p.evaluation?.aptitude || "PENDING";
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProspectId(p.id)}
                className={`flex items-center justify-between rounded-lg p-3 text-left transition-all cursor-pointer ${
                  selectedProspectId === p.id
                    ? "bg-primary/10 border-primary border"
                    : "hover:bg-muted/40 border border-transparent"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.targetGrade}</span>
                </div>

                {status === "FIT" && (
                  <CheckCircle className="text-green-500 size-4 shrink-0" />
                )}
                {status === "UNFIT" && (
                  <XCircle className="text-red-500 size-4 shrink-0" />
                )}
                {status === "PENDING" && (
                  <HelpCircle className="text-yellow-500 size-4 shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
