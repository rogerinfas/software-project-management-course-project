"use client";

import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export default function ComprobantesPage() {
  const { receipts, morosity, collection } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          D-3 · Comprobantes internos y morosidad
        </h1>
        <p className="text-muted-foreground text-sm">
          Emisión de recibos internos (PDF) y monitor de morosidad.
        </p>
      </div>

      <Tabs defaultValue="comprobantes">
        <TabsList>
          <TabsTrigger value="comprobantes">Comprobantes</TabsTrigger>
          <TabsTrigger value="morosidad">Morosidad</TabsTrigger>
          <TabsTrigger value="flujo">Recaudación</TabsTrigger>
        </TabsList>

        <TabsContent value="comprobantes" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Últimos recibos emitidos</CardTitle>
              <CardDescription>
                Numeración interna (no SUNAT). Cada pago emite un recibo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serie-N°</TableHead>
                    <TableHead>Emitido</TableHead>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono">
                        {r.serie}-{String(r.numero).padStart(4, "0")}
                      </TableCell>
                      <TableCell>
                        {new Date(r.emitidoEn).toLocaleString("es-PE")}
                      </TableCell>
                      <TableCell>{r.estudianteNombre}</TableCell>
                      <TableCell className="text-xs">{r.concepto}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        S/ {r.montoTotal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() =>
                            window.open("about:blank", "_blank", "noopener")
                          }
                        >
                          <FileText className="mr-1 size-3.5" />
                          Ver PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {receipts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground text-center text-sm"
                      >
                        Aún no se han emitido comprobantes.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="morosidad" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitor de morosidad</CardTitle>
              <CardDescription>
                Apoderados con deuda actual priorizados por antigüedad.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apoderado</TableHead>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Grado/Sección</TableHead>
                    <TableHead className="text-right">Meses</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {morosity.map((m) => (
                    <TableRow key={`${m.apoderado}-${m.estudiante}`}>
                      <TableCell className="font-medium">{m.apoderado}</TableCell>
                      <TableCell>{m.estudiante}</TableCell>
                      <TableCell>
                        {m.grado} · {m.seccion}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {m.mesesAdeudados}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        S/ {m.montoTotal.toLocaleString("es-PE")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flujo" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recaudación por mes</CardTitle>
              <CardDescription>
                Proyectado vs. recaudado (datos demo).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mes</TableHead>
                    <TableHead className="text-right">Proyectado</TableHead>
                    <TableHead className="text-right">Recaudado</TableHead>
                    <TableHead className="text-right">% cumplido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collection.map((m) => {
                    const pct =
                      m.proyectado > 0
                        ? Math.round((m.recaudado / m.proyectado) * 100)
                        : 0;
                    return (
                      <TableRow key={m.mes}>
                        <TableCell className="font-medium">{m.mes}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          S/ {m.proyectado.toLocaleString("es-PE")}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          S/ {m.recaudado.toLocaleString("es-PE")}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {pct}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
