"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { 
  LogOutIcon, 
  UserIcon, 
  MailIcon, 
  ShieldCheckIcon, 
  Loader2Icon,
  CalendarIcon,
  FingerprintIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { backend } from "@/lib/api/types/backend";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query current session status
  const { data: sessionData, isLoading, error } = backend.useQuery("get", "/api/auth/get-session", {
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Logout Mutation
  const signOutMutation = backend.useMutation("post", "/api/auth/sign-out", {
    onSuccess: async () => {
      toast.success("Sesión cerrada correctamente");
      
      // Invalidate all queries and clear cache
      await queryClient.invalidateQueries();
      queryClient.clear();
      
      router.refresh();
      router.push("/login");
    },
    onError: (err: any) => {
      console.error("Sign-out error:", err);
      toast.error("Error al cerrar sesión");
    },
  });

  // Client-side redirection if unauthorized
  React.useEffect(() => {
    if (!isLoading && (!sessionData || error)) {
      router.push("/login");
    }
  }, [sessionData, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background">
        <Loader2Icon className="size-10 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">Cargando sesión de usuario...</p>
      </div>
    );
  }

  if (!sessionData) {
    return null;
  }

  const { user, session } = sessionData as any;
  const userInitials = user.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "US";

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header premium */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-iep-madre-santa-beatriz.png"
              alt="Logo Madre Santa Beatriz"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <h1 className="text-sm font-semibold text-foreground tracking-tight">IEP Madre Santa Beatriz</h1>
              <p className="text-[10px] text-muted-foreground">Sistema de Control Administrativo</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOutMutation.mutate({})}
            disabled={signOutMutation.isPending}
            className="cursor-pointer gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            {signOutMutation.isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <LogOutIcon className="size-4" />
            )}
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Panel de Control General</h2>
            <p className="text-sm text-muted-foreground">Bienvenido al prototipo funcional de gestión institucional</p>
          </div>

          <Card className="border shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden bg-card/60 backdrop-blur-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b pb-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar premium con iniciales */}
                <div className="size-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-semibold text-2xl shadow-inner border border-primary/20">
                  {userInitials}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center sm:justify-start gap-1.5 text-xs">
                    <ShieldCheckIcon className="size-3.5 text-primary" />
                    <span className="font-semibold uppercase tracking-wider text-primary">
                      {user.role || "Usuario Autorizado"}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <h3 className="text-sm font-semibold text-foreground/80 border-b pb-2">Información del Perfil</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                  <div className="p-2 rounded-md bg-background text-muted-foreground border">
                    <UserIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Identificador Único</p>
                    <p className="text-sm font-mono text-foreground/90 truncate max-w-[200px]">{user.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                  <div className="p-2 rounded-md bg-background text-muted-foreground border">
                    <MailIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Correo Electrónico</p>
                    <p className="text-sm text-foreground/90">{user.email}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-foreground/80 border-b pb-2 pt-4">Datos de la Sesión Activa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                  <div className="p-2 rounded-md bg-background text-muted-foreground border">
                    <CalendarIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Expiración de Sesión</p>
                    <p className="text-sm text-foreground/90">
                      {session.expiresAt ? new Date(session.expiresAt).toLocaleString("es-PE") : "N/D"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                  <div className="p-2 rounded-md bg-background text-muted-foreground border">
                    <FingerprintIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Token de Sesión</p>
                    <p className="text-sm font-mono text-foreground/90 truncate max-w-[200px]">{session.token || session.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="text-muted-foreground border-t py-4 text-center text-xs">
        © {new Date().getFullYear()} IEP Madre Santa Beatriz. Todos los derechos reservados.
      </footer>
    </div>
  );
}
