import * as React from "react";
import { Search, Loader2, BookOpen, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Course } from "../../_types/curriculum.types";

interface CoursesTableProps {
  isLoading: boolean;
  list: Course[];
  search: string;
  setSearch: (val: string) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export function CoursesTable({
  isLoading,
  list,
  search,
  setSearch,
  onEdit,
  onDelete,
}: CoursesTableProps) {
  return (
    <Card className="bg-card border-border/80">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Malla Curricular Activa</CardTitle>
            <CardDescription>
              Materias obligatorias y electivas disponibles para la asignación de horarios escolares.
            </CardDescription>
          </div>
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar asignatura..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Cargando materias...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 border border-dashed border-border/60 rounded-xl">
            <BookOpen className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No hay asignaturas en el plan de estudios.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c: any) => (
              <Card key={c.id} className="relative overflow-hidden group hover:shadow-md hover:border-primary/40 transition-all duration-300">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                <CardHeader className="pb-2 pl-6">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold text-foreground line-clamp-1">{c.name}</CardTitle>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button size="xs" variant="outline" onClick={() => onEdit(c)} className="cursor-pointer">
                        <Pencil className="size-3" />
                      </Button>
                      <Button size="xs" variant="ghost" onClick={() => onDelete(c)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer">
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-xs font-mono">ID: {c.id.substring(0, 8)}</CardDescription>
                </CardHeader>
                <CardContent className="pl-6">
                  <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">
                    {c.description || "Sin descripción detallada disponible."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
