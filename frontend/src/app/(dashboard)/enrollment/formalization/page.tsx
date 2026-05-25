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

type EducationalLevel = "PRIMARY" | "SECONDARY";

export default function FormalizacionPage() {
  const queryClient = useQueryClient();

  // Form State
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [studentDni, setStudentDni] = React.useState("");
  const [level, setLevel] = React.useState<EducationalLevel>("PRIMARY");
  const [grade, setGrade] = React.useState("");
  const [sectionId, setSectionId] = React.useState("");

  // Guardian State
  const [guardianName, setGuardianName] = React.useState("");
  const [guardianDni, setGuardianDni] = React.useState("");
  const [guardianPhone, setGuardianPhone] = React.useState("");
  const [guardianEmail, setGuardianEmail] = React.useState("");
  const [guardianOcup, setGuardianOcup] = React.useState("");

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
      // Clear form
      setFirstName("");
      setLastName("");
      setStudentDni("");
      setGrade("");
      setSectionId("");
      setGuardianName("");
      setGuardianDni("");
      setGuardianPhone("");
      setGuardianEmail("");
      setGuardianOcup("");
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/sections"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/students"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/documents"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error al formalizar la matrícula");
    },
  });

  const activeSection = sections?.find((s: any) => s.id === sectionId);
  const isSectionFull = activeSection ? (activeSection.matriculados ?? 0) >= activeSection.capacity : false;
  const isGuardianInDebt = guardianDni.trim().endsWith("99");

  const gradeOptions = level === "PRIMARY" 
    ? ["1ro de Primaria", "2do de Primaria", "3ro de Primaria", "4to de Primaria", "5to de Primaria", "6to de Primaria"]
    : ["1ro de Secundaria", "2do de Secundaria", "3ro de Secundaria", "4to de Secundaria", "5to de Secundaria"];

  const handleFormalize = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sectionId) {
      toast.error("Por favor, selecciona una sección de destino.");
      return;
    }

    formalizeMutation.mutate({
      body: {
        firstName,
        lastName,
        dni: studentDni,
        level,
        grade,
        sectionId,
        guardianDni,
        guardianName,
        guardianPhone,
        guardianEmail: guardianEmail || undefined,
        guardianOccupation: guardianOcup || undefined,
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
                        setSectionId(s.id);
                        setLevel(s.level);
                        setGrade(s.grade);
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
      <form onSubmit={handleFormalize} className="grid gap-6 lg:grid-cols-2">
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
                <Label htmlFor="std-fname">Nombres *</Label>
                <Input
                  id="std-fname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombres"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-lname">Apellidos *</Label>
                <Input
                  id="std-lname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellidos"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-dni">DNI del Alumno *</Label>
                <Input
                  id="std-dni"
                  value={studentDni}
                  onChange={(e) => setStudentDni(e.target.value)}
                  maxLength={8}
                  placeholder="8 dígitos"
                  className="font-mono"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-level">Nivel Educativo *</Label>
                <Select
                  value={level}
                  onValueChange={(val) => {
                    if (val === "PRIMARY" || val === "SECONDARY") {
                      setLevel(val);
                      setGrade("");
                      setSectionId("");
                    }
                  }}
                >
                  <SelectTrigger id="std-level">
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARY">Primaria</SelectItem>
                    <SelectItem value="SECONDARY">Secundaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-grade">Grado de Postulación *</Label>
                <Select
                  value={grade}
                  onValueChange={(val) => {
                    setGrade(val || "");
                    setSectionId("");
                  }}
                >
                  <SelectTrigger id="std-grade">
                    <SelectValue placeholder="Grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="std-section">Sección Destino *</Label>
                <Select
                  value={sectionId}
                  onValueChange={(val) => setSectionId(val || "")}
                >
                  <SelectTrigger id="std-section">
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
                <Label htmlFor="g-name">Nombre Completo del Apoderado *</Label>
                <Input
                  id="g-name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="ej. Juan Pérez Delgado"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="g-dni">DNI Apoderado *</Label>
                  <Input
                    id="g-dni"
                    value={guardianDni}
                    onChange={(e) => setGuardianDni(e.target.value)}
                    maxLength={8}
                    placeholder="DNI"
                    className="font-mono"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="g-phone">Teléfono de Contacto *</Label>
                  <Input
                    id="g-phone"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="ej. 987654321"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="g-email">Correo Electrónico</Label>
                  <Input
                    id="g-email"
                    type="email"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="g-ocup">Ocupación</Label>
                  <Input
                    id="g-ocup"
                    value={guardianOcup}
                    onChange={(e) => setGuardianOcup(e.target.value)}
                    placeholder="ej. Administrador"
                  />
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
