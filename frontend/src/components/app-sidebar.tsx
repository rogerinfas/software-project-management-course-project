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

const nav = [
  {
    label: "General",
    items: [
      { href: "/", title: "Panel", icon: LayoutDashboard },
      { href: "/landing", title: "Landing pública", icon: Globe2 },
    ],
  },
  {
    label: "Admisión (M1)",
    items: [
      { href: "/admission/config", title: "Config. proceso", icon: Settings2 },
      { href: "/admission/pipeline", title: "CRM / Pipeline", icon: UserPlus },
      { href: "/admission/appointments", title: "Agenda de Citas", icon: CalendarCheck },
      { href: "/admission/documents", title: "Documentos", icon: FolderOpen },
      { href: "/admission/evaluation", title: "Evaluación / Dictamen", icon: ClipboardCheck },
    ],
  },
  {
    label: "Matrícula (M2)",
    items: [
      { href: "/enrollment/guardians", title: "Gestión de Apoderados", icon: UserCheck },
      { href: "/enrollment/formalization", title: "Formalización / Asignación", icon: ClipboardList },
      { href: "/enrollment/documents", title: "Ficha de Matrícula", icon: FileBadge },
      { href: "/enrollment/family-records", title: "Expediente familiar", icon: Users },
    ],
  },
  {
    label: "Académica & Comunicación (M3)",
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
    items: [
      { href: "/treasury/tariffs", title: "Tarifario", icon: Wallet },
      { href: "/treasury/collections", title: "Cobranzas", icon: Coins },
      { href: "/treasury/receipts", title: "Comprobantes", icon: Receipt },
    ],
  },
  {
    label: "Personal & Asistencia (M5)",
    items: [
      { href: "/staff/hr", title: "RR.HH.", icon: UserCog },
      { href: "/staff/facial-recognition", title: "Reconocimiento facial", icon: Fingerprint },
      { href: "/staff/rules", title: "Reglas y sanciones", icon: Gavel },
      { href: "/staff/pre-payroll", title: "Pre-planilla", icon: FileText },
    ],
  },
  {
    label: "Sistema",
    items: [{ href: "/login", title: "Login (mock)", icon: School }],
  },
  {
    label: "Extras",
    items: [
      { href: "/academic/curriculum", title: "Ir a malla", icon: GraduationCap },
    ],
    hidden: true,
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
              EDT · demo
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {nav
          .filter((g) => !g.hidden)
          .map((group) => (
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
