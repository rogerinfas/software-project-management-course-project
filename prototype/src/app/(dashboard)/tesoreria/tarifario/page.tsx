"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoData } from "@/context/demo-data-context";

const TIPO_LABEL: Record<string, string> = {
  unico: "Único",
  mensual: "Mensual",
  extra: "Extra",
};

export default function TarifarioPage() {
  const { tariffConcepts, discounts } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">D-1 · Tarifario</h1>
        <p className="text-muted-foreground text-sm">
          Define los conceptos de cobro (admisión, matrícula, pensiones, extras)
          y las reglas de descuento.
        </p>
      </div>

      <Tabs defaultValue="conceptos">
        <TabsList>
          <TabsTrigger value="conceptos">Conceptos</TabsTrigger>
          <TabsTrigger value="descuentos">Descuentos</TabsTrigger>
        </TabsList>

        <TabsContent value="conceptos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conceptos de tarifario</CardTitle>
              <CardDescription>
                Las pensiones mensuales se generan automáticamente desde
                cobranzas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Meses</TableHead>
                    <TableHead className="text-right">Monto base</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tariffConcepts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{TIPO_LABEL[c.tipo]}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{c.aplicaNivel}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {c.meses?.length ? c.meses.join(", ") : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        S/ {c.montoBase.toLocaleString("es-PE")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="descuentos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Descuentos y becas</CardTitle>
              <CardDescription>
                Reglas expresadas como porcentaje sobre un concepto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Regla</TableHead>
                    <TableHead>Aplica a</TableHead>
                    <TableHead className="text-right">Porcentaje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.nombre}</TableCell>
                      <TableCell>{d.aplicaA}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {d.porcentaje}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
