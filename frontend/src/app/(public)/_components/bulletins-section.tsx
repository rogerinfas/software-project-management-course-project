import * as React from "react";
import { Loader2, MessageSquare, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BulletinCategory = "administrativo" | "academico" | "evento" | "urgencia";

const CATEGORY_LABEL: Record<BulletinCategory, string> = {
  administrativo: "Administrativo",
  academico: "Académico",
  evento: "Evento",
  urgencia: "Urgente",
};

const CATEGORY_COLOR: Record<BulletinCategory, string> = {
  administrativo: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  academico: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  evento: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  urgencia: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

interface BulletinsSectionProps {
  isLoading: boolean;
  communications: any[];
}

export function BulletinsSection({ isLoading, communications }: BulletinsSectionProps) {
  const hoy = new Date();
  const publicos = (communications ?? [])
    .filter((b) => {
      if (b.isVisible === false) return false;
      if (b.expiresAt) {
        const expDate = new Date(b.expiresAt as unknown as string);
        if (expDate < hoy) return false;
      }
      return true;
    })
    .map((b) => {
      let cat: BulletinCategory = "administrativo";
      const dbCat = b.category.toLowerCase();
      if (dbCat === "urgente") cat = "urgencia";
      else if (dbCat === "evento") cat = "evento";
      else if (dbCat === "academico") cat = "academico";
      else if (dbCat === "informativo" || dbCat === "administrativo") cat = "administrativo";

      return {
        id: b.id,
        titulo: b.title,
        cuerpo: b.content,
        categoria: cat,
        publicadoEn: new Date(b.createdAt).toISOString().slice(0, 10),
        autor: "Dirección",
      };
    });

  return (
    <section id="comunicados" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Comunicados Recientes</h2>
          <p className="max-w-2xl text-muted-foreground text-lg">
            Mantente informado sobre las últimas novedades, eventos y avisos importantes de nuestra institución.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl">
            <Loader2 className="size-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Cargando comunicados...</p>
          </div>
        ) : publicos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
            <MessageSquare className="size-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">No hay avisos vigentes en este momento.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicos.map((b) => (
              <Card key={b.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 overflow-hidden bg-card/40 backdrop-blur-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-semibold", CATEGORY_COLOR[b.categoria])}>
                      {CATEGORY_LABEL[b.categoria]}
                    </Badge>
                    <div className="flex items-center text-muted-foreground text-[10px] uppercase tracking-wider font-bold">
                      <Calendar className="mr-1 size-3" />
                      {b.publicadoEn}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {b.titulo}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 pt-1">
                    <span className="font-semibold text-foreground/80">{b.autor}</span>
                    <span className="size-1 rounded-full bg-muted-foreground/30"></span>
                    <span>Secretaría</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {b.cuerpo}
                </CardContent>

              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
