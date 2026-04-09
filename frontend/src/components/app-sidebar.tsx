"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  LayoutDashboard,
  Megaphone,
  School,
  ScrollText,
  Settings,
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

const nav = [
  {
    label: "General",
    items: [
      { href: "/", title: "Panel", icon: LayoutDashboard },
      { href: "/acerca", title: "Acerca / NFR", icon: ScrollText },
    ],
  },
  {
    label: "Admisión",
    items: [
      { href: "/admision/prospectos", title: "Prospectos", icon: UserPlus },
      { href: "/admision/alumnos", title: "Ficha alumno", icon: School },
      { href: "/admision/apoderados", title: "Apoderados", icon: Users },
      { href: "/admision/matricula", title: "Matrícula", icon: ClipboardList },
    ],
  },
  {
    label: "Tesorería",
    items: [
      { href: "/tesoreria/tarifario", title: "Tarifario", icon: Wallet },
      { href: "/tesoreria/deuda-masiva", title: "Deuda masiva", icon: BarChart3 },
      { href: "/tesoreria/pagos", title: "Pagos", icon: CreditCard },
      { href: "/tesoreria/caja-diaria", title: "Caja diaria", icon: Wallet },
      { href: "/tesoreria/facturacion", title: "Facturación", icon: FileSpreadsheet },
    ],
  },
  {
    label: "Asistencia",
    items: [
      { href: "/asistencia/horarios", title: "Horarios", icon: Settings },
      { href: "/asistencia/marcacion", title: "Marcación", icon: ClipboardList },
      { href: "/asistencia/reportes", title: "Reportes RR.HH.", icon: BarChart3 },
    ],
  },
  {
    label: "Comunicación",
    items: [
      { href: "/comunicacion/muro", title: "Muro", icon: Megaphone },
      { href: "/comunicacion/notificaciones", title: "Notificaciones", icon: Bell },
      { href: "/comunicacion/alertas-deuda", title: "Alertas deuda", icon: Bell },
    ],
  },
  {
    label: "Reportes",
    items: [
      { href: "/reportes/morosidad", title: "Morosidad", icon: BarChart3 },
      { href: "/reportes/recaudacion", title: "Recaudación", icon: Wallet },
      { href: "/reportes/siagie", title: "Export SIAGIE", icon: FileSpreadsheet },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/config/auditoria", title: "Auditoría", icon: Settings },
      { href: "/login", title: "Login (mock)", icon: Users },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

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
              Demo
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {nav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/"
                      ? pathname === "/"
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
