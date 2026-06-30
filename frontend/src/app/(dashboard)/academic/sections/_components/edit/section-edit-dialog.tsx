import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SectionFormValues } from "../../_types/sections.types";

interface SectionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<SectionFormValues>;
  onSubmit: (data: SectionFormValues) => void;
  isPending: boolean;
}

export function SectionEditDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isPending,
}: SectionEditDialogProps) {
  const { formState: { errors } } = form;
  const level = form.watch("level");
  const status = form.watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Sección / Aula</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-grade" className={cn(errors.grade && "text-red-500")}>Grado *</Label>
                <Input
                  id="edit-grade"
                  {...form.register("grade")}
                  className={cn(errors.grade && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.grade?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.grade.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-name" className={cn(errors.name && "text-red-500")}>Sección *</Label>
                <Input
                  id="edit-name"
                  {...form.register("name")}
                  className={cn(errors.name && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.name?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.name.message)}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5 col-span-1">
                <Label htmlFor="edit-level" className={cn(errors.level && "text-red-500")}>Nivel</Label>
                <Select value={level} onValueChange={(val) => {
                  form.setValue("level", val as any);
                  form.clearErrors("level");
                }}>
                  <SelectTrigger id="edit-level" className={cn(errors.level && "border-red-500 focus:ring-red-500")}>
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
              <div className="flex flex-col gap-1.5 col-span-1">
                <Label htmlFor="edit-capacity" className={cn(errors.capacity && "text-red-500")}>Aforo *</Label>
                <Input
                  id="edit-capacity"
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
              <div className="flex flex-col gap-1.5 col-span-1">
                <Label htmlFor="edit-status" className={cn(errors.status && "text-red-500")}>Estado</Label>
                <Select value={status} onValueChange={(val) => {
                  form.setValue("status", val as any);
                  form.clearErrors("status");
                }}>
                  <SelectTrigger id="edit-status" className={cn(errors.status && "border-red-500 focus:ring-red-500")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Abierta</SelectItem>
                    <SelectItem value="CLOSED">Cerrada</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.status.message)}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? "Guardando..." : "Guardar Aula"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
