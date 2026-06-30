import * as React from "react";
import { Megaphone, Bell, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AnnouncementsKpiProps {
  list: any[];
}

export function AnnouncementsKpi({ list }: AnnouncementsKpiProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Megaphone className="size-8 text-primary shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{list.length}</p>
            <p className="text-muted-foreground text-xs font-medium">Comunicados Activos</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Bell className="size-8 text-red-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {list.filter((c: any) => c.category === "Urgente").length}
            </p>
            <p className="text-muted-foreground text-xs font-medium">Alertas Urgentes</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Calendar className="size-8 text-indigo-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {list.filter((c: any) => c.category === "Evento").length}
            </p>
            <p className="text-muted-foreground text-xs font-medium">Eventos Programados</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
