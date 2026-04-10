"use client";

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
import { useDemoData } from "@/context/demo-data-context";

function downloadSiagieCsv(rows: Record<string, string>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h] ?? "")).join(",")),
  ];
  const bom = "\uFEFF";
  const blob = new Blob([bom + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `siagie_ficha_estudiante_demo_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SiagiePage() {
  const { students, sections } = useDemoData();

  const rows: Record<string, string>[] = students.map((s) => {
    const sec = sections.find((x) => x.id === s.sectionId);
    return {
      NUMERO_ORDEN: "",
      APELLIDO_PATERNO: s.apellidos.split(" ")[0] ?? s.apellidos,
      APELLIDO_MATERNO: s.apellidos.split(" ")[1] ?? "",
      NOMBRES: s.nombres,
      DOCUMENTO_IDENTIDAD: s.personal.dni,
      FECHA_NACIMIENTO: s.personal.fechaNacimiento,
      SEXO: s.personal.sexo,
      COD_ESTUDIANTE: s.codigo ?? "",
      GRADO: sec?.grado ?? "",
      SECCION: sec?.seccion ?? "",
      MODULAR_IE_PROCEDENCIA: s.procedencia.codigoModular,
    };
  });

  const headers =
    rows.length > 0 ? Object.keys(rows[0]) : ([] as string[]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Exportación SIAGIE (demo)</h1>
        <p className="text-muted-foreground text-sm">
          Excel/CSV con columnas tipo ficha de estudiante para copiar al portal
          Mined SIAGIE — formato ilustrativo, no certificado oficial.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Vista previa</CardTitle>
            <CardDescription>{rows.length} registros</CardDescription>
          </div>
          <Button type="button" onClick={() => downloadSiagieCsv(rows)}>
            Descargar CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto rounded-md border">
            {headers.length === 0 ? (
              <p className="text-muted-foreground p-4 text-sm">Sin estudiantes.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((h) => (
                      <TableHead key={h} className="whitespace-nowrap text-xs">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      {headers.map((h) => (
                        <TableCell key={h} className="text-xs font-mono">
                          {r[h]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
