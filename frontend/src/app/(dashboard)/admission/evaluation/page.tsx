"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { evaluationSchema } from "./_schemas/evaluation.schema";
import { EvaluationFormValues } from "./_types/evaluation.types";
import { useEvaluationProspects, useEvaluationMutations } from "./_hooks/evaluation-hooks";

import { EvaluationHeader } from "./_components/header/evaluation-header";
import { EvaluationSidebar } from "./_components/table/evaluation-sidebar";
import { EvaluationDetails } from "./_components/create/evaluation-details";

export default function EvaluationPage() {
  const [search, setSearch] = React.useState("");
  const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"verdict" | "process" | "profile">("verdict");

  // React Hook Form
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      aptitude: "PENDING",
      comments: "",
    },
  });

  const { reset } = form;

  // Data & Mutations
  const { prospects, isLoading } = useEvaluationProspects();
  const { evaluateMutation } = useEvaluationMutations();

  // Filtered prospects
  const filteredProspects = React.useMemo(() => {
    return prospects.filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [prospects, search]);

  const selectedProspect = React.useMemo(() => {
    return prospects.find((p: any) => p.id === selectedProspectId);
  }, [prospects, selectedProspectId]);

  // Set default form values when prospect changes
  React.useEffect(() => {
    if (selectedProspect) {
      reset({
        aptitude: (selectedProspect.evaluation?.aptitude as any) || "PENDING",
        comments: selectedProspect.evaluation?.comments || "",
      });
      setActiveTab("verdict");
    }
  }, [selectedProspect, reset]);

  const onSubmitForm = (data: EvaluationFormValues) => {
    if (!selectedProspectId) return;

    evaluateMutation.mutate({
      params: { path: { id: selectedProspectId } },
      body: {
        aptitude: data.aptitude as any,
        comments: data.comments,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando postulantes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <EvaluationHeader />

      <div className="grid gap-6 md:grid-cols-3">
        <EvaluationSidebar
          search={search}
          setSearch={setSearch}
          filteredProspects={filteredProspects}
          selectedProspectId={selectedProspectId}
          setSelectedProspectId={setSelectedProspectId}
        />

        <EvaluationDetails
          selectedProspect={selectedProspect}
          form={form}
          onSubmit={onSubmitForm}
          isPending={evaluateMutation.isPending}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
