import * as React from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StepProspectsListProps {
  isLoading: boolean;
  prospects: any[];
  onSelectProspect: (prospect: any) => void;
}

export function StepProspectsList({ isLoading, prospects, onSelectProspect }: StepProspectsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prospectos Aptos (FIT)</CardTitle>
        <CardDescription>Seleccione un prospecto apto para iniciar su formalización.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
        ) : prospects.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">No hay prospectos aptos pendientes de formalización.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {prospects.map((p: any) => (
              <div key={p.id} className="p-4 border rounded-xl flex justify-between items-center bg-card hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.level} / {p.targetGrade}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => onSelectProspect(p)}>
                  Seleccionar <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
