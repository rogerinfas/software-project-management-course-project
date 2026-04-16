"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";
import { calcularMultaPorMinutos } from "@/lib/mock/rules";

const ESCENARIOS = [5, 15, 30, 45, 60];

export default function ReglasPage() {
  const { sanctionRules, toggleSanctionRule } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          E-3 · Motor de reglas y sanciones
        </h1>
        <p className="text-muted-foreground text-sm">
          Reglas por tramos de tardanza (minutos). La multa se aplica minuto a
          minuto y se alimenta al reporte de pre-planilla.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reglas actuales</CardTitle>
          <CardDescription>
            Desactiva una regla para excluirla del cálculo sin eliminarla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Desde (min)</TableHead>
                <TableHead className="text-right">Multa por minuto</TableHead>
                <TableHead className="text-right">Activa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sanctionRules.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nombre}</TableCell>
                  <TableCell className="tabular-nums">
                    {r.minutosDesde}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    S/ {r.multaPorMinuto.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={r.activa}
                      onCheckedChange={() => toggleSanctionRule(r.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulador de multa</CardTitle>
          <CardDescription>
            Monto que descontaría la pre-planilla según las reglas activas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tardanza (min)</TableHead>
                <TableHead className="text-right">Multa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ESCENARIOS.map((min) => {
                const multa = calcularMultaPorMinutos(min, sanctionRules);
                return (
                  <TableRow key={min}>
                    <TableCell>
                      {min} min
                      {min >= 30 ? (
                        <Badge variant="destructive" className="ml-2">
                          severo
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      S/ {multa.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
