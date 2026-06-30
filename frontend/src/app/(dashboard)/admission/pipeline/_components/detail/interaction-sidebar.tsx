import * as React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prospect, Interaction } from "../../_types/pipeline.types";
import { usePipelineMutations } from "../../_hooks/pipeline-hooks";

interface InteractionSidebarProps {
  selectedProspect: Prospect | null;
  history: Interaction[];
}

export function InteractionSidebar({ selectedProspect, history }: InteractionSidebarProps) {
  const { createInteractionMutation, updateInteractionMutation } = usePipelineMutations();

  // Create state
  const [tipo, setTipo] = React.useState<string>("llamada");
  const [resumen, setResumen] = React.useState("");

  // Edit state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editType, setEditType] = React.useState<string>("llamada");
  const [editSummary, setEditSummary] = React.useState<string>("");

  function submitInteraction() {
    if (!selectedProspect || !resumen.trim()) return;

    createInteractionMutation.mutate(
      {
        params: { path: { id: selectedProspect.id } },
        body: {
          type: tipo,
          summary: resumen.trim(),
          author: "Admisión",
        },
      },
      {
        onSuccess: () => {
          setResumen("");
        },
      }
    );
  }

  function saveEdit(i: Interaction) {
    if (!editSummary.trim()) return;
    updateInteractionMutation.mutate(
      {
        params: { path: { id: i.id } },
        body: {
          type: editType,
          summary: editSummary.trim(),
          author: "Admisión",
        },
      },
      {
        onSuccess: () => {
          setEditingId(null);
        },
      }
    );
  }

  return (
    <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col gap-4 overflow-y-auto bg-muted/10 p-6 pl-4">
      <div className="flex flex-col gap-1 border-b border-border/50 pb-4">
        <h2 className="text-lg font-semibold tracking-tight">Historial de interacciones</h2>
        {selectedProspect && (
          <p className="text-sm text-muted-foreground">{selectedProspect.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {!selectedProspect ? (
          <p className="text-muted-foreground text-sm italic">
            Haz clic en &quot;Ver detalle&quot; en cualquier tarjeta del tablero Kanban.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Timeline */}
            <div className="flex flex-col gap-3">
              {history.length === 0 ? (
                <p className="text-muted-foreground text-xs italic">
                  Sin interacciones registradas para este postulante.
                </p>
              ) : (
                <ul className="space-y-3 text-xs">
                  {history.map((i: any) => (
                    <li key={i.id} className="rounded-lg border border-border/50 bg-muted/20 p-3 flex flex-col gap-1.5">
                      {editingId === i.id ? (
                        <div className="flex flex-col gap-2.5 p-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Editar Tipo:</span>
                            <Select value={editType} onValueChange={(v) => setEditType(v ?? "llamada")}>
                              <SelectTrigger className="h-7 w-[160px] text-[11px] p-2 bg-background border">
                                <SelectValue placeholder="Tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="llamada">Llamada Telefónica</SelectItem>
                                <SelectItem value="correo">Correo Electrónico</SelectItem>
                                <SelectItem value="entrevista">Entrevista Presencial</SelectItem>
                                <SelectItem value="nota">Nota de Seguimiento</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Textarea
                              rows={2}
                              value={editSummary}
                              onChange={(e) => setEditSummary(e.target.value)}
                              className="text-xs p-2 bg-background border"
                              placeholder="Detalles de la interacción..."
                            />
                          </div>
                          <div className="flex justify-end gap-1.5">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              className="h-7 text-[10px] px-2.5 cursor-pointer"
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => saveEdit(i)}
                              className="h-7 text-[10px] px-2.5 cursor-pointer"
                              disabled={updateInteractionMutation.isPending}
                            >
                              {updateInteractionMutation.isPending ? "Guardando..." : "Guardar"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold uppercase tracking-wider text-primary">{i.type}</span>
                              <Button
                                size="xs"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-primary hover:bg-muted cursor-pointer rounded-full inline-flex items-center justify-center shrink-0"
                                onClick={() => {
                                  setEditingId(i.id);
                                  setEditType(i.type);
                                  setEditSummary(i.summary);
                                }}
                              >
                                <Pencil className="size-3" />
                              </Button>
                            </div>
                            <span className="text-muted-foreground">
                              {new Date(i.date).toLocaleString("es-PE")}
                            </span>
                          </div>
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{i.summary}</p>
                          <p className="text-muted-foreground text-[10px]">Registrado por {i.author}</p>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Nueva interacción */}
            <div className="flex flex-col gap-4 bg-muted/10 border border-border/40 p-4 rounded-xl">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">Nueva Interacción</span>
              
              <div className="flex flex-col gap-1.5">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={(v) => setTipo(v ?? "llamada")}>
                  <SelectTrigger className="w-full" size="sm">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llamada">Llamada Telefónica</SelectItem>
                    <SelectItem value="correo">Correo Electrónico</SelectItem>
                    <SelectItem value="entrevista">Entrevista Presencial</SelectItem>
                    <SelectItem value="nota">Nota de Seguimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <Label>Resumen</Label>
                <Textarea
                  rows={3}
                  value={resumen}
                  onChange={(e) => setResumen(e.target.value)}
                  placeholder="Detalla lo conversado, acuerdos o próximos pasos."
                  className="text-xs"
                />
              </div>
              
              <Button onClick={submitInteraction} size="sm" className="cursor-pointer" disabled={createInteractionMutation.isPending}>
                {createInteractionMutation.isPending ? "Registrando..." : "Registrar interacción"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
