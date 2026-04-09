"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDemoData } from "@/context/demo-data-context";

export default function DeudaMasivaPage() {
  const { generateMassPensionDebt, massDebtGeneratedAt, students, charges } =
    useDemoData();
  const [open, setOpen] = React.useState(false);
  const matriculados = students.filter((s) => s.codigo).length;
  const mayoCount = charges.filter((c) => c.concepto.includes("Mayo 2026")).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Generación de deuda masiva</h1>
        <p className="text-muted-foreground text-sm">
          Un clic para generar pensiones a todos los alumnos matriculados
          (simulación en memoria).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
          <CardDescription>
            Alumnos con código (matriculados):{" "}
            <strong>{matriculados}</strong>.             Cuotas &quot;Mayo 2026&quot; generadas en esta sesión: <strong>{mayoCount}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {massDebtGeneratedAt ? (
            <p className="text-muted-foreground text-xs">
              Última generación: {new Date(massDebtGeneratedAt).toLocaleString("es-PE")}
            </p>
          ) : null}
          <Button type="button" onClick={() => setOpen(true)}>
            Generar pensiones (demo)
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar generación masiva</DialogTitle>
            <DialogDescription>
              Se crearán cuotas de pensión Mayo 2026 para cada alumno matriculado.
              Esta acción es solo de demostración.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                generateMassPensionDebt();
                setOpen(false);
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
