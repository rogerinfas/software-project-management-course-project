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
import { useDemoData } from "@/context/demo-data-context";

export default function AuditoriaPage() {
  const { auditLog } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Trazabilidad / auditoría</h1>
        <p className="text-muted-foreground text-sm">
          Movimientos de dinero y cambios relevantes: quién, cuándo, monto,
          edición posterior (req.txt §7).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log de auditoría (mock)</CardTitle>
          <CardDescription>Ordenado del más reciente al más antiguo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/hora</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead>¿Edición?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap text-xs">
                    {a.fechaHora}
                  </TableCell>
                  <TableCell>{a.usuario}</TableCell>
                  <TableCell>{a.accion}</TableCell>
                  <TableCell className="max-w-md text-sm">{a.detalle}</TableCell>
                  <TableCell>
                    {a.huboEdicionPosterior ? (
                      <Badge variant="secondary">Sí</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
