"use client";

import * as React from "react";
import { FileText, Printer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

export default function DocumentosMatriculaPage() {
  const { students, enrollmentDocuments, emitEnrollmentDocs } = useDemoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">B-3 · Documentos de matrícula</h1>
        <p className="text-muted-foreground text-sm">
          Emisión automática de la <strong>ficha de matrícula</strong> y del{" "}
          <strong>contrato de prestación de servicios educativos</strong>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alumnos matriculados</CardTitle>
          <CardDescription>
            Re-emite documentos o simula la descarga del PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Docs. emitidos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students
                .filter((s) => s.codigo)
                .map((s) => {
                  const mios = enrollmentDocuments.filter(
                    (d) => d.studentId === s.id,
                  );
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">
                        {s.nombres} {s.apellidos}
                      </TableCell>
                      <TableCell className="font-mono">{s.codigo}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {mios.map((d) => (
                            <Badge key={d.id} variant="outline">
                              {d.tipo === "ficha_matricula"
                                ? "Ficha"
                                : "Contrato"}{" "}
                              · {d.generadoEn}
                            </Badge>
                          ))}
                          {mios.length === 0 ? (
                            <span className="text-muted-foreground text-xs">
                              sin emisión
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => emitEnrollmentDocs(s.id)}
                        >
                          <Printer className="mr-1 size-3.5" />
                          Re-emitir
                        </Button>
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
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
