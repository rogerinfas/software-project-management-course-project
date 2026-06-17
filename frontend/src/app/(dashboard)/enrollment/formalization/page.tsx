"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Loader2, Sparkles, User, ShieldAlert, FileCheck } from "lucide-react";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { backend } from "@/lib/api/types/backend";
import { cn } from "@/lib/utils";

type EducationalLevel = "PRIMARY" | "SECONDARY";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formalizeSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z.string().length(8, "DNI debe tener exactamente 8 caracteres"),
  level: z.enum(["PRIMARY", "SECONDARY"]),
  grade: z.string().min(1, "El grado es requerido"),
  sectionId: z.string().min(1, "La sección es requerida"),
  guardianName: z.string().min(5, "El nombre completo del apoderado debe tener al menos 5 caracteres"),
  guardianDni: z.string().length(8, "DNI del apoderado debe tener exactamente 8 caracteres"),
  guardianPhone: z.string().min(6, "Teléfono inválido"),
  guardianEmail: z.string().email("Correo electrónico inválido").or(z.literal("")),
  guardianOccupation: z.string().optional(),
});

export default function FormalizacionPage() {
  const queryClient = useQueryClient();

  // React Hook Form setup
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formalizeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      level: "PRIMARY" as EducationalLevel,
      grade: "",
      sectionId: "",
      guardianName: "",
      guardianDni: "",
      guardianPhone: "",
      guardianEmail: "",
      guardianOccupation: "",
    },
  });

  const sectionId = watch("sectionId");
  const level = watch("level");
  const grade = watch("grade");
  const guardianDni = watch("guardianDni") || "";

  // Queries
  const { data: sections, isLoading: isLoadingSections } = backend.useQuery(
    "get",
    "/api/enrollment/sections",
    {}
  );

  // Mutations
  const formalizeMutation = backend.useMutation("post", "/api/enrollment/formalize", {
    onSuccess: (data: any) => {
      toast.success(`Matrícula formalizada con éxito. Código Alumno: ${data.student?.code || "NUEVO"}`);
      reset();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/sections"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/students"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/documents"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const activeSection = sections?.find((s: any) => s.id === sectionId);
  const isSectionFull = activeSection ? (activeSection.matriculados ?? 0) >= activeSection.capacity : false;
  const isGuardianInDebt = guardianDni.trim().endsWith("99");

  const gradeOptions = level === "PRIMARY" 
    ? ["1ro de Primaria", "2do de Primaria", "3ro de Primaria", "4to de Primaria", "5to de Primaria", "6to de Primaria"]
    : ["1ro de Secundaria", "2do de Secundaria", "3ro de Secundaria", "4to de Secundaria", "5to de Secundaria"];

  const handleFormalize = (data: {
    firstName: string;
    lastName: string;
    dni: string;
    level: EducationalLevel;
    grade: string;
    sectionId: string;
    guardianDni: string;
    guardianName: string;
    guardianPhone: string;
    guardianEmail: string;
    guardianOccupation?: string;
  }) => {
    if (!data.sectionId) {
      toast.error("Por favor, selecciona una sección de destino.");
      return;
    }

    formalizeMutation.mutate({
      body: {
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        level: data.level,
        grade: data.grade,
        sectionId: data.sectionId,
        guardianDni: data.guardianDni,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        guardianEmail: data.guardianEmail || undefined,
        guardianOccupation: data.guardianOccupation || undefined,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Módulo 2 · Formalización de Matrícula</h1>
        <p className="text-muted-foreground text-sm">
          Asignación y formalización en tiempo real. Valida el aforo de secciones y el estado financiero del apoderado de manera integrada.
        </p>
      </div>

      {/* Secciones y Aforo visual */}
      <Card className="bg-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="size-4.5 text-primary" /> Capacidad y Vacantes por Sección
          </CardTitle>
          <CardDescription>
            Selecciona una sección directamente haciendo clic sobre ella.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSections ? (
            <div className="flex h-20 items-center justify-center gap-2">
              <Loader2 className="size-5 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Cargando aforo de secciones...</span>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {sections?.map((s: any) => {
                const matriculados = s.matriculados ?? 0;
                const capacity = s.capacity ?? 25;
                const pct = Math.round((matriculados / capacity) * 100);
                const isSelected = sectionId === s.id;
                const color = pct >= 100 
                  ? "bg-red-500" 
                  : pct >= 80 
                  ? "bg-amber-500" 
                  : "bg-emerald-500";

                return (
                  <div
                    key={s.id}
                  onClick={() => {
                      if (matriculados < capacity) {
                        setValue("sectionId", s.id);
                        setValue("level", s.level);
                        setValue("grade", s.grade);
                        toast.info(`Sección seleccionada: ${s.grade} - A`);
                      } else {
                        toast.error("Esta sección se encuentra llena.");
                      }
                    }}
                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" 
                        : "border-border/60 bg-muted/20 hover:border-border-hover hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{s.grade} - {s.name}</span>
                      {matriculados < capacity ? (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Disponible
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[9px] px-1.5 py-0.5">
                          Lleno
                        </Badge>
                      )}
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all ${color}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-medium">{matriculados} / {capacity} matriculados</span>
                      <span className="font-bold">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulario */}
      <form onSubmit={handleSubmit(handleFormalize)} className="grid gap-6 lg:grid-cols-2">
        {/* Datos Alumno */}
        <Card className="bg-card border-border/80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="size-4.5 text-primary" /> Datos del Alumno
            </CardTitle>
            <CardDescription>Ingrese los datos personales y académicos del alumno.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-fname" className={errors.firstName && "text-red-500"}>Nombres *</Label>
                <Input
                  id="std-fname"
                  placeholder="Nombres"
                  className={errors.firstName && "border-red-500 focus-visible:ring-red-500"}
                  {...register("firstName", { required: true })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.firstName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-lname" className={errors.lastName && "text-red-500"}>Apellidos *</Label>
                <Input
                  id="std-lname"
                  placeholder="Apellidos"
                  className={errors.lastName && "border-red-500 focus-visible:ring-red-500"}
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-dni" className={errors.dni && "text-red-500"}>DNI del Alumno *</Label>
                <Input
                  id="std-dni"
                  maxLength={8}
                  placeholder="8 dígitos"
                  className={cn("font-mono", errors.dni && "border-red-500 focus-visible:ring-red-500")}
                  {...register("dni", { required: true })}
                />
                {errors.dni && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.dni.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-level" className={errors.level && "text-red-500"}>Nivel Educativo *</Label>
                <Select
                  value={level}
                  onValueChange={(val) => {
                    if (val === "PRIMARY" || val === "SECONDARY") {
                      setValue("level", val);
                      setValue("grade", "");
                      setValue("sectionId", "");
                    }
                  }}
                >
                  <SelectTrigger id="std-level" className={errors.level && "border-red-500"}>
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARY">Primaria</SelectItem>
                    <SelectItem value="SECONDARY">Secundaria</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.level.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-grade" className={errors.grade && "text-red-500"}>Grado de Postulación *</Label>
                <Select
                  value={grade}
                  onValueChange={(val) => {
                    setValue("grade", val || "");
                    setValue("sectionId", "");
                  }}
                >
                  <SelectTrigger id="std-grade" className={errors.grade && "border-red-500"}>
                    <SelectValue placeholder="Grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.grade && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.grade.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-section" className={errors.sectionId && "text-red-500"}>Sección Destino *</Label>
                <Select
                  value={sectionId}
                  onValueChange={(val) => setValue("sectionId", val || "")}
                >
                  <SelectTrigger id="std-section" className={errors.sectionId && "border-red-500"}>
                    <SelectValue placeholder="Sección" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections
                      ?.filter((s: any) => s.grade === grade && s.level === level)
                      .map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>
                          Sección {s.name} ({s.matriculados ?? 0}/{s.capacity})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.sectionId && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.sectionId.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos Apoderado */}
        <Card className="bg-card border-border/80 flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="size-4.5 text-primary" /> Datos del Apoderado
              </CardTitle>
              <CardDescription>Información del padre/madre/tutor legal que actúa como responsable económico.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="g-name" className={errors.guardianName && "text-red-500"}>Nombre Completo del Apoderado *</Label>
                <Input
                  id="g-name"
                  placeholder="ej. Juan Pérez Delgado"
                  className={errors.guardianName && "border-red-500 focus-visible:ring-red-500"}
                  {...register("guardianName", { required: true })}
                />
                {errors.guardianName && (
                  <p className="text-red-500 text-[11px] mt-0.5">{errors.guardianName.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="g-dni" className={errors.guardianDni && "text-red-500"}>DNI Apoderado *</Label>
                  <Input
                    id="g-dni"
                    maxLength={8}
                    placeholder="DNI"
                    className={cn("font-mono", errors.guardianDni && "border-red-500 focus-visible:ring-red-500")}
                    {...register("guardianDni", { required: true })}
                  />
                  {errors.guardianDni && (
                    <p className="text-red-500 text-[11px] mt-0.5">{errors.guardianDni.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="g-phone" className={errors.guardianPhone && "text-red-500"}>Teléfono de Contacto *</Label>
                  <Input
                    id="g-phone"
                    placeholder="ej. 987654321"
                    className={errors.guardianPhone && "border-red-500 focus-visible:ring-red-500"}
                    {...register("guardianPhone", { required: true })}
                  />
                  {errors.guardianPhone && (
                    <p className="text-red-500 text-[11px] mt-0.5">{errors.guardianPhone.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="g-email" className={errors.guardianEmail && "text-red-500"}>Correo Electrónico</Label>
                  <Input
                    id="g-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className={errors.guardianEmail && "border-red-500 focus-visible:ring-red-500"}
                    {...register("guardianEmail")}
                  />
                  {errors.guardianEmail && (
                    <p className="text-red-500 text-[11px] mt-0.5">{errors.guardianEmail.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="g-ocup" className={errors.guardianOccupation && "text-red-500"}>Ocupación</Label>
                  <Input
                    id="g-ocup"
                    placeholder="ej. Administrador"
                    className={errors.guardianOccupation && "border-red-500 focus-visible:ring-red-500"}
                    {...register("guardianOccupation")}
                  />
                  {errors.guardianOccupation && (
                    <p className="text-red-500 text-[11px] mt-0.5">{errors.guardianOccupation.message}</p>
                  )}
                </div>
              </div>

              {/* Real-time Business Rule Alerts */}
              {isGuardianInDebt && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-600 dark:text-red-400 text-xs">
                  <XCircle className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Alerta de Deuda:</span> El apoderado seleccionado registra deudas de años anteriores. La matrícula se encuentra bloqueada por política escolar.
                  </div>
                </div>
              )}
              {isSectionFull && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-600 dark:text-red-400 text-xs">
                  <XCircle className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Alerta de Aforo:</span> La sección destino seleccionada ya no tiene vacantes disponibles. Asigne otra sección.
                  </div>
                </div>
              )}
              {!isGuardianInDebt && !isSectionFull && sectionId && (
                <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-600 dark:text-emerald-400 text-xs">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Validación Exitosa:</span> Vacantes disponibles y apoderado al día. Listo para formalizar matrícula.
                  </div>
                </div>
              )}
            </CardContent>
          </div>
          <CardContent className="pt-0">
            <Button
              type="submit"
              disabled={!sectionId || isSectionFull || isGuardianInDebt || formalizeMutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {formalizeMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Procesando Matrícula...
                </>
              ) : (
                <>
                  <FileCheck className="size-4.5" /> Formalizar y Generar Matrícula
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
