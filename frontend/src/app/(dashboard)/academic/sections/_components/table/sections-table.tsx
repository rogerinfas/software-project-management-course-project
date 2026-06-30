import * as React from "react";
import { Loader2, Home, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Section } from "../../_types/sections.types";

interface SectionsTableProps {
  isLoading: boolean;
  list: Section[];
  levelFilter: string;
  setLevelFilter: (val: string) => void;
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => void;
}

export function SectionsTable({
  isLoading,
  list,
  levelFilter,
  setLevelFilter,
  onEdit,
  onDelete,
}: SectionsTableProps) {
  return (
    <Card className="bg-card border-border/80">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Aulas y Distribución</CardTitle>
            <CardDescription>
              Supervisa el porcentaje de ocupación escolar y gestiona las vacantes de cada sección.
            </CardDescription>
          </div>
          <Select value={levelFilter} onValueChange={(val) => setLevelFilter(val ?? "ALL")}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Nivel Educativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los Niveles</SelectItem>
              <SelectItem value="PRIMARY">Primaria</SelectItem>
              <SelectItem value="SECONDARY">Secundaria</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Cargando secciones...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 border border-dashed border-border/60 rounded-xl">
            <Home className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No se encontraron aulas.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s: any) => {
              const enrolled = s.matriculados ?? 0;
              const pct = Math.min(100, Math.round((enrolled / s.capacity) * 100));
              let progressColor = "bg-primary";
              if (pct >= 90) progressColor = "bg-red-500";
              else if (pct >= 70) progressColor = "bg-amber-500";
              else progressColor = "bg-emerald-500";

              return (
                <Card key={s.id} className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {s.level === "PRIMARY" ? "Primaria" : "Secundaria"}
                      </Badge>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="xs" variant="outline" onClick={() => onEdit(s)} className="cursor-pointer">
                          <Pencil className="size-3" />
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => onDelete(s)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer">
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground mt-2">
                      {s.grade} - "{s.name}"
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Estado: {s.status === "OPEN" ? "🟢 Abierta" : "🔴 Cerrada"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Ocupación</span>
                        <span className="text-foreground tabular-nums">
                          {enrolled} / {s.capacity} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${progressColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground bg-muted/30 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                      <span>Vacantes libres</span>
                      <span className="font-bold text-foreground tabular-nums">
                        {Math.max(0, s.capacity - enrolled)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
