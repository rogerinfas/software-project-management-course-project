"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { 
  LogOutIcon, 
  UserIcon, 
  MailIcon, 
  ShieldCheckIcon, 
  Loader2Icon,
  ChevronDownIcon
} from "lucide-react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { backend } from "@/lib/api/types/backend";

const ROUTE_TRANSLATIONS: Record<string, string> = {
  about: "Acerca de",
  admission: "Admisión",
  enrollment: "Matrícula",
  academic: "Académica",
  treasury: "Tesorería",
  staff: "Personal",
};

// Function to format the current breadcrumb/section title based on path
function getSectionTitle(pathname: string): string {
  if (pathname === "/") return "Inicio";
  
  const parts = pathname.split("/").filter(Boolean);
  return parts
    .map(p => {
      const translated = ROUTE_TRANSLATIONS[p.toLowerCase()];
      if (translated) return translated;
      return p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " ");
    })
    .join(" · ");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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

  const { user } = sessionData as any;
  const userInitials = user.name 
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() 
    : "US";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-svh flex flex-col">
        {/* Header premium con trigger, titulo dinámico, toggle theme y menú de usuario */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-card/50 backdrop-blur-md px-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 shrink-0" />
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="text-muted-foreground text-sm font-medium hidden sm:block">
              {getSectionTitle(pathname)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Selector de Tema */}
            <ModeToggle />

            {/* Menú de Usuario interactivo (Dropdown) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-9 rounded-full pl-2 pr-3 gap-2 hover:bg-accent border border-border/40 cursor-pointer flex items-center justify-center">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] font-bold bg-primary text-primary-foreground shadow-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold text-foreground/80 max-w-[120px] truncate hidden md:inline-block">
                  {user.name}
                </span>
                <ChevronDownIcon className="size-3 text-muted-foreground/60 hidden md:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-xs gap-2 py-2">
                    <ShieldCheckIcon className="size-4 text-primary shrink-0" />
                    <span>Rol: <strong className="uppercase font-bold text-primary">{user.role || "Usuario"}</strong></span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs gap-2 py-2">
                    <UserIcon className="size-4 text-muted-foreground shrink-0" />
                    <span className="truncate max-w-[160px]">ID: {user.id}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOutMutation.mutate({})}
                  disabled={signOutMutation.isPending}
                  className="text-xs text-destructive focus:bg-destructive/10 focus:text-destructive gap-2 py-2 cursor-pointer"
                >
                  {signOutMutation.isPending ? (
                    <Loader2Icon className="size-4 animate-spin shrink-0" />
                  ) : (
                    <LogOutIcon className="size-4 shrink-0" />
                  )}
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Contenedor del contenido principal */}
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-background/30">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
