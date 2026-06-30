"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { usePipelineData, useInteractions, usePipelineMutations } from "./_hooks/pipeline-hooks";
import { PipelineHeader } from "./_components/header/pipeline-header";
import { KanbanBoard } from "./_components/table/kanban-board";
import { MatriculatedHistoryTable } from "./_components/table/matriculated-history-table";
import { InteractionSidebar } from "./_components/detail/interaction-sidebar";

const STAGES = [
  { id: "ENTREVISTA", name: "Entrevista", order: 1 },
  { id: "EVALUACION_PSICOLOGICA", name: "Evaluación Psicológica", order: 2 },
  { id: "EVALUACION_ACADEMICA", name: "Evaluación Académica", order: 3 },
];

export default function PipelinePage() {
  const [showEnrolled, setShowEnrolled] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Nuevo prospecto state
  const [newOpen, setNewOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [celular, setCelular] = React.useState("");
  const [grado, setGrado] = React.useState("1° primaria");
  const [nivel, setNivel] = React.useState<"INITIAL" | "PRIMARY" | "SECONDARY">("PRIMARY");
  const [prioridad, setPrioridad] = React.useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");

  const { prospects, isLoading } = usePipelineData(showEnrolled);
  const { history } = useInteractions(selectedId);
  const { createProspectMutation } = usePipelineMutations();

  const selectedProspect = React.useMemo(() => {
    return selectedId ? prospects.find((p: any) => p.id === selectedId) ?? null : null;
  }, [selectedId, prospects]);

  function submitProspect() {
    if (!nombre.trim() || !celular.trim()) {
      toast.error("Por favor completa los campos");
      return;
    }

    createProspectMutation.mutate(
      {
        body: {
          name: nombre.trim(),
          phone: celular.trim(),
          targetGrade: grado,
          level: nivel,
          priority: prioridad,
        },
      },
      {
        onSuccess: () => {
          setNewOpen(false);
          setNombre("");
          setCelular("");
          setGrado("1° primaria");
          setNivel("PRIMARY");
          setPrioridad("MEDIUM");
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando pipeline...</p>
      </div>
    );
  }

  return (
    <div className="grid h-full lg:grid-cols-[1fr_320px] items-start">
      {/* Contenedor principal del CRM */}
      <div className="flex h-full flex-col gap-4 overflow-hidden border-r border-border/50 p-6 pr-4">
        <Tabs defaultValue="active" onValueChange={(v) => setShowEnrolled(v === 'history')} className="flex flex-col h-full w-full">
          
          <PipelineHeader
            newOpen={newOpen}
            setNewOpen={setNewOpen}
            nombre={nombre}
            setNombre={setNombre}
            celular={celular}
            setCelular={setCelular}
            nivel={nivel}
            setNivel={setNivel}
            grado={grado}
            setGrado={setGrado}
            prioridad={prioridad}
            setPrioridad={setPrioridad}
            onSubmitProspect={submitProspect}
          />

          <TabsContent value="active" className="flex-1 mt-0">
            <KanbanBoard prospects={prospects} stages={STAGES} setSelectedId={setSelectedId} />
          </TabsContent>

          <TabsContent value="history" className="flex-1 mt-0">
            <MatriculatedHistoryTable prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Panel lateral: Interacciones */}
      <InteractionSidebar selectedProspect={selectedProspect} history={history} />
    </div>
  );
}
