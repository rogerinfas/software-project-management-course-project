import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ScheduleFormValues, DAYS_OF_WEEK } from "../../_types/schedules.types";

interface ScheduleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<ScheduleFormValues>;
  onSubmit: (data: ScheduleFormValues) => void;
  isPending: boolean;
  sections: any[];
  courses: any[];
  teachers: any[];
}

export function ScheduleEditDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isPending,
  sections,
  courses,
  teachers,
}: ScheduleEditDialogProps) {
  const { formState: { errors } } = form;

  const section = form.watch("section");
  const course = form.watch("course");
  const teacher = form.watch("teacher");
  const day = form.watch("day");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modificar Horario Escolar</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-section" className={cn(errors.section && "text-red-500")}>Sección / Aula *</Label>
                <Select value={section} onValueChange={(val) => {
                  form.setValue("section", val ?? "");
                  form.clearErrors("section");
                }}>
                  <SelectTrigger id="edit-section" className={cn(errors.section && "border-red-500 focus:ring-red-500")}>
                    <SelectValue placeholder="Selecciona Aula" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.grade} - "{s.name}"
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.section?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.section.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-course" className={cn(errors.course && "text-red-500")}>Curso / Materia *</Label>
                <Select value={course} onValueChange={(val) => {
                  form.setValue("course", val ?? "");
                  form.clearErrors("course");
                }}>
                  <SelectTrigger id="edit-course" className={cn(errors.course && "border-red-500 focus:ring-red-500")}>
                    <SelectValue placeholder="Selecciona Curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.course?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.course.message)}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-teacher" className={cn(errors.teacher && "text-red-500")}>Docente Asignado *</Label>
              <Select value={teacher} onValueChange={(val) => {
                form.setValue("teacher", val ?? "");
                form.clearErrors("teacher");
              }}>
                <SelectTrigger id="edit-teacher" className={cn(errors.teacher && "border-red-500 focus:ring-red-500")}>
                  <SelectValue placeholder="Selecciona Profesor" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.user?.name} ({t.specialty || "General"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teacher?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(errors.teacher.message)}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-day" className={cn(errors.day && "text-red-500")}>Día</Label>
                <Select value={day} onValueChange={(val) => {
                  form.setValue("day", val ?? "1");
                  form.clearErrors("day");
                }}>
                  <SelectTrigger id="edit-day" className={cn(errors.day && "border-red-500 focus:ring-red-500")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((d) => (
                      <SelectItem key={d.value} value={String(d.value)}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.day?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.day.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-start" className={cn(errors.start && "text-red-500")}>Inicio (HH:mm)</Label>
                <Input
                  id="edit-start"
                  {...form.register("start")}
                  placeholder="08:00"
                  className={cn(errors.start && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.start?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.start.message)}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-end" className={cn(errors.end && "text-red-500")}>Fin (HH:mm)</Label>
                <Input
                  id="edit-end"
                  {...form.register("end")}
                  placeholder="09:30"
                  className={cn(errors.end && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.end?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(errors.end.message)}</p>
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
