import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CourseFormValues } from "../../_types/curriculum.types";

interface CourseCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CourseFormValues>;
  onSubmit: (data: CourseFormValues) => void;
  isPending: boolean;
}

export function CourseCreateDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isPending,
}: CourseCreateDialogProps) {
  const { formState: { errors } } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Curso al Plan Curricular</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className={cn(errors.name && "text-red-500")}>Nombre del Curso *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="ej. Álgebra y Geometría"
                className={cn(errors.name && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.name?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(errors.name.message)}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="desc" className={cn(errors.description && "text-red-500")}>Descripción / Silabo (Opcional)</Label>
              <Textarea
                id="desc"
                {...form.register("description")}
                placeholder="Describe brevemente las áreas de competencia..."
                className={cn("min-h-[100px]", errors.description && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.description?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(errors.description.message)}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? "Añadiendo..." : "Añadir"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
