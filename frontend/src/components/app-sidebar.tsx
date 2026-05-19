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
      { href: "/about", title: "Alcance EDT", icon: ScrollText },
      { href: "/landing", title: "Landing pública", icon: Globe2 },
    ],
  },
  {
    label: "Admisión (M1)",
    items: [
      { href: "/admission/config", title: "Config. proceso", icon: Settings2 },
      { href: "/admission/pipeline", title: "CRM / Pipeline", icon: UserPlus },
      { href: "/admission/citas", title: "Agenda de Citas", icon: CalendarCheck },
      { href: "/admission/documentos", title: "Documentos", icon: FolderOpen },
      { href: "/admission/evaluacion", title: "Evaluación / Dictamen", icon: ClipboardCheck },
    ],
  },
  {
    label: "Matrícula (M2)",
    items: [
      { href: "/enrollment/expediente", title: "Expediente familiar", icon: Users },
      { href: "/enrollment/apoderados", title: "Gestión de Apoderados", icon: UserCheck },
      { href: "/enrollment/formalizacion", title: "Formalización / Asignación", icon: ClipboardList },
      { href: "/enrollment/documentos", title: "Ficha de Matrícula", icon: FileBadge },
    ],
  },
  {
    label: "Académica & Comunicación (M3)",
    items: [
      { href: "/academic/malla", title: "Malla curricular", icon: BookOpen },
      { href: "/academic/carga-docente", title: "Carga docente", icon: GraduationCap },
      { href: "/academic/secciones", title: "Registro de Secciones", icon: LayoutGrid },
      { href: "/academic/horarios", title: "Gestión de Horarios", icon: CalendarClock },
      { href: "/academic/comunicados", title: "Panel de Comunicados", icon: Megaphone },
    ],
  },
  {
    label: "Tesorería (M4)",
    items: [
      { href: "/treasury/tarifario", title: "Tarifario", icon: Wallet },
      { href: "/treasury/cobranzas", title: "Cobranzas", icon: Coins },
      { href: "/treasury/comprobantes", title: "Comprobantes", icon: Receipt },
    ],
  },
  {
    label: "Personal & Asistencia (M5)",
    items: [
      { href: "/staff/rrhh", title: "RR.HH.", icon: UserCog },
      { href: "/staff/reconocimiento", title: "Reconocimiento facial", icon: Fingerprint },
      { href: "/staff/reglas", title: "Reglas y sanciones", icon: Gavel },
      { href: "/staff/pre-planilla", title: "Pre-planilla", icon: FileText },
    ],
  },
  {
    label: "Sistema",
    items: [{ href: "/login", title: "Login (mock)", icon: School }],
  },
  {
    label: "Extras",
    items: [
      { href: "/academic/malla", title: "Ir a malla", icon: GraduationCap },
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
