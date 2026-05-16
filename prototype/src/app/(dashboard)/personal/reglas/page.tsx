"use client";

import * as React from "react";
import { Gavel, AlertCircle, Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useDemoData } from "@/context/demo-data-context";
import type { SanctionRule } from "@/lib/mock/types";

export default function ReglasPage() {
  const { sanctionRules, toggleSanctionRule, updateSanctionRule } = useDemoData();

  const handleUpdate = (id: string, monto: string) => {
    updateSanctionRule(id, { multaPorMinuto: Number(monto) });
  };

  const calcularMultaPorMinutos = (minutos: number, rules: SanctionRule[]) => {
    const activa = rules.find((r) => r.activa);
    if (!activa) return 0;
    return minutos * activa.multaPorMinuto;
  };

  const ESCENARIOS = [5, 15, 30, 60];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">E-3 · Motor de reglas y sanciones</h1>
        <p className="text-muted-foreground text-sm">
          Configuración de penalidades económicas y umbrales de tolerancia para el personal.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="size-4 text-primary" />
                  <CardTitle className="text-base">Reglas de Asistencia</CardTitle>
                </div>
                <Badge variant="outline" className="bg-white">Motor V1.0</Badge>
              </div>
              <CardDescription>
                Define qué regla se aplica actualmente para el cálculo de descuentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {sanctionRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      rule.activa ? "bg-primary/5 border-primary shadow-sm" : "bg-muted/10 opacity-60"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{rule.nombre}</span>
                        {rule.activa && (
                          <Badge className="bg-primary text-[8px] h-3 uppercase font-black">Activa</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Sanción: S/ {rule.multaPorMinuto.toFixed(2)} por cada minuto de tardanza.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-[10px] font-bold">Monto:</Label>
                        <Input
                          type="number"
                          step="0.1"
                          className="w-20 h-8 text-xs font-mono"
                          defaultValue={rule.multaPorMinuto}
                          onBlur={(e) => handleUpdate(rule.id, e.target.value)}
                        />
                      </div>
                      <Switch
                        checked={rule.activa}
                        onCheckedChange={() => toggleSanctionRule(rule.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
             <CardHeader className="pb-2">
               <div className="flex items-center gap-2 text-orange-700">
                 <AlertCircle className="size-4" />
                 <CardTitle className="text-sm">Nota sobre Tolerancia</CardTitle>
               </div>
             </CardHeader>
             <CardContent>
               <p className="text-xs text-orange-600 leading-relaxed">
                 La tolerancia (ej. 5 min) se descuenta del cálculo total de minutos. Si un trabajador tiene 5 min de tolerancia y llega 7 min tarde, solo se sancionan 2 min. Esta configuración es <strong>individual</strong> y se edita en el expediente de cada trabajador (RR.HH.).
               </p>
             </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gavel className="size-4 text-primary" />
              <CardTitle className="text-base">Simulador de Descuentos</CardTitle>
            </div>
            <CardDescription>
              Previsualización de multas según la regla activa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tardanza Neta</TableHead>
                  <TableHead className="text-right">Multa Aplicada</TableHead>
                  <TableHead className="text-right">Severidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ESCENARIOS.map((min) => {
                  const multa = calcularMultaPorMinutos(min, sanctionRules);
                  return (
                    <TableRow key={min}>
                      <TableCell className="font-mono text-xs">
                        {min} minutos
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-bold text-destructive">
                        S/ {multa.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={min >= 30 ? "destructive" : "secondary"}
                          className="text-[9px] uppercase h-4"
                        >
                          {min >= 60 ? "Crítico" : min >= 30 ? "Severo" : "Leve"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            <div className="mt-6 rounded-lg bg-muted p-4">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Fórmula Activa</span>
                  <Badge variant="outline" className="text-[9px]">Calculado en tiempo real</Badge>
               </div>
               <p className="font-mono text-xs text-primary bg-white p-3 rounded border">
                  Total_Multa = (Minutos_Tardanza - Tolerancia_Individual) * Monto_Regla_Activa
               </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
