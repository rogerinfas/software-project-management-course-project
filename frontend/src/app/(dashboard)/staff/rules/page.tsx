"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Sliders, Clock, DollarSign, Save, Loader2, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backend } from "@/lib/api/types/backend";

export default function RulesPage() {
  const queryClient = useQueryClient();

  // Form states
  const [gracePeriod, setGracePeriod] = React.useState("5");
  const [finePerMinute, setFinePerMinute] = React.useState("0.5");

  // Simulated calculations state
  const [testMinutes, setTestMinutes] = React.useState("15");

  // Queries
  const { data: rules, isLoading } = backend.useQuery(
    "get",
    "/api/staff/rules",
    { params: { query: {} as any } }
  );

  // Sync state with queried data once loaded
  React.useEffect(() => {
    if (rules) {
      setGracePeriod(String(rules.gracePeriodMinutes));
      setFinePerMinute(String(rules.finePerMinute));
    }
  }, [rules]);

  // Mutations
  const updateMutation = backend.useMutation("put", "/api/staff/rules", {
    onSuccess: () => {
      toast.success("Reglamento de asistencia actualizado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/staff/rules"] });
      // Invalidate attendance logs so penalties are updated
      queryClient.invalidateQueries({ queryKey: ["get", "/api/staff/attendance"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al actualizar las reglas de asistencia");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      body: {
        gracePeriodMinutes: parseInt(gracePeriod, 10),
        finePerMinute: parseFloat(finePerMinute),
      },
    });
  };

  // Live calculator calculation
  const simulatedFine = React.useMemo(() => {
    const min = parseInt(testMinutes, 10) || 0;
    const grace = parseInt(gracePeriod, 10) || 0;
    const rate = parseFloat(finePerMinute) || 0.0;

    if (min <= grace) return 0.0;
    return min * rate;
  }, [testMinutes, gracePeriod, finePerMinute]);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 5 · Reglamento y Tolerancia</h1>
          <p className="text-muted-foreground text-sm">
            Establezca los parámetros de tiempo de gracia escolar y penalidad contable por minuto de tardanza.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Formulario de Configuración (Izquierda) */}
        <Card className="md:col-span-7 bg-card/50 backdrop-blur-sm border-border/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              Parámetros de Reglamento
            </CardTitle>
            <CardDescription>
              Ajustes globales para la validación automática del terminal biométrico.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                Cargando políticas de asistencia...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Minutos de Gracia */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="grace" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Minutos de Gracia Globals
                    </Label>
                    <span className="text-xs font-black text-amber-500">{gracePeriod} minutos</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                    <Input
                      id="grace"
                      type="number"
                      min="0"
                      max="60"
                      className="bg-background/50 border-border/40 rounded-xl"
                      value={gracePeriod}
                      onChange={(e) => setGracePeriod(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 leading-relaxed pl-9">
                    Margen de tiempo concedido después de la hora oficial de entrada para que el empleado marque como puntual.
                  </p>
                </div>

                {/* Multa por Minuto */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="fine" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Costo de Multa por Minuto
                    </Label>
                    <span className="text-xs font-black text-red-500">S/ {parseFloat(finePerMinute).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <DollarSign className="w-5 h-5 text-muted-foreground shrink-0" />
                    <Input
                      id="fine"
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="10.00"
                      className="bg-background/50 border-border/40 rounded-xl"
                      value={finePerMinute}
                      onChange={(e) => setFinePerMinute(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 leading-relaxed pl-9">
                    Monto cobrado/deducido por cada minuto transcurrido de tardanza si se supera la tolerancia global.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full cursor-pointer mt-4"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando Cambios...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Configuración
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Simulador Interactivo de Tardanzas (Derecha) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/80">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-md flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Calculadora Interactiva
              </CardTitle>
              <CardDescription>
                Simule una tardanza para previsualizar deducciones aplicables inmediatamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-min" className="text-xs font-semibold text-muted-foreground">
                  Minutos de Retraso de Prueba
                </Label>
                <Input
                  id="test-min"
                  type="number"
                  min="0"
                  max="120"
                  value={testMinutes}
                  onChange={(e) => setTestMinutes(e.target.value)}
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-sm border-b border-border/20 pb-2">
                  <span className="text-muted-foreground">Minutos de Tolerancia</span>
                  <span className="font-semibold">{gracePeriod} min</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border/20 pb-2">
                  <span className="text-muted-foreground">Estado Simulación</span>
                  {parseInt(testMinutes, 10) > parseInt(gracePeriod, 10) ? (
                    <span className="text-red-500 font-bold text-xs">MULTA APLICADA</span>
                  ) : (
                    <span className="text-emerald-500 font-bold text-xs">EXENTO (A TIEMPO)</span>
                  )}
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold">Multa Proyectada</span>
                  <span className={`text-xl font-bold ${simulatedFine > 0 ? "text-red-500" : "text-emerald-500"}`}>
                    S/ {simulatedFine.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Importante del Reglamento */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/80">
            <CardContent className="pt-6 space-y-3">
              <div className="flex gap-2 items-start text-primary">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <h4 className="font-bold text-sm">Reglamento Escolar</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Si un docente o administrativo marca su llegada después del límite de tolerancia, se cobrará la multa multiplicada por la <strong>totalidad de los minutos transcurridos</strong> desde la hora de entrada configurada.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2 mt-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Sincronización automática de planilla activa
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
