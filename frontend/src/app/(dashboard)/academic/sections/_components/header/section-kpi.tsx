import * as React from "react";
import { Home, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "../../_types/sections.types";

interface SectionKpiProps {
  list: Section[];
}

export function SectionKpi({ list }: SectionKpiProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Home className="size-8 text-primary shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{list.length}</p>
            <p className="text-muted-foreground text-xs font-medium">Aulas Habilitadas</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Users className="size-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {list.reduce((acc, curr: any) => acc + (curr.matriculados ?? 0), 0)}
            </p>
            <p className="text-muted-foreground text-xs font-medium">Estudiantes Matriculados</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <Shield className="size-8 text-indigo-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {list.reduce((acc, curr: any) => acc + (curr.capacity ?? 0), 0)}
            </p>
            <p className="text-muted-foreground text-xs font-medium">Aforo Total Disponible</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
