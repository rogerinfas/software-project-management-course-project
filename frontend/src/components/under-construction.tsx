"use client";

import * as React from "react";
import Link from "next/link";
import { ConstructionIcon, ArrowLeftIcon, SparklesIcon, CalendarClockIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

interface UnderConstructionProps {
  title: string;
  moduleName?: string;
}

export function UnderConstruction({ title, moduleName }: UnderConstructionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 max-w-2xl mx-auto text-center space-y-6">
      {/* Icono con animación sutil de flotación */}
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-amber-500/20 blur-xl animate-pulse" />
        <div className="relative p-6 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner flex items-center justify-center shrink-0">
          <ConstructionIcon className="size-16 animate-bounce" />
        </div>
      </div>

      {/* Etiquetas e Identificadores */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <SparklesIcon className="size-3" />
          Fase de Migración Activa
        </div>
        {moduleName && (
          <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">
            {moduleName}
          </p>
        )}
      </div>

      {/* Textos descriptivos */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Este módulo del EDT se encuentra actualmente bajo desarrollo activo. Estamos migrando y acoplando los flujos de datos dinámicos a la nueva arquitectura.
        </p>
      </div>

      {/* Línea de tiempo / Información de disponibilidad */}
      <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-card/40 border text-xs text-muted-foreground w-full max-w-sm">
        <CalendarClockIcon className="size-4 shrink-0 text-amber-500/80" />
        <span>Disponibilidad estimada en la siguiente iteración</span>
      </div>

      {/* Botones de Navegación */}
      <div className="pt-2">
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "default" })}
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Volver al Panel Principal
        </Link>
      </div>
    </div>
  );
}
