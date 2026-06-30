import * as React from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "../../_types/curriculum.types";

interface CurriculumKpiProps {
  list: Course[];
}

export function CurriculumKpi({ list }: CurriculumKpiProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <BookOpen className="size-8 text-primary shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{list.length}</p>
            <p className="text-muted-foreground text-xs font-medium">Asignaturas en la malla</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <GraduationCap className="size-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">Áreas obligatorias</p>
            <p className="text-muted-foreground text-xs font-medium">Matemática, Letras, Ciencias</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
