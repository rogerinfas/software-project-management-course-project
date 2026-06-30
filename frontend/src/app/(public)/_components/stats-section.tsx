import * as React from "react";
import { Users, GraduationCap, Award, ShieldCheck } from "lucide-react";

export function StatsSection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-primary/10 p-3">
                <Users className="size-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">450+</p>
            <p className="text-sm text-muted-foreground font-medium">Alumnos Felices</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-primary/10 p-3">
                <GraduationCap className="size-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">25+</p>
            <p className="text-sm text-muted-foreground font-medium">Años de Excelencia</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-primary/10 p-3">
                <Award className="size-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">100%</p>
            <p className="text-sm text-muted-foreground font-medium">Calidad Académica</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-primary/10 p-3">
                <ShieldCheck className="size-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">Cert.</p>
            <p className="text-sm text-muted-foreground font-medium">Entorno Seguro</p>
          </div>
        </div>
      </div>
    </section>
  );
}
