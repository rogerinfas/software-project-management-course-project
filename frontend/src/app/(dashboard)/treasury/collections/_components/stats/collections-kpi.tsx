import * as React from "react";
import { DollarSign, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CollectionsKpiProps {
  totalOutstanding: number;
  overdueCharges: number;
  paidAmount: number;
  collectionPercentage: number;
}

export function CollectionsKpi({ totalOutstanding, overdueCharges, paidAmount, collectionPercentage }: CollectionsKpiProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <DollarSign className="size-8 text-primary shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">S/ {totalOutstanding.toFixed(2)}</p>
            <p className="text-muted-foreground text-xs font-medium">Por cobrar</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <ShieldAlert className="size-8 text-amber-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{overdueCharges}</p>
            <p className="text-muted-foreground text-xs font-medium">Cargos vencidos</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <CheckCircle className="size-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">S/ {paidAmount.toFixed(2)}</p>
            <p className="text-muted-foreground text-xs font-medium">Recaudado histórico</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Clock className="size-8 text-indigo-550 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{collectionPercentage}%</p>
            <p className="text-muted-foreground text-xs font-medium">Eficiencia de cobro</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
