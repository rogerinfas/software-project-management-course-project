import * as React from "react";
import { UserCheck, CalendarRange } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Teacher, Schedule } from "../../_types/teacher-load.types";

interface TeacherLoadKpiProps {
  teachers: Teacher[];
  schedules: Schedule[];
}

export function TeacherLoadKpi({ teachers, schedules }: TeacherLoadKpiProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <UserCheck className="size-8 text-primary shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{teachers.length}</p>
            <p className="text-muted-foreground text-xs font-medium">Profesores Habilitados</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardContent className="flex items-center gap-4 pt-5 pb-5">
          <CalendarRange className="size-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{schedules.length}</p>
            <p className="text-muted-foreground text-xs font-medium">Bloques de Horarios Asignados</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
