"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guardianSchema } from "./_schemas/guardians.schema";
import { GuardianFormValues } from "./_types/guardians.types";
import { useGuardiansData, useGuardiansMutations } from "./_hooks/guardians-hooks";
import { GuardiansHeader } from "./_components/header/guardians-header";
import { GuardiansKpi } from "./_components/stats/guardians-kpi";
import { GuardiansTable } from "./_components/table/guardians-table";
import { GuardiansDialog } from "./_components/create/guardians-dialog";

export default function ApoderadosPage() {
  // Filters & State
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [size] = React.useState(10);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [newOpen, setNewOpen] = React.useState(false);

  // React Hook Form setups
  const createForm = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianSchema),
    defaultValues: { name: "", dni: "", phone: "", email: "", occupation: "" },
  });

  const editForm = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianSchema),
    defaultValues: { name: "", dni: "", phone: "", email: "", occupation: "" },
  });

  // Queries & Mutations
  const { guardiansData, isLoading } = useGuardiansData(page, size, search);
  const { createMutation, updateMutation, deleteMutation } = useGuardiansMutations(
    createForm, editForm, setNewOpen, setEditId
  );

  const totalGuardians = guardiansData?.meta?.total ?? 0;
  const list = guardiansData?.data ?? [];

  return (
    <div className="space-y-6">
      <GuardiansHeader setNewOpen={setNewOpen} />

      <GuardiansKpi totalGuardians={totalGuardians} list={list} />

      <GuardiansTable
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        page={page}
        isLoading={isLoading}
        list={list}
        guardiansData={guardiansData}
        editId={editId}
        setEditId={setEditId}
        editForm={editForm}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
      />

      <GuardiansDialog
        newOpen={newOpen}
        setNewOpen={setNewOpen}
        createForm={createForm}
        createMutation={createMutation}
      />
    </div>
  );
}
