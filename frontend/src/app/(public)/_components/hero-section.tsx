import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section id="inicio" className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--color-primary)_0%,transparent_100%)] opacity-5"></div>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
              <Badge variant="secondary" className="mr-2 px-1 py-0 h-5">Nuevo</Badge>
              <span>Admisiones Abiertas 2026</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Forjando el <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Futuro</span> de tus hijos
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground lg:mx-0">
              Formamos niños y jóvenes en un entorno educativo que promueve el desarrollo académico, humano y moral, basado en valores sólidos, acompañamiento cercano y una comunidad educativa comprometida. Sé parte de nuestra familia beatina.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="#admision" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-12 px-8 text-base shadow-xl shadow-primary/20 cursor-pointer")}>
                Solicitar Información
              </Link>
              <Link href="#comunicados" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto h-12 px-8 text-base cursor-pointer")}>
                Ver Comunicados
              </Link>
            </div>
          </div>
          <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-1000">
            <Image
              src="/madre-santa-beatriz-hero.jpg"
              alt="Ceremonia y estandarte de la IEP Madre Santa Beatriz"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
