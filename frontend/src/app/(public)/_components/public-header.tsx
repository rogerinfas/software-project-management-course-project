import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 h-16 md:px-8">
        <Link href="/" className="flex items-center gap-3 group">
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
            href="/dashboard"
            className={cn(buttonVariants({ size: "sm", variant: "default" }), "shadow-lg shadow-primary/20 cursor-pointer")}
          >
            Intranet
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
