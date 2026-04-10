"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDemoData } from "@/context/demo-data-context";

export default function AlertasDeudaPage() {
  const { simulateDebtAlerts, charges } = useDemoData();
  const proximas = charges.filter((c) => c.montoPendiente > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Alertas de deuda</h1>
        <p className="text-muted-foreground text-sm">
          Envío masivo de recordatorios 3 días antes del vencimiento (simulación).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaña de recordatorios</CardTitle>
          <CardDescription>
            Cuotas pendientes en el mock: <strong>{proximas}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Al pulsar el botón se añaden notificaciones de tipo
            &quot;alerta_deuda&quot; a la bandeja simulada (véase Notificaciones).
          </p>
          <Button type="button" onClick={() => simulateDebtAlerts()}>
            Simular envío masivo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
