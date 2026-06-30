import * as React from "react";
import { CheckCircle2Icon, SparklesIcon } from "lucide-react";

export function DashboardBanner() {
  return (
    <div className="relative rounded-3xl border bg-card/40 backdrop-blur-xl overflow-hidden p-6 md:p-8 lg:p-10 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
      {/* Luces de gradiente en el fondo */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10 relative z-10">
        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-inner flex items-center justify-center shrink-0">
          <CheckCircle2Icon className="size-12 md:size-16" />
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <SparklesIcon className="size-3" />
            Intranet Administrativa
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            IEP Madre Santa Beatriz
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Bienvenido al sistema de administración general. Utiliza el panel lateral o las tarjetas a continuación para acceder a la gestión de admisión, matrícula de alumnos, horarios académicos y control de tesorería.
          </p>
        </div>
      </div>
    </div>
  );
}
