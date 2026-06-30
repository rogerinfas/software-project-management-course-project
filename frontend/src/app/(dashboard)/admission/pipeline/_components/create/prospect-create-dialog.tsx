import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADOS_POR_NIVEL } from "../../_utils/pipeline.utils";

interface ProspectCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nombre: string;
  setNombre: (val: string) => void;
  celular: string;
  setCelular: (val: string) => void;
  nivel: "INITIAL" | "PRIMARY" | "SECONDARY";
  setNivel: (val: "INITIAL" | "PRIMARY" | "SECONDARY") => void;
  grado: string;
  setGrado: (val: string) => void;
  prioridad: "HIGH" | "MEDIUM" | "LOW";
  setPrioridad: (val: "HIGH" | "MEDIUM" | "LOW") => void;
  onSubmit: () => void;
}

export function ProspectCreateDialog({
  open,
  onOpenChange,
  nombre,
  setNombre,
  celular,
  setCelular,
  nivel,
  setNivel,
  grado,
  setGrado,
  prioridad,
  setPrioridad,
  onSubmit,
}: ProspectCreateDialogProps) {
  const handleNivelChange = (newNivel: string) => {
    const typedNivel = newNivel as "INITIAL" | "PRIMARY" | "SECONDARY";
    setNivel(typedNivel);
    setGrado(GRADOS_POR_NIVEL[typedNivel][0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        className="inline-flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium"
      >
        <Plus className="size-4" />
        Nuevo Postulante
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar postulante</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Nombre completo</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="ej. Juan Pérez" />
          </div>
          <div className="grid gap-2">
            <Label>Celular</Label>
            <Input value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="ej. 959000000" />
          </div>
          <div className="grid gap-2">
            <Label>Nivel</Label>
            <Select value={nivel} onValueChange={(v) => v && handleNivelChange(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INITIAL">Inicial</SelectItem>
                <SelectItem value="PRIMARY">Primaria</SelectItem>
                <SelectItem value="SECONDARY">Secundaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Grado postulado</Label>
            <Select value={grado} onValueChange={(v) => setGrado(v ?? grado)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar grado" />
              </SelectTrigger>
              <SelectContent>
                {GRADOS_POR_NIVEL[nivel].map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Prioridad</Label>
            <Select value={prioridad} onValueChange={(v) => setPrioridad(v as "HIGH" | "MEDIUM" | "LOW")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">Alta</SelectItem>
                <SelectItem value="MEDIUM">Media</SelectItem>
                <SelectItem value="LOW">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button>
          <Button onClick={onSubmit} className="cursor-pointer">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
