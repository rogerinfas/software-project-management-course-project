import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AnnouncementFormValues } from "../../_types/announcements.types";

interface AnnouncementEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<AnnouncementFormValues>;
  onSubmit: (data: AnnouncementFormValues) => void;
  isPending: boolean;
}

export function AnnouncementEditDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isPending,
}: AnnouncementEditDialogProps) {
  const { formState: { errors } } = form;
  const category = form.watch("category");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Comunicado</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-title" className={cn(errors.title && "text-red-500")}>Título *</Label>
              <Input
                id="edit-title"
                {...form.register("title")}
                className={cn(errors.title && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.title?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(errors.title.message)}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-content" className={cn(errors.content && "text-red-500")}>Contenido del Comunicado *</Label>
              <Textarea
                id="edit-content"
                {...form.register("content")}
                className={cn("min-h-[120px]", errors.content && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.content?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(errors.content.message)}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-category" className={cn(errors.category && "text-red-500")}>Categoría</Label>
                <Select value={category} onValueChange={(val) => {
                  form.setValue("category", val ?? "Informativo");
                  form.clearErrors("category");
                }}>
                  <SelectTrigger id="edit-category" className={cn(errors.category && "border-red-500 focus:ring-red-500")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Informativo">Informativo</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                    <SelectItem value="Evento">Evento</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.category.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-expires" className={cn(errors.expiresAt && "text-red-500")}>Vencimiento (Opcional)</Label>
                <Input
                  id="edit-expires"
                  type="date"
                  {...form.register("expiresAt")}
                  className={cn(errors.expiresAt && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.expiresAt?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.expiresAt.message)}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
