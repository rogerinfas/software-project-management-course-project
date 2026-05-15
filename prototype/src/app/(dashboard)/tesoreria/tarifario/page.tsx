"use client";

import * as React from "react";
import { Plus, Edit2, Trash2, Tag, Percent } from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type {
  NivelEducativo,
  TariffType,
} from "@/lib/mock/types";

const TIPO_LABEL: Record<string, string> = {
  unico: "Único",
  mensual: "Mensual",
  extra: "Extra",
};

export default function TarifarioPage() {
  const {
    tariffConcepts,
    discounts,
    addTariffConcept,
    updateTariffConcept,
    deleteTariffConcept,
    addDiscount,
    updateDiscount,
    deleteDiscount,
  } = useDemoData();

  // Concept Form
  const [conceptOpen, setConceptOpen] = React.useState(false);
  const [cId, setCId] = React.useState<string | null>(null);
  const [cNombre, setCNombre] = React.useState("");
  const [cTipo, setCTipo] = React.useState<TariffType>("unico");
  const [cNivel, setCNivel] = React.useState<NivelEducativo>("primaria");
  const [cMonto, setCMonto] = React.useState("0");

  const handleSaveConcept = () => {
    const data = {
      nombre: cNombre,
      tipo: cTipo,
      aplicaNivel: cNivel,
      montoBase: Number(cMonto),
      meses: cTipo === "mensual" ? ["marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"] : [],
    };
    if (cId) updateTariffConcept(cId, data);
    else addTariffConcept(data);
    setConceptOpen(false);
    resetConcept();
  };

  const resetConcept = () => {
    setCId(null);
    setCNombre("");
    setCTipo("unico");
    setCNivel("primaria");
    setCMonto("0");
  };

  // Discount Form
  const [discOpen, setDiscOpen] = React.useState(false);
  const [dId, setDId] = React.useState<string | null>(null);
  const [dNombre, setDNombre] = React.useState("");
  const [dAplica, setDAplica] = React.useState("");
  const [dPct, setDPct] = React.useState("0");

  const handleSaveDiscount = () => {
    const data = {
      nombre: dNombre,
      aplicaA: dAplica,
      porcentaje: Number(dPct),
    };
    if (dId) updateDiscount(dId, data);
    else addDiscount(data);
    setDiscOpen(false);
    resetDiscount();
  };

  const resetDiscount = () => {
    setDId(null);
    setDNombre("");
    setDAplica("");
    setDPct("0");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">D-1 · Tarifario</h1>
          <p className="text-muted-foreground text-sm">
            Conceptos de cobro y reglas de becas/descuentos.
          </p>
        </div>
      </div>

      <Tabs defaultValue="conceptos">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="conceptos">Conceptos</TabsTrigger>
            <TabsTrigger value="descuentos">Descuentos</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Dialog open={conceptOpen} onOpenChange={(o) => { setConceptOpen(o); if(!o) resetConcept(); }}>
              <DialogTrigger render={
                <Button size="sm" className="gap-2">
                  <Plus className="size-4" /> Concepto
                </Button>
              } />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{cId ? "Editar" : "Nuevo"} Concepto</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Nombre</Label>
                    <Input value={cNombre} onChange={(e) => setCNombre(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Tipo</Label>
                      <select className="border-input h-9 rounded-lg border px-2 text-sm" value={cTipo} onChange={(e) => setCTipo(e.target.value as TariffType)}>
                        <option value="unico">Único</option>
                        <option value="mensual">Mensual</option>
                        <option value="extra">Extra</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Nivel</Label>
                      <select className="border-input h-9 rounded-lg border px-2 text-sm" value={cNivel} onChange={(e) => setCNivel(e.target.value as NivelEducativo)}>
                        <option value="inicial">Inicial</option>
                        <option value="primaria">Primaria</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Monto Base (S/)</Label>
                    <Input type="number" value={cMonto} onChange={(e) => setCMonto(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConceptOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSaveConcept}>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={discOpen} onOpenChange={(o) => { setDiscOpen(o); if(!o) resetDiscount(); }}>
              <DialogTrigger render={
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="size-4" /> Descuento
                </Button>
              } />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{dId ? "Editar" : "Nueva"} Regla de Descuento</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Nombre de la regla</Label>
                    <Input value={dNombre} onChange={(e) => setDNombre(e.target.value)} placeholder="Ej. Beca Socioeconómica" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Aplica a</Label>
                    <Input value={dAplica} onChange={(e) => setDAplica(e.target.value)} placeholder="Ej. Pensiones" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Porcentaje (%)</Label>
                    <Input type="number" value={dPct} onChange={(e) => setDPct(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDiscOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSaveDiscount}>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="conceptos" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Conceptos de tarifario</CardTitle>
                <CardDescription>Pensiones, matrículas y otros ingresos.</CardDescription>
              </div>
              <Tag className="size-5 text-muted-foreground/50" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tariffConcepts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nombre}</TableCell>
                      <TableCell><Badge variant="secondary">{TIPO_LABEL[c.tipo]}</Badge></TableCell>
                      <TableCell className="capitalize">{c.aplicaNivel}</TableCell>
                      <TableCell className="text-right font-mono">S/ {c.montoBase.toFixed(2)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon-xs" onClick={() => {
                          setCId(c.id); setCNombre(c.nombre); setCTipo(c.tipo); setCNivel(c.aplicaNivel); setCMonto(c.montoBase.toString()); setConceptOpen(true);
                        }}>
                          <Edit2 className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon-xs" className="text-destructive" onClick={() => { if(confirm("¿Eliminar concepto?")) deleteTariffConcept(c.id); }}>
                          <Trash2 className="size-3" />
                        </Button>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Descuentos y becas</CardTitle>
                <CardDescription>Reglas de reducción porcentual.</CardDescription>
              </div>
              <Percent className="size-5 text-muted-foreground/50" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Regla</TableHead>
                    <TableHead>Aplica a</TableHead>
                    <TableHead className="text-right">Porcentaje</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.nombre}</TableCell>
                      <TableCell>{d.aplicaA}</TableCell>
                      <TableCell className="text-right font-mono text-green-600">-{d.porcentaje}%</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon-xs" onClick={() => {
                          setDId(d.id); setDNombre(d.nombre); setDAplica(d.aplicaA); setDPct(d.porcentaje.toString()); setDiscOpen(true);
                        }}>
                          <Edit2 className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon-xs" className="text-destructive" onClick={() => { if(confirm("¿Eliminar regla?")) deleteDiscount(d.id); }}>
                          <Trash2 className="size-3" />
                        </Button>
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
