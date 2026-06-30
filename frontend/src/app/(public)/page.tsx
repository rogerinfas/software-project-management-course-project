"use client";

import React, { useState } from "react";
import { usePublicData, usePublicMutations } from "./_hooks/public-hooks";
import { PublicHeader } from "./_components/public-header";
import { HeroSection } from "./_components/hero-section";
import { StatsSection } from "./_components/stats-section";
import { BulletinsSection } from "./_components/bulletins-section";
import { AdmissionSection } from "./_components/admission-section";
import { PublicFooter } from "./_components/public-footer";

export default function LandingPage() {
  const [newOpen, setNewOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [nivel, setNivel] = useState<"INITIAL" | "PRIMARY" | "SECONDARY">("PRIMARY");
  const [grado, setGrado] = useState("1° primaria");

  const { communications, isLoading } = usePublicData();
  const { createProspectMutation } = usePublicMutations(
    setNewOpen, setNombre, setCelular, setNivel, setGrado
  );

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-primary/10">
      <PublicHeader />

      <main className="flex-1">
        <HeroSection />

        <StatsSection />

        <BulletinsSection
          isLoading={isLoading}
          communications={communications || []}
        />

        <AdmissionSection
          newOpen={newOpen}
          setNewOpen={setNewOpen}
          nombre={nombre}
          setNombre={setNombre}
          celular={celular}
          setCelular={setCelular}
          nivel={nivel}
          setNivel={setNivel}
          grado={grado}
          setGrado={setGrado}
          createProspectMutation={createProspectMutation}
        />
      </main>

      <PublicFooter />
    </div>
  );
}
