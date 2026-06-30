"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, User, UserPlus, Users, School, ArrowRight, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backend } from "@/lib/api/types/backend";
import { cn } from "@/lib/utils";

const studentSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z.string().length(8, "DNI debe tener exactamente 8 caracteres"),
});

const guardianSchema = z.object({
  guardianName: z.string().min(5, "El nombre completo debe tener al menos 5 caracteres"),
  guardianDni: z.string().length(8, "DNI del apoderado debe tener 8 caracteres"),
  guardianPhone: z.string().min(6, "Teléfono inválido"),
  guardianEmail: z.string().email("Correo inválido").or(z.literal("")),
  guardianOccupation: z.string().optional(),
});

export default function FormalizacionWizardPage() {
  const queryClient = useQueryClient();

  const [step, setStep] = React.useState<0 | 1 | 2 | 3>(0);
  const [selectedProspect, setSelectedProspect] = React.useState<any | null>(null);
  const [createdStudentId, setCreatedStudentId] = React.useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);

  // Queries
  const { data: prospectsData, isLoading: isLoadingProspects } = backend.useQuery(
    "get",
    "/api/admission/prospects",
    { query: { aptitude: "FIT" } }
  );

  const { data: sections, isLoading: isLoadingSections } = backend.useQuery(
    "get",
    "/api/enrollment/sections",
    {}
  );

  // Mutations
  const createStudentMutation = backend.useMutation("post", "/api/enrollment/formalization/student");
  const assignGuardianMutation = backend.useMutation("post", "/api/enrollment/formalization/guardian");
  const enrollStudentMutation = backend.useMutation("post", "/api/enrollment/formalization/section");

  // Forms
  const studentForm = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: { firstName: "", lastName: "", dni: "" },
  });

  const guardianForm = useForm({
    resolver: zodResolver(guardianSchema),
    defaultValues: { guardianName: "", guardianDni: "", guardianPhone: "", guardianEmail: "", guardianOccupation: "" },
  });

  const handleSelectProspect = (prospect: any) => {
    setSelectedProspect(prospect);
    const nameParts = prospect.name ? prospect.name.split(" ") : ["", ""];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    studentForm.reset({
      firstName,
      lastName,
      dni: "",
    });
    guardianForm.reset({
      guardianName: "",
      guardianDni: "",
      guardianPhone: prospect.phone || "",
      guardianEmail: "",
      guardianOccupation: "",
    });
    setStep(1);
  };

  const handleCreateStudent = (data: z.infer<typeof studentSchema>) => {
    if (!selectedProspect) return;
    createStudentMutation.mutate(
      {
        body: {
          prospectId: selectedProspect.id,
          firstName: data.firstName,
          lastName: data.lastName,
          dni: data.dni,
          level: selectedProspect.level,
          grade: selectedProspect.targetGrade,
        },
      },
      {
        onSuccess: (res: any) => {
          toast.success("Perfil de alumno creado con éxito");
          setCreatedStudentId(res.id);
          setStep(2);
        },
        onError: (err: any) => toast.error(err?.message || "Error al crear alumno"),
      }
    );
  };

  const handleAssignGuardian = (data: z.infer<typeof guardianSchema>) => {
    if (!createdStudentId) return;
    assignGuardianMutation.mutate(
      {
        body: {
          studentId: createdStudentId,
          guardianDni: data.guardianDni,
          guardianName: data.guardianName,
          guardianPhone: data.guardianPhone,
          guardianEmail: data.guardianEmail || undefined,
          guardianOccupation: data.guardianOccupation || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Apoderado asignado con éxito");
          setStep(3);
        },
        onError: (err: any) => toast.error(err?.message || "Error al asignar apoderado"),
      }
    );
  };

  const handleEnrollStudent = () => {
    if (!createdStudentId || !selectedSectionId) return;
    enrollStudentMutation.mutate(
      {
        body: {
          studentId: createdStudentId,
          sectionId: selectedSectionId,
        },
      },
      {
        onSuccess: () => {
          toast.success("Matrícula completada con éxito. El prospecto ahora es alumno matriculado.");
          queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/prospects"] });
          queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/sections"] });
          queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/students"] });
          queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/documents"] });
          setStep(0);
          setSelectedProspect(null);
          setCreatedStudentId(null);
          setSelectedSectionId(null);
        },
        onError: (err: any) => toast.error(err?.message || "Error al matricular"),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Formalización / Asignación</h1>
        <p className="text-muted-foreground text-sm">
          Convierte prospectos aptos en alumnos matriculados mediante un proceso guiado.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8">
        <StepIndicator num={1} label="Buscar Prospecto" active={step >= 0} completed={step > 0} />
        <StepLine active={step >= 1} />
        <StepIndicator num={2} label="Perfil Alumno" active={step >= 1} completed={step > 1} />
        <StepLine active={step >= 2} />
        <StepIndicator num={3} label="Apoderado" active={step >= 2} completed={step > 2} />
        <StepLine active={step >= 3} />
        <StepIndicator num={4} label="Matrícula" active={step >= 3} completed={step > 3} />
      </div>

      {/* Step 0: Search Prospect */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prospectos Aptos (FIT)</CardTitle>
            <CardDescription>Seleccione un prospecto apto para iniciar su formalización.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProspects ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
            ) : prospectsData?.data?.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">No hay prospectos aptos pendientes de formalización.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {prospectsData?.data?.map((p: any) => (
                  <div key={p.id} className="p-4 border rounded-xl flex justify-between items-center bg-card hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.level} / {p.targetGrade}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleSelectProspect(p)}>
                      Seleccionar <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 1: Create Student */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Perfil de Alumno</CardTitle>
            <CardDescription>Valide los datos del prospecto antes de convertirlo en alumno.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={studentForm.handleSubmit(handleCreateStudent)} className="space-y-4 max-w-md">
              <div>
                <Label>Nombres</Label>
                <Input {...studentForm.register("firstName")} />
                {studentForm.formState.errors.firstName && <p className="text-sm text-red-500 mt-1">{studentForm.formState.errors.firstName.message}</p>}
              </div>
              <div>
                <Label>Apellidos</Label>
                <Input {...studentForm.register("lastName")} />
                {studentForm.formState.errors.lastName && <p className="text-sm text-red-500 mt-1">{studentForm.formState.errors.lastName.message}</p>}
              </div>
              <div>
                <Label>DNI</Label>
                <Input {...studentForm.register("dni")} />
                {studentForm.formState.errors.dni && <p className="text-sm text-red-500 mt-1">{studentForm.formState.errors.dni.message}</p>}
              </div>
              <div className="pt-4 flex gap-2">
                <Button variant="outline" type="button" onClick={() => setStep(0)}>Volver</Button>
                <Button type="submit" disabled={createStudentMutation.isPending}>
                  {createStudentMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Crear Alumno
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Assign Guardian */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Asignar Apoderado</CardTitle>
            <CardDescription>El perfil del alumno se ha creado. Ahora asigne un apoderado responsable.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={guardianForm.handleSubmit(handleAssignGuardian)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre Completo del Apoderado</Label>
                <Input {...guardianForm.register("guardianName")} />
                {guardianForm.formState.errors.guardianName && <p className="text-sm text-red-500 mt-1">{guardianForm.formState.errors.guardianName.message}</p>}
              </div>
              <div>
                <Label>DNI del Apoderado</Label>
                <Input {...guardianForm.register("guardianDni")} />
                {guardianForm.formState.errors.guardianDni && <p className="text-sm text-red-500 mt-1">{guardianForm.formState.errors.guardianDni.message}</p>}
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input {...guardianForm.register("guardianPhone")} />
                {guardianForm.formState.errors.guardianPhone && <p className="text-sm text-red-500 mt-1">{guardianForm.formState.errors.guardianPhone.message}</p>}
              </div>
              <div>
                <Label>Correo Electrónico (Opcional)</Label>
                <Input {...guardianForm.register("guardianEmail")} type="email" />
                {guardianForm.formState.errors.guardianEmail && <p className="text-sm text-red-500 mt-1">{guardianForm.formState.errors.guardianEmail.message}</p>}
              </div>
              <div className="md:col-span-2 pt-4 flex gap-2">
                <Button type="submit" disabled={assignGuardianMutation.isPending}>
                  {assignGuardianMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Guardar y Continuar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Section */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Asignar Sección y Matricular</CardTitle>
            <CardDescription>El prospecto postuló para {selectedProspect?.level} / {selectedProspect?.targetGrade}. Seleccione la sección definitiva.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              {sections?.filter((s: any) => s.level === selectedProspect?.level && s.grade === selectedProspect?.targetGrade).map((s: any) => {
                const matriculados = s.matriculados ?? 0;
                const capacity = s.capacity ?? 25;
                const pct = Math.round((matriculados / capacity) * 100);
                const isSelected = selectedSectionId === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => { if (matriculados < capacity) setSelectedSectionId(s.id); }}
                    className={cn(
                      "border rounded-xl p-4 cursor-pointer transition-all duration-200",
                      isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-border-hover",
                      matriculados >= capacity ? "opacity-50 cursor-not-allowed" : ""
                    )}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm">{s.grade} - {s.name}</span>
                      <span className="text-xs text-muted-foreground">{matriculados}/{capacity}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full", pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button disabled={!selectedSectionId || enrollStudentMutation.isPending} onClick={handleEnrollStudent}>
                {enrollStudentMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Completar Matrícula
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StepIndicator({ num, label, active, completed }: { num: number; label: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "flex items-center justify-center size-10 rounded-full border-2 text-sm font-bold transition-colors",
        completed ? "bg-primary border-primary text-primary-foreground" :
        active ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground"
      )}>
        {completed ? <CheckCircle2 className="size-5" /> : num}
      </div>
      <span className={cn("text-xs font-medium", active ? "text-foreground" : "text-muted-foreground")}>{label}</span>
    </div>
  );
}

function StepLine({ active }: { active: boolean }) {
  return (
    <div className="flex-1 h-0.5 mx-4 bg-muted">
      <div className={cn("h-full transition-all duration-500", active ? "bg-primary w-full" : "w-0")} />
    </div>
  );
}
