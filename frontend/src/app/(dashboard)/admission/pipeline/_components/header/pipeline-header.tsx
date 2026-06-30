import * as React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProspectCreateDialog } from "../create/prospect-create-dialog";

interface PipelineHeaderProps {
  newOpen: boolean;
  setNewOpen: (open: boolean) => void;
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
  onSubmitProspect: () => void;
}

export function PipelineHeader(props: PipelineHeaderProps) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM / Pipeline de Admisión</h1>
          <p className="text-muted-foreground text-sm">
            Tablero Kanban con arrastrar y soltar. Mueve los postulantes entre etapas de admisión.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ProspectCreateDialog
            open={props.newOpen}
            onOpenChange={props.setNewOpen}
            nombre={props.nombre}
            setNombre={props.setNombre}
            celular={props.celular}
            setCelular={props.setCelular}
            nivel={props.nivel}
            setNivel={props.setNivel}
            grado={props.grado}
            setGrado={props.setGrado}
            prioridad={props.prioridad}
            setPrioridad={props.setPrioridad}
            onSubmit={props.onSubmitProspect}
          />
        </div>
      </div>

      <div className="mb-4">
        <TabsList>
          <TabsTrigger value="active">Pipeline Activo</TabsTrigger>
          <TabsTrigger value="history">Histórico (Matriculados)</TabsTrigger>
        </TabsList>
      </div>
    </>
  );
}
