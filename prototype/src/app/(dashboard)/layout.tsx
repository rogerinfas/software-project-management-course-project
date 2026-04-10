import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DemoDataProvider } from "@/context/demo-data-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoDataProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-h-svh">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
            <SidebarTrigger className="-ml-1 shrink-0" />
            <span className="text-muted-foreground text-sm">
              IEP Madre Santa Beatriz · prototipo (datos de prueba)
            </span>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </DemoDataProvider>
  );
}
