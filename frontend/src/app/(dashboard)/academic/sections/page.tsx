"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { sectionSchema } from "./_schemas/sections.schema";
import { SectionFormValues, Section } from "./_types/sections.types";
import { useSections, useSectionsMutations } from "./_hooks/sections-hooks";

import { SectionHeader } from "./_components/header/section-header";
import { SectionKpi } from "./_components/header/section-kpi";
import { SectionsTable } from "./_components/table/sections-table";
import { SectionCreateDialog } from "./_components/create/section-create-dialog";
import { SectionEditDialog } from "./_components/edit/section-edit-dialog";

export default function SectionsPage() {
  // Filters & State
  const [levelFilter, setLevelFilter] = React.useState("ALL");

  // Dialog open state
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  // Forms
  const createForm = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema) as any,
    defaultValues: { name: "", grade: "", level: "PRIMARY", capacity: 30 },
  });

  const editForm = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema) as any,
    defaultValues: { name: "", grade: "", level: "PRIMARY", capacity: 30, status: "OPEN" },
  });

  // Data & Mutations
  const { sections, isLoading } = useSections(levelFilter);
  const { createMutation, updateMutation, deleteMutation } = useSectionsMutations();

  // Handlers
  const handleCreate = (data: SectionFormValues) => {
    if (!data.name.trim() || !data.grade.trim()) {
      toast.error("El nombre y grado son requeridos");
      return;
    }
    createMutation.mutate(
      {
        body: {
          name: data.name,
          grade: data.grade,
          level: data.level,
          capacity: Number(data.capacity),
          status: "OPEN",
        },
      },
      {
        onSuccess: () => {
          createForm.reset();
          setNewOpen(false);
        },
      }
    );
  };

  const handleUpdate = (data: SectionFormValues) => {
    if (!editId || !data.name.trim() || !data.grade.trim()) {
      toast.error("El nombre y grado son requeridos");
      return;
    }
    updateMutation.mutate(
      {
        params: { path: { id: editId } },
        body: {
          name: data.name,
          grade: data.grade,
          level: data.level,
          capacity: Number(data.capacity),
          status: data.status,
        },
      },
      {
        onSuccess: () => {
          setEditId(null);
          setEditOpen(false);
        },
      }
    );
  };

  const handleDelete = (s: Section) => {
    if ((s.matriculados ?? 0) > 0) {
      toast.warning("No puedes eliminar una sección con estudiantes matriculados.");
      return;
    }
    if (confirm(`¿Estás seguro de eliminar la sección "${s.grade} - ${s.name}"?`)) {
      deleteMutation.mutate({ params: { path: { id: s.id } } });
    }
  };

  const startEdit = (s: Section) => {
    setEditId(s.id);
    editForm.reset({
      name: s.name,
      grade: s.grade,
      level: s.level,
      capacity: s.capacity,
      status: (s.status as any) || "OPEN",
    });
    setEditOpen(true);
  };

  const list: Section[] = sections ?? [];

  return (
    <div className="space-y-6">
      <SectionHeader onNewOpen={() => setNewOpen(true)} />

      <SectionKpi list={list} />

      <SectionsTable
        isLoading={isLoading}
        list={list}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        onEdit={startEdit}
        onDelete={handleDelete}
      />

      <SectionCreateDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        form={createForm}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      <SectionEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        form={editForm}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
