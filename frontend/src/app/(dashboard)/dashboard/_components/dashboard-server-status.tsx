import * as React from "react";
import { CheckCircle2Icon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardServerStatus() {
  return (
    <Card className="border bg-card/20 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <CheckCircle2Icon className="size-4 text-emerald-500" />
          Conectividad del Servidor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <p className="text-xs text-muted-foreground">
          Conexión activa con el servidor en el puerto <strong className="text-foreground font-semibold">5000</strong>. Todos los servicios de base de datos y autenticación están en línea y sincronizados.
        </p>
      </CardContent>
    </Card>
  );
}
