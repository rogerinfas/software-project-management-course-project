import * as React from "react";
import { DollarSign, Coins, Landmark, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ReceiptsKpiProps {
  totalCollectedSum: number;
  cashPaymentsCount: number;
  bankPaymentsCount: number;
  cardPaymentsCount: number;
}

export function ReceiptsKpi({ totalCollectedSum, cashPaymentsCount, bankPaymentsCount, cardPaymentsCount }: ReceiptsKpiProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <DollarSign className="size-8 text-primary shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">S/ {totalCollectedSum.toFixed(2)}</p>
            <p className="text-muted-foreground text-xs font-medium">Total Recaudado</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Coins className="size-8 text-amber-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{cashPaymentsCount}</p>
            <p className="text-muted-foreground text-xs font-medium">En Efectivo</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Landmark className="size-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{bankPaymentsCount}</p>
            <p className="text-muted-foreground text-xs font-medium">Transferencias</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <CreditCard className="size-8 text-blue-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{cardPaymentsCount}</p>
            <p className="text-muted-foreground text-xs font-medium">Con Tarjeta</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
