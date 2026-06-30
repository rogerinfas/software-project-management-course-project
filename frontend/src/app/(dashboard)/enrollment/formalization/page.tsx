"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { studentSchema, guardianSchema } from "./_schemas/formalization.schema";
import { StudentFormValues, GuardianFormValues, WizardState } from "./_types/formalization.types";
import { useFormalizationData, useFormalizationMutations } from "./_hooks/formalization-hooks";

import { WizardHeader } from "./_components/header/wizard-header";
import { StepProspectsList } from "./_components/create/step-prospects-list";
import { StepStudentForm } from "./_components/create/step-student-form";
import { StepGuardianForm } from "./_components/create/step-guardian-form";
import { StepSectionAssignment } from "./_components/create/step-section-assignment";

export default function FormalizacionWizardPage() {
  const [state, setState] = React.useState<WizardState>({
    step: 0,
    selectedProspect: null,
    createdStudentId: null,
    selectedSectionId: null,
  });

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const { prospectsData, sections, isLoadingProspects } = useFormalizationData();
  const { createStudentMutation, assignGuardianMutation, enrollStudentMutation, invalidateEnrollmentQueries } = useFormalizationMutations();

  const studentForm = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: { firstName: "", lastName: "", dni: "" },
  });

  const guardianForm = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianSchema),
    defaultValues: { guardianName: "", guardianDni: "", guardianPhone: "", guardianEmail: "", guardianOccupation: "" },
  });

  const handleSelectProspect = (prospect: any) => {
    updateState({ selectedProspect: prospect, step: 1 });
    
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
  };

  const handleCreateStudent = (data: StudentFormValues) => {
    if (!state.selectedProspect) return;
    
    createStudentMutation.mutate(
      {
        body: {
          prospectId: state.selectedProspect.id,
          firstName: data.firstName,
          lastName: data.lastName,
          dni: data.dni,
          level: state.selectedProspect.level,
          grade: state.selectedProspect.targetGrade,
        },
      },
      {
        onSuccess: (res: any) => {
          toast.success("Perfil de alumno creado con éxito");
          updateState({ createdStudentId: res.id, step: 2 });
        },
        onError: (err: any) => toast.error(err?.message || "Error al crear alumno"),
      }
    );
  };

  const handleAssignGuardian = (data: GuardianFormValues) => {
    if (!state.createdStudentId) return;
    
    assignGuardianMutation.mutate(
      {
        body: {
          studentId: state.createdStudentId,
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
          updateState({ step: 3 });
        },
        onError: (err: any) => toast.error(err?.message || "Error al asignar apoderado"),
      }
    );
  };

  const handleEnrollStudent = () => {
    if (!state.createdStudentId || !state.selectedSectionId) return;
    
    enrollStudentMutation.mutate(
      {
        body: {
          studentId: state.createdStudentId,
          sectionId: state.selectedSectionId,
        },
      },
      {
        onSuccess: () => {
          toast.success("Matrícula completada con éxito. El prospecto ahora es alumno matriculado.");
          invalidateEnrollmentQueries();
          updateState({ step: 0, selectedProspect: null, createdStudentId: null, selectedSectionId: null });
        },
        onError: (err: any) => toast.error(err?.message || "Error al matricular"),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <WizardHeader step={state.step} />

      {state.step === 0 && (
        <StepProspectsList
          isLoading={isLoadingProspects}
          prospects={prospectsData?.data || []}
          onSelectProspect={handleSelectProspect}
        />
      )}

      {state.step === 1 && (
        <StepStudentForm
          form={studentForm}
          onSubmit={handleCreateStudent}
          isPending={createStudentMutation.isPending}
          onBack={() => updateState({ step: 0 })}
        />
      )}

      {state.step === 2 && (
        <StepGuardianForm
          form={guardianForm}
          onSubmit={handleAssignGuardian}
          isPending={assignGuardianMutation.isPending}
        />
      )}

      {state.step === 3 && (
        <StepSectionAssignment
          sections={sections || []}
          selectedProspect={state.selectedProspect}
          selectedSectionId={state.selectedSectionId}
          onSelectSection={(id) => updateState({ selectedSectionId: id })}
          onEnroll={handleEnrollStudent}
          isPending={enrollStudentMutation.isPending}
        />
      )}
    </div>
  );
}
