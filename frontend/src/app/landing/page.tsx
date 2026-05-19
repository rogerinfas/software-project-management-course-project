"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Users,
  ArrowRight,
  GraduationCap,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Camera,
  MessageCircle,
  Globe,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

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

const STATIC_BULLETINS = [
  {
    id: "bul-1",
    titulo: "Reunión general de padres — mayo",
    cuerpo:
      "Se convoca a los padres de familia a la reunión presencial en el auditorio principal para la entrega de información del primer bimestre y coordinación académica.",
    categoria: "administrativo" as BulletinCategory,
    visibilidad: "publico",
    publicadoEn: "2026-05-05",
    vigenteHasta: "2026-05-30",
    autor: "Dirección",
  },
  {
    id: "bul-2",
    titulo: "Salida pedagógica de Inicial al Parque de la Identidad",
    cuerpo:
      "Las docentes de Inicial 5 años comunican la salida pedagógica. Se solicita enviar la autorización firmada y la lista de materiales requeridos.",
    categoria: "academico" as BulletinCategory,
    visibilidad: "publico",
    publicadoEn: "2026-05-07",
    vigenteHasta: "2026-05-25",
    autor: "Coordinación Inicial",
  },
  {
    id: "bul-3",
    titulo: "Aniversario del colegio — semana cultural",
    cuerpo:
      "Celebramos la semana cultural por el aniversario institucional con olimpiadas de matemática, concursos literarios y danzas por grado.",
    categoria: "evento" as BulletinCategory,
    visibilidad: "publico",
    publicadoEn: "2026-05-10",
    vigenteHasta: "2026-06-10",
    autor: "Dirección",
  },
];

export default function LandingPage() {
  const hoy = new Date().toISOString().slice(0, 10);
  const publicos = STATIC_BULLETINS
    .filter((b) => b.visibilidad === "publico" && b.vigenteHasta >= hoy)
    .sort((a, b) => (a.publicadoEn < b.publicadoEn ? 1 : -1));

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 h-16 md:px-8">
          <Link href="/landing" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/logo-iep-madre-santa-beatriz.png"
                alt="IEP Madre Santa Beatriz"
                width={40}
                height={40}
                className="size-10 object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold tracking-tight">IEP Madre Santa Beatriz</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                Arequipa · Excelencia Educativa
              </p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#inicio" className="hover:text-primary transition-colors">Inicio</Link>
            <Link href="#comunicados" className="hover:text-primary transition-colors">Comunicados</Link>
            <Link href="#admision" className="hover:text-primary transition-colors">Admisión</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "hidden sm:inline-flex cursor-pointer")}
            >
              Intranet
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm", variant: "default" }), "shadow-lg shadow-primary/20 cursor-pointer")}
            >
              Iniciar Sesión
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="space-y-2 text-center">
                <div className="flex justify-center">
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <Users className="size-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold">450+</p>
                <p className="text-sm text-muted-foreground font-medium">Alumnos Felices</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="flex justify-center">
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <GraduationCap className="size-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold">25+</p>
                <p className="text-sm text-muted-foreground font-medium">Años de Excelencia</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="flex justify-center">
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <Award className="size-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground font-medium">Calidad Académica</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="flex justify-center">
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <ShieldCheck className="size-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold">Cert.</p>
                <p className="text-sm text-muted-foreground font-medium">Entorno Seguro</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bulletins Section */}
        <section id="comunicados" className="py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Comunicados Recientes</h2>
              <p className="max-w-2xl text-muted-foreground text-lg">
                Mantente informado sobre las últimas novedades, eventos y avisos importantes de nuestra institución.
              </p>
            </div>

            {publicos.length === 0 ? (
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
                    <div className="px-6 pb-6 pt-2">
                      <button className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                        Leer más <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Admission */}
        <section id="admision" className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 md:px-16 md:py-20 text-primary-foreground shadow-2xl">
              <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20">
                <GraduationCap size={400} strokeWidth={1} />
              </div>
              <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                    Inicia el camino al éxito académico de tus hijos
                  </h2>
                  <p className="max-w-2xl text-lg text-primary-foreground/80">
                    Nuestro proceso de admisión 2026 ya está abierto. Contamos con vacantes limitadas para Inicial y Primaria. Únete a una comunidad que prioriza los valores y la formación integral.
                  </p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Excelencia académica demostrada",
                      "Plana docente altamente calificada",
                      "Infraestructura moderna y segura",
                      "Talleres extracurriculares variados",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle className="size-5 shrink-0 text-primary-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    href="/admision/pipeline"
                    className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "h-14 px-10 text-base font-bold shadow-xl cursor-pointer flex items-center justify-center")}
                  >
                    Registrarse como Prospecto
                  </Link>
                  <p className="text-center text-xs text-primary-foreground/60 font-medium">
                    Urb. La Estrella s/n J. L. B. y R., Arequipa, Peru.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
            <div className="space-y-4">
              <Link href="/landing" className="flex items-center gap-3 group">
                <Image
                  src="/logo-iep-madre-santa-beatriz.png"
                  alt="IEP Madre Santa Beatriz"
                  width={32}
                  height={32}
                  className="size-8 object-contain"
                />
                <span className="font-bold">Madre Santa Beatriz</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Formamos niños y jóvenes en un entorno que promueve el desarrollo académico y moral. Sé parte de nuestra familia beatina.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider px-2 py-0">Página · Educación</Badge>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Enlaces Rápidos</h3>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="#inicio" className="hover:text-primary transition-colors">Inicio</Link>
                <Link href="#comunicados" className="hover:text-primary transition-colors">Comunicados</Link>
                <Link href="#admision" className="hover:text-primary transition-colors">Admisión 2026</Link>
                <Link href="/" className="hover:text-primary transition-colors">Acceso Intranet</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Contacto</h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-primary" />
                  <span>941 856 390</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-primary" />
                  <span>secretaria@iepsantabeatriz.edu.pe</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-primary" />
                  <span className="leading-tight">Urb. La Estrella s/n J. L. B. y R., Arequipa</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Link href="https://madresantabeatriz.com" target="_blank" className="p-2 bg-muted rounded-full hover:text-primary transition-colors">
                    <Globe className="size-4" />
                  </Link>
                  <Link href="https://instagram.com/msb_arequipa" target="_blank" className="p-2 bg-muted rounded-full hover:text-primary transition-colors">
                    <Camera className="size-4" />
                  </Link>
                  <Link href="https://wa.link/4g1tzo" target="_blank" className="p-2 bg-muted rounded-full hover:text-primary transition-colors">
                    <MessageCircle className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Horario de Atención</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Lunes a Viernes</p>
                <p className="text-foreground font-semibold text-base">08:00 AM - 04:00 PM</p>
                <p className="pt-2 text-xs opacity-70 italic">Previa cita para entrevistas de admisión.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <p>© {new Date().getFullYear()} IEP Madre Santa Beatriz — Todos los derechos reservados.</p>
            <div className="flex items-center gap-6">
              <span>Prototipo Académico</span>
              <span className="size-1 rounded-full bg-muted-foreground/30"></span>
              <span>Software Project Management</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
