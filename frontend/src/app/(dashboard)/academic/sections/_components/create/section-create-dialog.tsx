import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SectionFormValues } from "../../_types/sections.types";

interface SectionCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<SectionFormValues>;
  onSubmit: (data: SectionFormValues) => void;
  isPending: boolean;
}

export function SectionCreateDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isPending,
}: SectionCreateDialogProps) {
  const { formState: { errors } } = form;
  const level = form.watch("level");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Sección</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="grade" className={cn(errors.grade && "text-red-500")}>Grado *</Label>
                <Input
                  id="grade"
                  {...form.register("grade")}
                  placeholder="ej. 1ro de Primaria"
                  className={cn(errors.grade && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.grade?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.grade.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className={cn(errors.name && "text-red-500")}>Sección (ej. A, B) *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="ej. A"
                  className={cn(errors.name && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.name?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.name.message)}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="level" className={cn(errors.level && "text-red-500")}>Nivel Educativo</Label>
                <Select value={level} onValueChange={(val) => {
                  form.setValue("level", val as any);
                  form.clearErrors("level");
                }}>
                  <SelectTrigger id="level" className={cn(errors.level && "border-red-500 focus:ring-red-500")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARY">Primaria</SelectItem>
                    <SelectItem value="SECONDARY">Secundaria</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.level.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="capacity" className={cn(errors.capacity && "text-red-500")}>Aforo Máximo *</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...form.register("capacity")}
                  min={1}
                  max={100}
                  className={cn(errors.capacity && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.capacity?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.capacity.message)}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? "Creando..." : "Crear Aula"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
