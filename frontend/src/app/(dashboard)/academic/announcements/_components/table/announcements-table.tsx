import * as React from "react";
import { Search, Loader2, Megaphone, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Announcement } from "../../_types/announcements.types";

interface AnnouncementsTableProps {
  isLoading: boolean;
  list: Announcement[];
  search: string;
  setSearch: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

export function AnnouncementsTable({
  isLoading,
  list,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  onEdit,
  onDelete,
}: AnnouncementsTableProps) {
  return (
    <Card className="bg-card border-border/80">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Muro de Comunicados</CardTitle>
            <CardDescription>
              Filtra por categoría o busca palabras claves. Las alertas críticas aparecen destacadas en rojo.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full max-w-md sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar comunicado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val ?? "ALL")}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
                <SelectItem value="Evento">Evento</SelectItem>
                <SelectItem value="Informativo">Informativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Cargando comunicados...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 border border-dashed border-border/60 rounded-xl">
            <Megaphone className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No hay comunicados registrados.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((c) => {
              let badgeClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
              if (c.category === "Urgente") badgeClass = "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse";
              if (c.category === "Evento") badgeClass = "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";

              return (
                <Card key={c.id} className="relative overflow-hidden group hover:shadow-md hover:border-primary/30 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={`${badgeClass} border`}>
                        {c.category}
                      </Badge>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="xs" variant="outline" onClick={() => onEdit(c)} className="cursor-pointer">
                          <Pencil className="size-3" />
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => onDelete(c)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer">
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-base font-bold line-clamp-1 mt-2">{c.title}</CardTitle>
                    <CardDescription className="text-xs">
                      Publicado el {new Date(c.createdAt || "").toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4 min-h-[5rem]">
                      {c.content}
                    </p>
                    {c.expiresAt && (
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/5 px-2 py-1 rounded w-fit border border-amber-500/10">
                        Vence el {new Date(c.expiresAt).toLocaleDateString()}
                      </div>
                    )}
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
