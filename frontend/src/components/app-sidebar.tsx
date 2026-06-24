"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarCheck,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  Coins,
  ExternalLink,
  FileBadge,
  FileText,
  Fingerprint,
  FolderOpen,
  Gavel,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  Receipt,
  School,
  ScrollText,
  Settings2,
  Terminal,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { type Role, ALL_ROLES } from "@/lib/role-permissions";

// URL del backend — usada para el link directo a los API docs
const BACKEND_DOCS_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://localhost:5000") + "/api/docs";

/**
 * Mapeo de visibilidad de módulos por rol.
 * Los prefijos de ruta y roles permitidos se definen en @/lib/role-permissions.
 * Esta configuración controla únicamente la visibilidad en el sidebar.
 *
 * ADMIN     → todo
 * ADMISSION → M1 (Admisión) + M2 (Matrícula)
 * TREASURY  → M4 (Tesorería)
 * TEACHER   → M3 (Académica & Comunicación)
 * STAFF     → M2 (Matrícula)
 */
const nav = [
  {
    label: "General",
    roles: ALL_ROLES,
    items: [
      { href: "/dashboard", title: "Panel", icon: LayoutDashboard },
      { href: "/", title: "Landing pública", icon: Globe2 },
    ],
  },
  {
    label: "Admisión (M1)",
    roles: ["ADMIN", "ADMISSION"] as Role[],
    items: [
      { href: "/admission/pipeline", title: "CRM / Pipeline", icon: UserPlus },
      { href: "/admission/appointments", title: "Agenda de Citas", icon: CalendarCheck },
      { href: "/admission/documents", title: "Documentos", icon: FolderOpen },
      { href: "/admission/evaluation", title: "Evaluación / Dictamen", icon: ClipboardCheck },
    ],
  },
  {
    label: "Matrícula (M2)",
    roles: ["ADMIN", "ADMISSION", "STAFF"] as Role[],
    items: [
      { href: "/enrollment/guardians", title: "Gestión de Apoderados", icon: UserCheck },
      { href: "/enrollment/formalization", title: "Formalización / Asignación", icon: ClipboardList },
      { href: "/enrollment/documents", title: "Ficha de Matrícula", icon: FileBadge },
      { href: "/enrollment/family-records", title: "Expediente familiar", icon: Users },
    ],
  },
  {
    label: "Académica & Comunicación (M3)",
    roles: ["ADMIN", "TEACHER"] as Role[],
    items: [
      { href: "/academic/curriculum", title: "Malla curricular", icon: BookOpen },
      { href: "/academic/teacher-load", title: "Carga docente", icon: GraduationCap },
      { href: "/academic/sections", title: "Registro de Secciones", icon: LayoutGrid },
      { href: "/academic/schedules", title: "Gestión de Horarios", icon: CalendarClock },
      { href: "/academic/announcements", title: "Panel de Comunicados", icon: Megaphone },
    ],
  },
  {
    label: "Tesorería (M4)",
    roles: ["ADMIN", "TREASURY"] as Role[],
    items: [
      { href: "/treasury/tariffs", title: "Tarifario", icon: Wallet },
      { href: "/treasury/collections", title: "Cobranzas", icon: Coins },
      { href: "/treasury/receipts", title: "Comprobantes", icon: Receipt },
    ],
  },
  {
    label: "Administración",
    roles: ["ADMIN"] as Role[],
    items: [
      {
        href: BACKEND_DOCS_URL,
        title: "Probar Backend (API Docs)",
        icon: Terminal,
        external: true,
      },
    ],
  },
];

interface AppSidebarProps {
  /** Rol del usuario activo, obtenido de /api/auth/get-session */
  role?: Role;
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();

  // Filtrar grupos según el rol. Si no hay rol (carga), mostrar solo General.
  const visibleGroups = nav.filter((group) =>
    role ? group.roles.includes(role) : group.label === "General"
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md p-1 outline-none ring-sidebar-ring focus-visible:ring-2 group-data-[collapsible=icon]:justify-center"
        >
          <Image
            src="/logo-iep-madre-santa-beatriz.png"
            alt="Escudo del IEP Madre Santa Beatriz"
            width={48}
            height={48}
            className="size-11 shrink-0 object-contain group-data-[collapsible=icon]:size-9"
            priority
          />
          <div className="flex min-w-0 flex-col gap-0.5 leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sidebar-foreground text-sm font-semibold">
              IEP Madre Santa Beatriz
            </span>
            <span className="text-sidebar-foreground/70 text-xs">
              Gestión administrativa · Arequipa
            </span>
            <span className="text-sidebar-foreground/60 text-[0.65rem] font-medium uppercase tracking-wide">
              EDT · demo
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {visibleGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isExternal = "external" in item && item.external;

                  // Items externos: abrir en nueva pestaña sin pasar por el router de Next.js
                  if (isExternal) {
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          render={
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                        >
                          <Icon />
                          <span>{item.title}</span>
                          <ExternalLink className="ml-auto size-3 opacity-50 shrink-0" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }

                  // Items internos: navegación normal con Next.js Link
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.title}
                        render={<Link href={item.href} />}
                      >
                        <Icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
