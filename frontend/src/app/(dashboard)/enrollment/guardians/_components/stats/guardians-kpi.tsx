import * as React from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface GuardiansKpiProps {
  totalGuardians: number;
  list: any[];
}

export function GuardiansKpi({ totalGuardians, list }: GuardiansKpiProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Shield className="size-8 text-primary shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{totalGuardians}</p>
            <p className="text-muted-foreground text-xs font-medium">Apoderados registrados</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Shield className="size-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {list.filter((g: any) => g.email).length}
            </p>
            <p className="text-muted-foreground text-xs font-medium">Con correo electrónico</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <AlertTriangle className="size-8 text-amber-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {list.filter((g: any) => g.dni.endsWith("99")).length}
            </p>
            <p className="text-muted-foreground text-xs font-medium">Con deuda pendiente simulada (DNI ..99)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
