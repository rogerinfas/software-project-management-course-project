import * as React from "react";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StudentFormValues } from "../../_types/formalization.types";

interface StepStudentFormProps {
  form: UseFormReturn<StudentFormValues>;
  onSubmit: (data: StudentFormValues) => void;
  isPending: boolean;
  onBack: () => void;
}

export function StepStudentForm({ form, onSubmit, isPending, onBack }: StepStudentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Perfil de Alumno</CardTitle>
        <CardDescription>Valide los datos del prospecto antes de convertirlo en alumno.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div>
            <Label>Nombres</Label>
            <Input {...form.register("firstName")} />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label>Apellidos</Label>
            <Input {...form.register("lastName")} />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
            )}
          </div>
          <div>
            <Label>DNI</Label>
            <Input {...form.register("dni")} />
            {form.formState.errors.dni && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.dni.message}</p>
            )}
          </div>
          <div className="pt-4 flex gap-2">
            <Button variant="outline" type="button" onClick={onBack}>
              Volver
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Crear Alumno
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
