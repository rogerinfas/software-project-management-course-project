"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoData } from "@/context/demo-data-context";

export default function FacturacionPage() {
  const { payments } = useDemoData();
  const last = payments[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Facturación electrónica</h1>
        <p className="text-muted-foreground text-sm">
          Vista previa JSON/XML para envío a SUNAT (PSE o directo) al confirmar
          un pago — último pago del mock.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Último comprobante generado</CardTitle>
          <CardDescription>
            {last
              ? `${last.fechaHora} — ${last.cobradorNombre} — S/ ${last.montoTotal}`
              : "Registre un pago en ventanilla para ver datos."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {last?.comprobanteSunat ? (
            <Tabs defaultValue="json">
              <TabsList>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="xml">XML</TabsTrigger>
              </TabsList>
              <TabsContent value="json" className="pt-4">
                <pre className="bg-muted max-h-80 overflow-auto rounded-lg p-4 text-xs">
                  {last.comprobanteSunat.json}
                </pre>
              </TabsContent>
              <TabsContent value="xml" className="pt-4">
                <pre className="bg-muted max-h-80 overflow-auto rounded-lg p-4 text-xs">
                  {last.comprobanteSunat.xml}
                </pre>
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-muted-foreground text-sm">Sin datos.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
