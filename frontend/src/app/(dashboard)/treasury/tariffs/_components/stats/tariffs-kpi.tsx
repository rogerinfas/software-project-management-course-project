import * as React from "react";
import { Award, DollarSign, Calendar, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TariffsKpiProps {
  totalConcepts: number;
  averageAmount: number;
  primaryCount: number;
  secondaryCount: number;
}

export function TariffsKpi({ totalConcepts, averageAmount, primaryCount, secondaryCount }: TariffsKpiProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Award className="size-8 text-primary shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{totalConcepts}</p>
            <p className="text-muted-foreground text-xs font-medium">Conceptos vigentes</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <DollarSign className="size-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">S/ {averageAmount}</p>
            <p className="text-muted-foreground text-xs font-medium">Promedio general</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Calendar className="size-8 text-cyan-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{primaryCount}</p>
            <p className="text-muted-foreground text-xs font-medium">Conceptos Primaria</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <ShieldAlert className="size-8 text-blue-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{secondaryCount}</p>
            <p className="text-muted-foreground text-xs font-medium">Conceptos Secundaria</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
