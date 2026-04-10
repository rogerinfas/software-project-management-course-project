"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDemoData } from "@/context/demo-data-context";

export default function NotificacionesPage() {
  const { notifPrefs, notifEvents } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notificaciones (push / correo)</h1>
        <p className="text-muted-foreground text-sm">
          Preferencias demo y eventos simulados: comunicados y recibos (req.txt).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferencias por canal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifPrefs.map((p) => (
            <div key={p.canal} className="space-y-2">
              <p className="text-sm font-medium capitalize">{p.canal}</p>
              <div className="flex items-center gap-2">
                <Checkbox id={`${p.canal}-c`} checked={p.comunicados} disabled />
                <Label htmlFor={`${p.canal}-c`}>Comunicados</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id={`${p.canal}-r`} checked={p.recibos} disabled />
                <Label htmlFor={`${p.canal}-r`}>Recibo de pago disponible</Label>
              </div>
              <Separator />
            </div>
          ))}
          <p className="text-muted-foreground text-xs">
            En producción estas casillas serían editables y dispararían avisos al
            publicar comunicados o generar recibos.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bandeja simulada</CardTitle>
          <CardDescription>Eventos recientes (mock)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifEvents.map((e) => (
            <div
              key={e.id}
              className="flex flex-col gap-1 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm">{e.mensaje}</p>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{e.fecha}</span>
                <Badge variant={e.leido ? "secondary" : "default"}>
                  {e.leido ? "Leído" : "Nuevo"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
