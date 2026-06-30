"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { announcementSchema } from "./_schemas/announcements.schema";
import { AnnouncementFormValues, Announcement } from "./_types/announcements.types";
import { useAnnouncements, useAnnouncementsMutations } from "./_hooks/announcements-hooks";

import { AnnouncementsHeader } from "./_components/header/announcements-header";
import { AnnouncementsKpi } from "./_components/header/announcements-kpi";
import { AnnouncementsTable } from "./_components/table/announcements-table";
import { AnnouncementCreateDialog } from "./_components/create/announcement-create-dialog";
import { AnnouncementEditDialog } from "./_components/edit/announcement-edit-dialog";

export default function AnnouncementsPage() {
  // Filters & Search
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");

  // Dialog open state
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  // Forms
  const createForm = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", content: "", category: "Informativo", expiresAt: "" },
  });

  const editForm = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", content: "", category: "Informativo", expiresAt: "" },
  });

  // Data & Mutations
  const { communications, isLoading } = useAnnouncements(categoryFilter, search);
  const { createMutation, updateMutation, deleteMutation } = useAnnouncementsMutations();

  // Handlers
  const handleCreate = (data: AnnouncementFormValues) => {
    if (!data.title.trim() || !data.content.trim()) {
      toast.error("El título y el contenido son obligatorios");
      return;
    }
    createMutation.mutate(
      {
        body: {
          title: data.title,
          content: data.content,
          category: data.category,
          expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
        } as any,
      },
      {
        onSuccess: () => {
          createForm.reset();
          setNewOpen(false);
        },
      }
    );
  };

  const handleUpdateSubmit = (data: AnnouncementFormValues) => {
    if (!editId) return;
    if (!data.title.trim() || !data.content.trim()) {
      toast.error("El título y el contenido son obligatorios");
      return;
    }
    updateMutation.mutate(
      {
        params: { path: { id: editId } },
        body: {
          title: data.title,
          content: data.content,
          category: data.category,
          expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
        } as any,
      },
      {
        onSuccess: () => {
          setEditId(null);
          setEditOpen(false);
        },
      }
    );
  };

  const handleDelete = (c: Announcement) => {
    if (confirm(`¿Estás seguro que deseas eliminar el comunicado "${c.title}"?`)) {
      deleteMutation.mutate({ params: { path: { id: c.id } } });
    }
  };

  const startEdit = (c: Announcement) => {
    setEditId(c.id);
    editForm.reset({
      title: c.title,
      content: c.content,
      category: c.category,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().split("T")[0] : "",
    });
    setEditOpen(true);
  };

  const list: Announcement[] = communications ?? [];

  return (
    <div className="space-y-6">
      <AnnouncementsHeader onNewOpen={() => setNewOpen(true)} />
      
      <AnnouncementsKpi list={list} />

      <AnnouncementsTable
        isLoading={isLoading}
        list={list}
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onEdit={startEdit}
        onDelete={handleDelete}
      />

      <AnnouncementCreateDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        form={createForm}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      <AnnouncementEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        form={editForm}
        onSubmit={handleUpdateSubmit}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
