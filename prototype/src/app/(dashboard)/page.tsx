"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Coins,
  Fingerprint,
  GraduationCap,
  Megaphone,
  TrendingDown,
  UserPlus,
  Users,
} from "lucide-react";

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

const MODULES: Array<{
  code: string;
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    code: "M1",
    title: "Admisión",
    href: "/admision/pipeline",
    description: "CRM de postulantes, etapas, documentos.",
    icon: UserPlus,
  },
  {
    code: "M2",
    title: "Matrícula",
    href: "/matricula/formalizacion",
    description: "Expediente familiar, vacantes, PDFs.",
    icon: Users,
  },
  {
    code: "M3",
    title: "Académica y comunicación",
    href: "/academica/malla",
    description: "Malla, horarios, comunicados, landing.",
    icon: BookOpen,
  },
  {
    code: "M4",
    title: "Tesorería",
    href: "/tesoreria/cobranzas",
    description: "Tarifario, cobranzas, comprobantes.",
    icon: Coins,
  },
  {
    code: "M5",
    title: "Personal y asistencia",
    href: "/personal/reconocimiento",
    description: "Reconocimiento facial, reglas, pre-planilla.",
    icon: Fingerprint,
  },
];

export default function DashboardPage() {
  const {
    students,
    prospects,
    charges,
    bulletins,
    collection,
    staff,
    morosity,
    facialMarks,
    admissionStages,
  } = useDemoData();

  const matriculados = students.filter((s) => s.codigo).length;
  const moraPendiente = charges.reduce((a, c) => a + c.montoPendiente, 0);
  const ultimoMes = collection[collection.length - 1];
  const pctRecaud =
    ultimoMes && ultimoMes.proyectado > 0
      ? Math.round((ultimoMes.recaudado / ultimoMes.proyectado) * 100)
      : 0;
  const tardanzasMin = facialMarks.reduce(
    (a, m) => a + (m.tipo === "entrada" ? m.minutosTardanza : 0),
    0,
  );
  const publicos = bulletins.filter((b) => b.visibilidad === "publico").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Panel principal</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Alcance en ejecución según el EDT (<Link href="/acerca" className="underline">
            alcance.md
          </Link>
          ). Todos los datos son de demostración.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alumnos matriculados</CardTitle>
            <GraduationCap className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{matriculados}</p>
            <p className="text-muted-foreground text-xs">
              {prospects.length} prospectos · {admissionStages.length} etapas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo pendiente</CardTitle>
            <TrendingDown className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              S/ {moraPendiente.toLocaleString("es-PE")}
            </p>
            <p className="text-muted-foreground text-xs">
              {morosity.length} apoderados en monitor de morosidad
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Recaudación {ultimoMes?.mes ?? ""}
            </CardTitle>
            <Coins className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{pctRecaud}%</p>
            <p className="text-muted-foreground text-xs">
              S/ {ultimoMes?.recaudado.toLocaleString("es-PE")} de{" "}
              {ultimoMes?.proyectado.toLocaleString("es-PE")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tardanzas acumuladas</CardTitle>
            <Fingerprint className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{tardanzasMin} min</p>
            <p className="text-muted-foreground text-xs">
              {staff.length} personas · {publicos} comunicados públicos
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Módulos del EDT</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.code}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="text-primary size-5" />
                    <div>
                      <CardTitle className="text-base">
                        {m.code} · {m.title}
                      </CardTitle>
                      <CardDescription>{m.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "inline-flex items-center gap-1.5",
                    )}
                    href={m.href}
                  >
                    Abrir módulo
                    <ArrowRight className="size-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="size-4" />
            Atajo a la landing pública
          </CardTitle>
          <CardDescription>
            Vista sin login para padres de familia (EDT · C-4).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            className={cn(buttonVariants({ variant: "default" }))}
            href="/landing"
          >
            Abrir landing de avisos
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
