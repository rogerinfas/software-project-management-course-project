import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnouncementsHeaderProps {
  onNewOpen: () => void;
}

export function AnnouncementsHeader({ onNewOpen }: AnnouncementsHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 3 · Comunicados y Anuncios</h1>
        <p className="text-muted-foreground text-sm">
          Publicación y administración de novedades, alertas y eventos dirigidos a la comunidad educativa.
        </p>
      </div>
      <Button
        onClick={onNewOpen}
        className="inline-flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="size-4" /> Crear comunicado
      </Button>
    </div>
  );
}
