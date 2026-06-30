import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function WizardHeader({ step }: { step: number }) {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Formalización / Asignación</h1>
        <p className="text-muted-foreground text-sm">
          Convierte prospectos aptos en alumnos matriculados mediante un proceso guiado.
        </p>
      </div>

      <div className="flex items-center justify-between mb-8 mt-6">
        <StepIndicator num={1} label="Buscar Prospecto" active={step >= 0} completed={step > 0} />
        <StepLine active={step >= 1} />
        <StepIndicator num={2} label="Perfil Alumno" active={step >= 1} completed={step > 1} />
        <StepLine active={step >= 2} />
        <StepIndicator num={3} label="Apoderado" active={step >= 2} completed={step > 2} />
        <StepLine active={step >= 3} />
        <StepIndicator num={4} label="Matrícula" active={step >= 3} completed={step > 3} />
      </div>
    </>
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
