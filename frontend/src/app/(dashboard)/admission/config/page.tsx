"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backend } from "@/lib/api/types/backend";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const stageSchema = z.object({
  name: z.string().min(3, "El nombre de la etapa debe tener al menos 3 caracteres"),
  order: z.preprocess((val) => Number(val), z.number().int().min(0)),
});

export default function ConfigPage() {
  const queryClient = useQueryClient();
  
  // State for creating stage
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // React Hook Form for creating stage
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: "",
      order: 0,
    },
  });

  // State for editing stage
  const [editingStageId, setEditingStageId] = React.useState<string | null>(null);
  const [editingStageName, setEditingStageName] = React.useState("");
  const [editingStageOrder, setEditingStageOrder] = React.useState(0);

  // Queries
  const { data: stages, isLoading } = backend.useQuery("get", "/api/admission/stages", {});

  // Mutations
  const createMutation = backend.useMutation("post", "/api/admission/stages", {
    onSuccess: () => {
      toast.success("Etapa creada con éxito");
      reset();
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/stages"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("put", "/api/admission/stages/{id}", {
    onSuccess: () => {
      toast.success("Etapa actualizada");
      setEditingStageId(null);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/stages"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/admission/stages/{id}", {
    onSuccess: () => {
      toast.success("Etapa eliminada con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/stages"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const handleCreate = (data: any) => {
    createMutation.mutate({
      body: {
        name: data.name,
        order: Number(data.order),
      },
    });
  };

  const handleSaveEdit = (id: string) => {
    if (!editingStageName) return;
    updateMutation.mutate({
      params: { path: { id } },
      body: {
        name: editingStageName,
        order: Number(editingStageOrder),
      },
    });
  };

  const handleStartEdit = (stage: any) => {
    setEditingStageId(stage.id);
    setEditingStageName(stage.name);
    setEditingStageOrder(stage.order);
  };

  if (isLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Etapas y Configuración</h2>
          <p className="text-muted-foreground text-sm">
            Personaliza las etapas del pipeline del proceso de admisión escolar.
          </p>
        </div>
      </div>

      {/* Grid of stages */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main configuration panel */}
        <div className="bg-card border-border/80 flex flex-col gap-4 rounded-xl border p-6 md:col-span-2">
          <h3 className="text-foreground text-lg font-semibold flex items-center gap-2">
            <Layers className="text-primary size-5" /> Etapas del Embudo (Pipeline)
          </h3>
          <p className="text-muted-foreground text-xs">
            Las etapas se ordenan de forma ascendente en base a su valor numérico de "Orden".
          </p>

          <div className="flex flex-col gap-3 mt-4">
            {(stages as any)?.map((s: any) => {
              const isEditing = editingStageId === s.id;
              return (
                <div
                  key={s.id}
                  className="bg-muted/30 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg p-4 transition-all"
                >
                  {isEditing ? (
                    <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
                      <div className="flex flex-col gap-1 w-full sm:w-2/3">
                        <Label htmlFor={`edit-name-${s.id}`} className="text-xs text-muted-foreground">Nombre</Label>
                        <Input
                          id={`edit-name-${s.id}`}
                          value={editingStageName}
                          onChange={(e) => setEditingStageName(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full sm:w-1/3">
                        <Label htmlFor={`edit-order-${s.id}`} className="text-xs text-muted-foreground">Orden</Label>
                        <Input
                          id={`edit-order-${s.id}`}
                          type="number"
                          value={editingStageOrder}
                          onChange={(e) => setEditingStageOrder(Number(e.target.value))}
                          className="h-9"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg text-sm font-bold">
                        {s.order}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{s.name}</span>
                        <span className="text-[0.7rem] text-muted-foreground uppercase">
                          {s.prospects?.length || 0} postulantes
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isEditing ? (
                      <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <span className="text-xs text-transparent select-none invisible h-4 hidden sm:block">Spacer</span>
                        <div className="flex items-center gap-2 h-9">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(s.id)}
                            className="cursor-pointer"
                            disabled={updateMutation.isPending}
                          >
                            <Save className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingStageId(null)}
                            className="cursor-pointer"
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(s)}
                          className="cursor-pointer"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (s.prospects && s.prospects.length > 0) {
                              toast.warning(
                                "No puedes eliminar una etapa que tiene prospectos asignados. Mueve o elimina los prospectos primero."
                              );
                              return;
                            }
                            if (confirm(`¿Seguro que deseas eliminar la etapa "${s.name}"?`)) {
                              deleteMutation.mutate({ params: { path: { id: s.id } } });
                            }
                          }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informational Panel or Create stage panel */}
        <div className="bg-card border-border/80 flex flex-col justify-between rounded-xl border p-6 md:col-span-1">
          {isCreateOpen ? (
            <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-4">
              <h3 className="text-foreground text-lg font-semibold">Agregar Nueva Etapa</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Registra una etapa personalizada para estructurar el embudo de postulaciones.
              </p>

              <div className="flex flex-col gap-1.5 mt-2">
                <Label htmlFor="stage-name" className={cn(errors.name && "text-red-500")}>Nombre de Etapa *</Label>
                <Input
                  id="stage-name"
                  placeholder="ej. Examen de Admisión"
                  {...register("name")}
                  className={cn(errors.name && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.name?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.name.message)}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="stage-order" className={cn(errors.order && "text-red-500")}>Orden numérico *</Label>
                <Input
                  id="stage-order"
                  type="number"
                  placeholder="ej. 3"
                  {...register("order")}
                  className={cn(errors.order && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.order?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.order.message)}</p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="cursor-pointer" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creando..." : "Crear Etapa"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="text-foreground text-lg font-semibold flex items-center gap-2">
                <Settings className="text-primary size-5" /> Reglas del Embudo
              </h3>
              <ul className="text-muted-foreground text-xs leading-relaxed flex flex-col gap-2 list-disc pl-4 mt-2">
                <li>Los postulantes ingresan inicialmente en la etapa con el orden numérico más bajo.</li>
                <li>Arrastra las tarjetas en la vista de Pipeline para mover de forma automática a los postulantes entre etapas.</li>
                <li>Los postulantes con aptitud marcada como "No Apto" se marcan con etiqueta roja pero continúan visibles en el pipeline.</li>
              </ul>
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 cursor-pointer"
              >
                Crear Nueva Etapa
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
