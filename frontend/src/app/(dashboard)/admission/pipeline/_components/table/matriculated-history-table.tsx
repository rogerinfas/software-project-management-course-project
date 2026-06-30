import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Prospect } from "../../_types/pipeline.types";

interface MatriculatedHistoryTableProps {
  prospects: Prospect[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
}

export function MatriculatedHistoryTable({ prospects, selectedId, setSelectedId }: MatriculatedHistoryTableProps) {
  const formalizedProspects = prospects.filter((p: any) => p.isFormalized);

  return (
    <Card className="border-border/80 h-full flex flex-col">
      <CardHeader>
        <CardTitle>Histórico de Matriculados (Aptos)</CardTitle>
        <CardDescription>
          Postulantes que pasaron la evaluación académica y fueron formalizados.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Grado</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formalizedProspects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No hay alumnos matriculados para mostrar.
                </TableCell>
              </TableRow>
            ) : (
              formalizedProspects.map((p: any) => (
                <TableRow
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`cursor-pointer ${selectedId === p.id ? 'bg-muted/50' : ''}`}
                >
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.targetGrade}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.level}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-600/10 text-green-700 hover:bg-green-600/20 border-green-600/20">
                      Matriculado
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
