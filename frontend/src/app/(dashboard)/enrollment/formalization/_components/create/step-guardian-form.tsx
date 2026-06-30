import * as React from "react";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GuardianFormValues } from "../../_types/formalization.types";

interface StepGuardianFormProps {
  form: UseFormReturn<GuardianFormValues>;
  onSubmit: (data: GuardianFormValues) => void;
  isPending: boolean;
}

export function StepGuardianForm({ form, onSubmit, isPending }: StepGuardianFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignar Apoderado</CardTitle>
        <CardDescription>El perfil del alumno se ha creado. Ahora asigne un apoderado responsable.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre Completo del Apoderado</Label>
            <Input {...form.register("guardianName")} />
            {form.formState.errors.guardianName && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.guardianName.message}</p>
            )}
          </div>
          <div>
            <Label>DNI del Apoderado</Label>
            <Input {...form.register("guardianDni")} />
            {form.formState.errors.guardianDni && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.guardianDni.message}</p>
            )}
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input {...form.register("guardianPhone")} />
            {form.formState.errors.guardianPhone && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.guardianPhone.message}</p>
            )}
          </div>
          <div>
            <Label>Correo Electrónico (Opcional)</Label>
            <Input {...form.register("guardianEmail")} type="email" />
            {form.formState.errors.guardianEmail && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.guardianEmail.message}</p>
            )}
          </div>
          <div className="md:col-span-2 pt-4 flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Guardar y Continuar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
