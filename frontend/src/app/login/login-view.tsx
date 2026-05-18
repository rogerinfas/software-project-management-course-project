"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  PaletteIcon,
  PencilIcon,
  RulerIcon,
  SearchIcon,
  Loader2Icon,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { backend } from "@/lib/api/types/backend";

function DecoIcon({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "text-primary-foreground/15 pointer-events-none absolute select-none",
        className,
      )}
      aria-hidden
    >
      {children}
    </div>
  );
}

export function LoginView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [remember, setRemember] = React.useState(false);

  // Connection with Better Auth via OpenAPI React Query Mutation
  const loginMutation = backend.useMutation("post", "/api/auth/sign-in/email", {
    onSuccess: async () => {
      toast.success("¡Inicio de sesión exitoso!");
      
      // Invalidate current session query to refresh UI state
      await queryClient.invalidateQueries({
        queryKey: ["get", "/api/auth/get-session"],
      });

      router.refresh();
      router.push("/");
    },
    onError: (error: any) => {
      console.error("Login Error details:", error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error.message as string)
          : "Credenciales incorrectas o error en el servidor";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Por favor complete todos los campos");
      return;
    }
    
    loginMutation.mutate({
      body: {
        email,
        password,
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col">
      <div className="grid flex-1 lg:grid-cols-2">
        {/* Panel marca — solo lg+ */}
        <aside
          className="relative hidden overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-10"
          style={{
            background:
              "linear-gradient(145deg, oklch(0.2 0.05 265) 0%, oklch(0.14 0.038 270) 45%, oklch(0.11 0.04 275) 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, oklch(0.55 0.14 252) 0%, transparent 45%),
                radial-gradient(circle at 80% 70%, oklch(0.45 0.1 258) 0%, transparent 40%)`,
            }}
          />
          <DecoIcon className="top-10 left-8 rotate-[-12deg]">
            <RulerIcon className="size-16 stroke-[1.25]" />
          </DecoIcon>
          <DecoIcon className="top-24 right-12 rotate-[18deg]">
            <PencilIcon className="size-14 stroke-[1.25]" />
          </DecoIcon>
          <DecoIcon className="bottom-32 left-10 rotate-[8deg]">
            <BookOpen className="size-20 stroke-[1.25]" />
          </DecoIcon>
          <DecoIcon className="bottom-20 right-16 rotate-[-22deg]">
            <SearchIcon className="size-16 stroke-[1.25]" />
          </DecoIcon>
          <DecoIcon className="top-1/2 right-8 -translate-y-1/2 rotate-[6deg]">
            <PaletteIcon className="size-12 stroke-[1.25]" />
          </DecoIcon>

          <div className="relative z-[1] flex max-w-md flex-col items-center text-center">
            <Image
              src="/logo-iep-madre-santa-beatriz.png"
              alt="Escudo IEP Madre Santa Beatriz"
              width={140}
              height={140}
              className="drop-shadow-[0_12px_32px_oklch(0_0_0/0.35)]"
              priority
            />
            <h1 className="mt-8 text-2xl font-semibold tracking-tight text-white">
              IEP Madre Santa Beatriz
            </h1>
            <p className="mt-2 text-sm text-white/75">
              Plataforma de gestión administrativa · Arequipa
            </p>
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-white/55">
              Acceso para personal autorizado. Este entorno está conectado de forma segura con el servidor.
            </p>
          </div>

          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 opacity-20"
            style={{
              background:
                "linear-gradient(to top, oklch(0.08 0.03 270), transparent)",
            }}
          />
        </aside>

        {/* Formulario */}
        <main className="bg-muted/25 flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:py-12">
          <Card className="w-full max-w-md border-0 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
            <CardContent className="space-y-8 pt-10 pb-2 sm:px-10">
              <div className="flex flex-col items-center gap-4 lg:hidden">
                <Image
                  src="/logo-iep-madre-santa-beatriz.png"
                  alt="IEP Madre Santa Beatriz"
                  width={88}
                  height={88}
                  className="object-contain"
                  priority
                />
                <p className="text-muted-foreground text-center text-xs">
                  IEP Madre Santa Beatriz
                </p>
              </div>

              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-2xl font-semibold tracking-tight">
                  ¡Bienvenidos de nuevo!
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Bienvenidos a su plataforma. Su experiencia comienza aquí.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground/90">
                    Email
                  </Label>
                  <div className="relative">
                    <MailIcon className="text-muted-foreground pointer-events-none absolute bottom-2.5 left-0 size-4" />
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingrese su correo electrónico"
                      className="border-input rounded-none border-0 border-b bg-transparent pl-7 shadow-none ring-0 focus-visible:border-primary focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-pass" className="text-foreground/90">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-pass"
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingrese su contraseña"
                      className="border-input rounded-none border-0 border-b bg-transparent pr-10 shadow-none ring-0 focus-visible:border-primary focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="text-muted-foreground hover:text-foreground absolute right-0 bottom-2 p-0.5 transition-colors"
                      aria-label={
                        showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                    >
                      {showPass ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <Label
                    htmlFor="remember"
                    className="text-muted-foreground cursor-pointer text-sm font-normal"
                  >
                    Recordar detalles del login
                  </Label>
                  <Switch
                    id="remember"
                    checked={remember}
                    onCheckedChange={setRemember}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="h-11 w-full rounded-lg text-base cursor-pointer"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-8 sm:px-10">
              <p className="text-muted-foreground text-center text-xs">
                ¿No puedes iniciar sesión?{" "}
                <a
                  href="mailto:secretaria@iepmsb.edu.pe"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Contáctanos
                </a>
              </p>
            </CardFooter>
          </Card>
        </main>
      </div>

      <footer className="text-muted-foreground border-border/60 border-t py-3 text-center text-[0.7rem] sm:text-xs">
        © {new Date().getFullYear()} IEP Madre Santa Beatriz. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
