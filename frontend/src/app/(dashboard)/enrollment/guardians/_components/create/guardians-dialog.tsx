import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GuardianFormValues } from "../../_types/guardians.types";

interface GuardiansDialogProps {
  newOpen: boolean;
  setNewOpen: (val: boolean) => void;
  createForm: UseFormReturn<GuardianFormValues>;
  createMutation: any;
}

export function GuardiansDialog({ newOpen, setNewOpen, createForm, createMutation }: GuardiansDialogProps) {
  const { formState: { errors: createErrors } } = createForm;

  function handleAdd(data: GuardianFormValues) {
    if (!data.name.trim() || !data.dni.trim() || !data.phone.trim()) {
      toast.error("El nombre, DNI y teléfono son obligatorios");
      return;
    }
    createMutation.mutate({
      body: {
        dni: data.dni,
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        occupation: data.occupation || undefined,
      },
    });
  }

  return (
    <Dialog open={newOpen} onOpenChange={setNewOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Apoderado</DialogTitle>
        </DialogHeader>
        <form onSubmit={createForm.handleSubmit(handleAdd)} className="space-y-4">
          <div className="grid gap-3 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-name" className={cn(createErrors.name && "text-red-500")}>Nombre Completo *</Label>
              <Input
                id="new-name"
                placeholder="ej. Juan Pérez Delgado"
                {...createForm.register("name")}
                className={cn(createErrors.name && "border-red-500 focus-visible:ring-red-500")}
              />
              {createErrors.name?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(createErrors.name.message)}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-dni" className={cn(createErrors.dni && "text-red-500")}>DNI *</Label>
                <Input
                  id="new-dni"
                  maxLength={8}
                  placeholder="8 dígitos"
                  className={cn("font-mono", createErrors.dni && "border-red-500 focus-visible:ring-red-500")}
                  {...createForm.register("dni")}
                />
                {createErrors.dni?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.dni.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-phone" className={cn(createErrors.phone && "text-red-500")}>Teléfono *</Label>
                <Input
                  id="new-phone"
                  placeholder="987654321"
                  {...createForm.register("phone")}
                  className={cn(createErrors.phone && "border-red-500 focus-visible:ring-red-500")}
                />
                {createErrors.phone?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.phone.message)}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-email" className={cn(createErrors.email && "text-red-500")}>Correo Electrónico</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="juan.perez@ejemplo.com"
                {...createForm.register("email")}
                className={cn(createErrors.email && "border-red-500 focus-visible:ring-red-500")}
              />
              {createErrors.email?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(createErrors.email.message)}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-ocup" className={cn(createErrors.occupation && "text-red-500")}>Ocupación o Profesión</Label>
              <Input
                id="new-ocup"
                placeholder="ej. Ingeniero de Sistemas"
                {...createForm.register("occupation")}
                className={cn(createErrors.occupation && "border-red-500 focus-visible:ring-red-500")}
              />
              {createErrors.occupation?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(createErrors.occupation.message)}</p>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              * Campos obligatorios. Para simular deudas pasadas y ver el bloqueo de matrícula en acción, introduce un DNI que termine en &quot;99&quot;.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewOpen(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="cursor-pointer">
              {createMutation.isPending ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
