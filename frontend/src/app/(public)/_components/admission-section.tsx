import * as React from "react";
import { GraduationCap, CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdmissionSectionProps {
  newOpen: boolean;
  setNewOpen: (val: boolean) => void;
  nombre: string;
  setNombre: (val: string) => void;
  celular: string;
  setCelular: (val: string) => void;
  nivel: string;
  setNivel: (val: any) => void;
  grado: string;
  setGrado: (val: string) => void;
  createProspectMutation: any;
}

const GRADOS_POR_NIVEL = {
  INITIAL: ["3 años", "4 años", "5 años"],
  PRIMARY: [
    "1° primaria",
    "2° primaria",
    "3° primaria",
    "4° primaria",
    "5° primaria",
    "6° primaria",
  ],
  SECONDARY: [
    "1° secundaria",
    "2° secundaria",
    "3° secundaria",
    "4° secundaria",
    "5° secundaria",
  ],
};

export function AdmissionSection({
  newOpen,
  setNewOpen,
  nombre,
  setNombre,
  celular,
  setCelular,
  nivel,
  setNivel,
  grado,
  setGrado,
  createProspectMutation,
}: AdmissionSectionProps) {

  const handleNivelChange = (newNivel: string | null) => {
    if (!newNivel) return;
    const typedNivel = newNivel as "INITIAL" | "PRIMARY" | "SECONDARY";
    setNivel(typedNivel);
    setGrado(GRADOS_POR_NIVEL[typedNivel][0]);
  };

  const onSubmitProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !celular) return toast.error("Completa todos los campos requeridos");
    createProspectMutation.mutate({
      body: {
        name: nombre,
        phone: celular,
        targetGrade: grado,
        level: nivel,
        priority: "MEDIUM",
      },
    });
  };

  return (
    <section id="admision" className="py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 md:px-16 md:py-20 text-primary-foreground shadow-2xl">
          <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20">
            <GraduationCap size={400} strokeWidth={1} />
          </div>
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Inicia el camino al éxito académico de tus hijos
              </h2>
              <p className="max-w-2xl text-lg text-primary-foreground/80">
                Nuestro proceso de admisión 2026 ya está abierto. Contamos con vacantes limitadas para Inicial y Primaria. Únete a una comunidad que prioriza los valores y la formación integral.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  "Excelencia académica demostrada",
                  "Plana docente altamente calificada",
                  "Infraestructura moderna y segura",
                  "Talleres extracurriculares variados",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle className="size-5 shrink-0 text-primary-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <Dialog open={newOpen} onOpenChange={setNewOpen}>
                <DialogTrigger 
                  className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "h-14 px-10 text-base font-bold shadow-xl flex items-center justify-center w-full sm:w-auto cursor-pointer")}
                >
                  Registrarse como Prospecto
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={onSubmitProspect}>
                    <DialogHeader>
                      <DialogTitle>Registro de Prospecto</DialogTitle>
                      <DialogDescription>
                        Déjanos tus datos para iniciar el proceso de admisión. Un asesor se comunicará contigo a la brevedad.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-foreground">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input
                          id="nombre"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Ej. Juan Pérez"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="celular">Celular de Contacto</Label>
                        <Input
                          id="celular"
                          value={celular}
                          onChange={(e) => setCelular(e.target.value)}
                          placeholder="Ej. 987654321"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nivel Educativo</Label>
                          <Select value={nivel} onValueChange={handleNivelChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INITIAL">Inicial</SelectItem>
                              <SelectItem value="PRIMARY">Primaria</SelectItem>
                              <SelectItem value="SECONDARY">Secundaria</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Grado de Interés</Label>
                          <Select value={grado} onValueChange={(val) => val && setGrado(val)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {GRADOS_POR_NIVEL[nivel as "INITIAL" | "PRIMARY" | "SECONDARY"].map((g) => (
                                <SelectItem key={g} value={g}>
                                  {g}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setNewOpen(false)}
                        disabled={createProspectMutation.isPending}
                        className="cursor-pointer"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={createProspectMutation.isPending} className="cursor-pointer">
                        {createProspectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Registrar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <p className="text-center text-xs text-primary-foreground/60 font-medium">
                Urb. La Estrella s/n J. L. B. y R., Arequipa, Peru.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
