import * as React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StepSectionAssignmentProps {
  sections: any[];
  selectedProspect: any | null;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onEnroll: () => void;
  isPending: boolean;
}

export function StepSectionAssignment({
  sections,
  selectedProspect,
  selectedSectionId,
  onSelectSection,
  onEnroll,
  isPending,
}: StepSectionAssignmentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignar Sección y Matricular</CardTitle>
        <CardDescription>
          El prospecto postuló para {selectedProspect?.level} / {selectedProspect?.targetGrade}. Seleccione la sección definitiva.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {sections
            ?.filter((s: any) => s.level === selectedProspect?.level && s.grade === selectedProspect?.targetGrade)
            .map((s: any) => {
              const matriculados = s.matriculados ?? 0;
              const capacity = s.capacity ?? 25;
              const pct = Math.round((matriculados / capacity) * 100);
              const isSelected = selectedSectionId === s.id;
              
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    if (matriculados < capacity) onSelectSection(s.id);
                  }}
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all duration-200",
                    isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-border-hover",
                    matriculados >= capacity ? "opacity-50 cursor-not-allowed" : ""
                  )}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-sm">{s.grade} - {s.name}</span>
                    <span className="text-xs text-muted-foreground">{matriculados}/{capacity}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full",
                        pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button disabled={!selectedSectionId || isPending} onClick={onEnroll}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Completar Matrícula
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
