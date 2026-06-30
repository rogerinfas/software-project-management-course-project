"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tariffSchema } from "./_schemas/tariffs.schema";
import { TariffFormValues } from "./_types/tariffs.types";
import { useTariffsData, useTariffsMutations } from "./_hooks/tariffs-hooks";
import { TariffsHeader } from "./_components/header/tariffs-header";
import { TariffsKpi } from "./_components/stats/tariffs-kpi";
import { TariffsTable } from "./_components/table/tariffs-table";
import { TariffsDialogs } from "./_components/create/tariffs-dialogs";

export default function TariffsPage() {
  const [search, setSearch] = React.useState("");
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  const createForm = useForm<TariffFormValues>({
    resolver: zodResolver(tariffSchema),
    defaultValues: { concept: "", amount: "", type: "MONTHLY", level: "PRIMARY" },
  });

  const editForm = useForm<TariffFormValues>({
    resolver: zodResolver(tariffSchema),
    defaultValues: { concept: "", amount: "", type: "MONTHLY", level: "PRIMARY" },
  });

  const { tariffs, isLoading } = useTariffsData();
  const { createMutation, updateMutation, deleteMutation } = useTariffsMutations(
    createForm, editForm, setNewOpen, setEditOpen, setEditId
  );

  const openEdit = (tariff: any) => {
    setEditId(tariff.id);
    editForm.setValue("concept", tariff.concept);
    editForm.setValue("amount", tariff.amount.toString());
    editForm.setValue("type", tariff.type);
    editForm.setValue("level", tariff.level);
    setEditOpen(true);
  };

  const filteredTariffs = tariffs?.filter((t) =>
    t.concept.toLowerCase().includes(search.toLowerCase())
  );

  const totalConcepts = tariffs?.length || 0;
  const averageAmount = tariffs?.length
    ? Number((tariffs.reduce((acc, curr) => acc + curr.amount, 0) / tariffs.length).toFixed(2))
    : 0.0;
  const primaryCount = tariffs?.filter((t) => t.level === "PRIMARY").length || 0;
  const secondaryCount = tariffs?.filter((t) => t.level === "SECONDARY").length || 0;

  return (
    <div className="space-y-6">
      <TariffsHeader setNewOpen={setNewOpen} />

      <TariffsKpi
        totalConcepts={totalConcepts}
        averageAmount={averageAmount}
        primaryCount={primaryCount}
        secondaryCount={secondaryCount}
      />

      <TariffsTable
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
        filteredTariffs={filteredTariffs || []}
        openEdit={openEdit}
        deleteMutation={deleteMutation}
      />

      <TariffsDialogs
        newOpen={newOpen}
        setNewOpen={setNewOpen}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        createForm={createForm}
        editForm={editForm}
        createMutation={createMutation}
        updateMutation={updateMutation}
        editId={editId}
      />
    </div>
  );
}
