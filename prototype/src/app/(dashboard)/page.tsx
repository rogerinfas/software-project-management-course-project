"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  GraduationCap,
  TrendingDown,
  Wallet,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDemoData } from "@/context/demo-data-context";

export default function DashboardPage() {
  const {
    students,
    charges,
    bulletins,
    collection,
    morosity,
    prospects,
  } = useDemoData();

  const matriculados = students.filter((s) => s.codigo).length;
  const moraPendiente = charges.reduce((a, c) => a + c.montoPendiente, 0);
  const ultimoMes = collection[collection.length - 1];
  const pctRecaud =
    ultimoMes && ultimoMes.proyectado > 0
      ? Math.round((ultimoMes.recaudado / ultimoMes.proyectado) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Panel principal
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Vista de avance con datos de demostración (sin backend).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Alumnos matriculados
            </CardTitle>
            <GraduationCap className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{matriculados}</p>
            <p className="text-muted-foreground text-xs">
              {prospects.length} prospectos en pipeline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo moroso (demo)</CardTitle>
            <TrendingDown className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              S/ {moraPendiente.toLocaleString("es-PE")}
            </p>
            <p className="text-muted-foreground text-xs">
              {morosity.length} apoderados en reporte
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Recaudación {ultimoMes?.mes ?? ""}
            </CardTitle>
            <Wallet className="text-muted-foreground size-4" />
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
            <CardTitle className="text-sm font-medium">Comunicados</CardTitle>
            <Bell className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{bulletins.length}</p>
            <p className="text-muted-foreground text-xs">publicados (mock)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
            <CardDescription>
              Navega a los módulos definidos en el documento de requerimientos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "inline-flex items-center gap-1.5",
              )}
              href="/admision/prospectos"
            >
              Admisión
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "inline-flex items-center gap-1.5",
              )}
              href="/tesoreria/pagos"
            >
              Pagos
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "inline-flex items-center gap-1.5",
              )}
              href="/comunicacion/muro"
            >
              Muro
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "inline-flex items-center gap-1.5",
              )}
              href="/reportes/morosidad"
            >
              Morosidad
              <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documentación del alcance</CardTitle>
            <CardDescription>
              Exclusiones explícitas y atributos de calidad (sección 6 y 7).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className={cn(buttonVariants({ variant: "default" }))}
              href="/acerca"
            >
              Ver acerca del prototipo
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
