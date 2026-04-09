"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoData } from "@/context/demo-data-context";

export default function ApoderadosPage() {
  const { students, guardians, setGuardianResponsible } = useDemoData();
  const [studentId, setStudentId] = React.useState(students[0]?.id ?? "");

  const list = guardians.filter((g) => g.studentId === studentId);
  const student = students.find((s) => s.id === studentId);
  const responsible = list.find((g) => g.responsableEconomico);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gestión de apoderados</h1>
        <p className="text-muted-foreground text-sm">
          Relación 1:N; un solo responsable económico por alumno (req.txt).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {students.map((s) => (
          <Button
            key={s.id}
            size="sm"
            variant={s.id === studentId ? "default" : "outline"}
            onClick={() => setStudentId(s.id)}
          >
            {s.nombres} {s.apellidos}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Apoderados de: {student?.nombres} {student?.apellidos}
          </CardTitle>
          <CardDescription>
            Responsable económico actual:{" "}
            <strong>{responsible?.nombreCompleto ?? "—"}</strong>
            {responsible?.deudaAniosAnterioresPendiente ? (
              <Badge variant="destructive" className="ml-2">
                Deuda años anteriores
              </Badge>
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={list.find((g) => g.responsableEconomico)?.id ?? ""}
            onValueChange={(v) => setGuardianResponsible(v)}
            className="space-y-3"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead>Nombre</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead>Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <RadioGroupItem value={g.id} id={g.id} />
                    </TableCell>
                    <TableCell>
                      <Label htmlFor={g.id} className="cursor-pointer font-normal">
                        {g.nombreCompleto}
                      </Label>
                    </TableCell>
                    <TableCell className="font-mono">{g.dni}</TableCell>
                    <TableCell>{g.parentesco}</TableCell>
                    <TableCell>{g.telefono}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
