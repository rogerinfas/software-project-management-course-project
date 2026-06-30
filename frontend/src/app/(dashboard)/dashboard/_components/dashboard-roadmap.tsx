import * as React from "react";
import Link from "next/link";
import { WrenchIcon, ArrowRightIcon, Clock3Icon, AlertTriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MODULE_STATUS } from "../_constants/dashboard.constants";

export function DashboardRoadmap() {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-4">
        <WrenchIcon className="size-5 text-muted-foreground" />
        Mapa de Ruta e Integración
      </h2>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
  );
}
