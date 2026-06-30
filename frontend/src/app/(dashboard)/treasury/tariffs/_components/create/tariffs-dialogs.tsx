import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TariffFormValues } from "../../_types/tariffs.types";

interface TariffsDialogsProps {
  newOpen: boolean;
  setNewOpen: (val: boolean) => void;
  editOpen: boolean;
  setEditOpen: (val: boolean) => void;
  createForm: UseFormReturn<TariffFormValues>;
  editForm: UseFormReturn<TariffFormValues>;
  createMutation: any;
  updateMutation: any;
  editId: string | null;
}

export function TariffsDialogs({
  newOpen,
  setNewOpen,
  editOpen,
  setEditOpen,
  createForm,
  editForm,
  createMutation,
  updateMutation,
  editId,
}: TariffsDialogsProps) {
  const { formState: { errors: createErrors } } = createForm;
  const { formState: { errors: editErrors } } = editForm;

  const handleCreate = (data: TariffFormValues) => {
    if (!data.concept || !data.amount) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    createMutation.mutate({
      body: {
        concept: data.concept,
        amount: parseFloat(data.amount),
        type: data.type,
        level: data.level,
      },
    });
  };

  const handleUpdate = (data: TariffFormValues) => {
    if (!editId || !data.concept || !data.amount) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    updateMutation.mutate({
      params: {
        path: { id: editId },
      },
      body: {
        concept: data.concept,
        amount: parseFloat(data.amount),
        type: data.type,
        level: data.level,
      },
    });
  };

  return (
    <>
      {/* Create Modal */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Nueva Tarifa Escolar</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="concept" className={cn(createErrors.concept && "text-red-500")}>Concepto de Cobro</Label>
              <Input
                id="concept"
                placeholder="Ej. Pensión de Julio, Matrícula 2026..."
                {...createForm.register("concept")}
                className={cn("h-9", createErrors.concept && "border-red-500 focus-visible:ring-red-500")}
              />
              {createErrors.concept?.message && (
                <p className="text-red-500 text-xs mt-1">{String(createErrors.concept.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className={cn(createErrors.amount && "text-red-500")}>Monto (S/)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...createForm.register("amount")}
                className={cn("h-9", createErrors.amount && "border-red-500 focus-visible:ring-red-500")}
              />
              {createErrors.amount?.message && (
                <p className="text-red-500 text-xs mt-1">{String(createErrors.amount.message)}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Cobro</Label>
                <Select value={createForm.watch("type")} onValueChange={(val) => createForm.setValue("type", val as any)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Mensual</SelectItem>
                    <SelectItem value="ONE_TIME">Pago Único</SelectItem>
                    <SelectItem value="EXTRA">Extraordinario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nivel Educativo</Label>
                <Select value={createForm.watch("level")} onValueChange={(val) => createForm.setValue("level", val as any)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INITIAL">Inicial</SelectItem>
                    <SelectItem value="PRIMARY">Primaria</SelectItem>
                    <SelectItem value="SECONDARY">Secundaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewOpen(false)}
                className="h-9 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="h-9 font-semibold cursor-pointer"
              >
                {createMutation.isPending ? "Creando..." : "Crear Tarifa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Tarifa</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-concept" className={cn(editErrors.concept && "text-red-500")}>Concepto de Cobro</Label>
              <Input
                id="edit-concept"
                {...editForm.register("concept")}
                className={cn("h-9", editErrors.concept && "border-red-500 focus-visible:ring-red-500")}
              />
              {editErrors.concept?.message && (
                <p className="text-red-500 text-xs mt-1">{String(editErrors.concept.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount" className={cn(editErrors.amount && "text-red-500")}>Monto (S/)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                {...editForm.register("amount")}
                className={cn("h-9", editErrors.amount && "border-red-500 focus-visible:ring-red-500")}
              />
              {editErrors.amount?.message && (
                <p className="text-red-500 text-xs mt-1">{String(editErrors.amount.message)}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Cobro</Label>
                <Select value={editForm.watch("type")} onValueChange={(val) => editForm.setValue("type", val as any)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Mensual</SelectItem>
                    <SelectItem value="ONE_TIME">Pago Único</SelectItem>
                    <SelectItem value="EXTRA">Extraordinario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nivel Educativo</Label>
                <Select value={editForm.watch("level")} onValueChange={(val) => editForm.setValue("level", val as any)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INITIAL">Inicial</SelectItem>
                    <SelectItem value="PRIMARY">Primaria</SelectItem>
                    <SelectItem value="SECONDARY">Secundaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="h-9 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="h-9 font-semibold cursor-pointer"
              >
                {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
