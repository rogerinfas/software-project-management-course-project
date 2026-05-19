"use client";

import * as React from "react";
import Link from "next/link";
import { 
  WrenchIcon, 
  ConstructionIcon, 
  UserPlusIcon, 
  UsersIcon, 
  BookOpenIcon, 
  CoinsIcon, 
  FingerprintIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircle2Icon,
  Clock3Icon,
  AlertTriangleIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";

const MODULE_STATUS = [
  {
    code: "M1",
    title: "Admisión",
    href: "/admission/pipeline",
    description: "CRM de postulantes, etapas de admisión, citas y dictámenes.",
    icon: UserPlusIcon,
    status: "ready", // ready, active, pending
    statusLabel: "Fase 1 Lista",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  },
  {
    code: "M2",
    title: "Matrícula",
    href: "/enrollment/formalizacion",
    description: "Expediente familiar, gestión de vacantes e instrumentación.",
    icon: UsersIcon,
    status: "active",
    statusLabel: "En Construcción",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  },
  {
    code: "M3",
    title: "Académica y comunicación",
    href: "/academic/malla",
    description: "Mallas curriculares, carga de docentes, secciones y horarios.",
    icon: BookOpenIcon,
    status: "active",
    statusLabel: "En Construcción",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  },
  {
    code: "M4",
    title: "Tesorería",
    href: "/treasury/cobranzas",
    description: "Definición del tarifario, cobranzas y facturación integrada.",
    icon: CoinsIcon,
    status: "pending",
    statusLabel: "Pendiente",
    badgeColor: "bg-muted text-muted-foreground border-border/40"
  },
  {
    code: "M5",
    title: "Personal y asistencia",
    href: "/staff/reconocimiento",
    description: "Mecanismo de reconocimiento facial, pre-planilla y asistencia.",
    icon: FingerprintIcon,
    status: "pending",
    statusLabel: "Pendiente",
    badgeColor: "bg-muted text-muted-foreground border-border/40"
  }
];

export default function UnderConstructionPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Banner Principal de Construcción */}
      <div className="relative rounded-3xl border bg-card/40 backdrop-blur-xl overflow-hidden p-6 md:p-8 lg:p-10 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
        {/* Luces de gradiente en el fondo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10 relative z-10">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner flex items-center justify-center shrink-0">
            <ConstructionIcon className="size-12 md:size-16 animate-bounce" />
          </div>

          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <SparklesIcon className="size-3" />
              Fase de Desarrollo Activo
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Módulos del EDT en Migración
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              ¡Hola! Estamos trayendo toda la maqueta y flujos del prototipo de diseño original directamente al frontend funcional unificado en Next.js. El panel principal se encuentra bajo construcción mientras completamos las integraciones.
            </p>
          </div>
        </div>
      </div>

      {/* Estado General del Proyecto */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-4">
          <WrenchIcon className="size-5 text-muted-foreground" />
          Mapa de Ruta e Integración
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULE_STATUS.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.code} className="flex flex-col border bg-card/40 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:bg-card/75">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                      {m.code}
                    </span>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider", m.badgeColor)}>
                      {m.statusLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-background border text-foreground/80 shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-base font-semibold">{m.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-4">
                  <CardDescription className="text-xs leading-relaxed text-muted-foreground/90">
                    {m.description}
                  </CardDescription>

                  <div className="pt-2">
                    {m.status === "ready" ? (
                      <Link
                        className={cn(
                          buttonVariants({ variant: "default", size: "sm" }),
                          "w-full inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        )}
                        href={m.href}
                      >
                        Abrir módulo
                        <ArrowRightIcon className="size-3.5" />
                      </Link>
                    ) : m.status === "active" ? (
                      <div className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Clock3Icon className="size-3.5 animate-spin" />
                        Desplegando componentes
                      </div>
                    ) : (
                      <div className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border/40">
                        <AlertTriangleIcon className="size-3.5" />
                        Fase posterior
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Nota Técnica del Equipo */}
      <Card className="border bg-card/20 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle2Icon className="size-4 text-emerald-500" />
            Estado del Entorno y Conectividad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <p className="text-xs text-muted-foreground">
            El frontend Next.js está conectado de forma exitosa al backend NestJS en el puerto <strong className="text-foreground font-semibold">5000</strong> utilizando TanStack Query. Las cookies de autenticación, CORS y la base de datos PostgreSQL se encuentran plenamente operativas y sincronizadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
