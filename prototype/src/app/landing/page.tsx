"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDemoData } from "@/context/demo-data-context";
import type { BulletinCategory } from "@/lib/mock/types";

const CATEGORY_LABEL: Record<BulletinCategory, string> = {
  administrativo: "Administrativo",
  academico: "Académico",
  evento: "Evento",
  urgencia: "Urgente",
};

export default function LandingPage() {
  const { bulletins } = useDemoData();
  const hoy = new Date().toISOString().slice(0, 10);
  const publicos = bulletins
    .filter((b) => b.visibilidad === "publico" && b.vigenteHasta >= hoy)
    .sort((a, b) => (a.publicadoEn < b.publicadoEn ? 1 : -1));

  return (
    <div className="bg-background min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/landing" className="flex items-center gap-3">
            <Image
              src="/logo-iep-madre-santa-beatriz.png"
              alt="IEP Madre Santa Beatriz"
              width={48}
              height={48}
              className="size-10 object-contain"
            />
            <div>
              <p className="text-sm font-semibold">IEP Madre Santa Beatriz</p>
              <p className="text-muted-foreground text-xs">
                Inicial y Primaria · Arequipa
              </p>
            </div>
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
          >
            Acceso interno
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Comunicados para la comunidad educativa
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Avisos públicos vigentes. Para información personal de cada
              familia, usa el acceso interno.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admisión abierta</CardTitle>
              <CardDescription>
                Matrícula y admisión Inicial/Primaria.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                Acércate a secretaría o regístrate como prospecto para iniciar el
                proceso de admisión.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Avisos vigentes</h2>
          {publicos.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No hay avisos vigentes por ahora.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {publicos.map((b) => (
                <Card key={b.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="capitalize">
                        {CATEGORY_LABEL[b.categoria]}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        Vigente hasta {b.vigenteHasta}
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-base">{b.titulo}</CardTitle>
                    <CardDescription>
                      Publicado el {b.publicadoEn} por {b.autor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm whitespace-pre-line">
                    {b.cuerpo}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="text-muted-foreground mx-auto max-w-5xl px-4 text-xs">
          © {new Date().getFullYear()} IEP Madre Santa Beatriz — Sitio público
          (demo).
        </div>
      </footer>
    </div>
  );
}
