"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { courseSchema } from "./_schemas/curriculum.schema";
import { CourseFormValues, Course } from "./_types/curriculum.types";
import { useCurriculum, useCurriculumMutations } from "./_hooks/curriculum-hooks";

import { CurriculumHeader } from "./_components/header/curriculum-header";
import { CurriculumKpi } from "./_components/header/curriculum-kpi";
import { CoursesTable } from "./_components/table/courses-table";
import { CourseCreateDialog } from "./_components/create/course-create-dialog";
import { CourseEditDialog } from "./_components/edit/course-edit-dialog";

export default function CurriculumPage() {
  // State
  const [search, setSearch] = React.useState("");

  // Dialog open state
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  // Forms
  const createForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: { name: "", description: "" },
  });

  const editForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: { name: "", description: "" },
  });

  // Data & Mutations
  const { courses, isLoading } = useCurriculum(search);
  const { createMutation, updateMutation, deleteMutation } = useCurriculumMutations();

  // Handlers
  const handleCreate = (data: CourseFormValues) => {
    if (!data.name.trim()) {
      toast.error("El nombre del curso es obligatorio");
      return;
    }
    createMutation.mutate(
      {
        body: {
          name: data.name,
          description: data.description || undefined,
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

  const handleUpdate = (data: CourseFormValues) => {
    if (!editId || !data.name.trim()) {
      toast.error("El nombre del curso es obligatorio");
      return;
    }
    updateMutation.mutate(
      {
        params: { path: { id: editId } },
        body: {
          name: data.name,
          description: data.description || undefined,
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

  const handleDelete = (c: Course) => {
    if (confirm(`¿Estás seguro que deseas eliminar el curso "${c.name}"?`)) {
      deleteMutation.mutate({ params: { path: { id: c.id } } });
    }
  };

  const startEdit = (c: Course) => {
    setEditId(c.id);
    editForm.reset({
      name: c.name,
      description: c.description || "",
    });
    setEditOpen(true);
  };

  const list: Course[] = courses ?? [];

  return (
    <div className="space-y-6">
      <CurriculumHeader onNewOpen={() => setNewOpen(true)} />
      
      <CurriculumKpi list={list} />

      <CoursesTable
        isLoading={isLoading}
        list={list}
        search={search}
        setSearch={setSearch}
        onEdit={startEdit}
        onDelete={handleDelete}
      />

      <CourseCreateDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        form={createForm}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      <CourseEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        form={editForm}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
