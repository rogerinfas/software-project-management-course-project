import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Globe, Camera, MessageCircle } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-muted/50 border-t pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
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
              <Link href="/dashboard" className="hover:text-primary transition-colors">Acceso Intranet</Link>
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
  );
}
