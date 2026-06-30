"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { scheduleSchema } from "./_schemas/schedules.schema";
import { ScheduleFormValues, Schedule } from "./_types/schedules.types";
import { useSchedulesData, useSchedulesMutations } from "./_hooks/schedules-hooks";

import { ScheduleHeader } from "./_components/header/schedule-header";
import { ScheduleGrid } from "./_components/table/schedule-grid";
import { ScheduleCreateDialog } from "./_components/create/schedule-create-dialog";
import { ScheduleEditDialog } from "./_components/edit/schedule-edit-dialog";

export default function SchedulesPage() {
  // Selected filters
  const [selectedSection, setSelectedSection] = React.useState<string>("ALL");

  // Create Dialog
  const [newOpen, setNewOpen] = React.useState(false);

  // Edit Dialog
  const [editOpen, setEditOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  // Forms
  const createForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { section: "", course: "", teacher: "", day: "1", start: "08:00", end: "09:30" },
  });

  const editForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { section: "", course: "", teacher: "", day: "1", start: "08:00", end: "09:30" },
  });

  // Data & Mutations
  const {
    sections, courses, teachers, schedules,
    loadingSections, loadingCourses, loadingTeachers, loadingSchedules
  } = useSchedulesData(selectedSection);
  const { createMutation, updateMutation, deleteMutation } = useSchedulesMutations();

  // Handlers
  const handleCreate = (data: ScheduleFormValues) => {
    if (!data.section || !data.course || !data.teacher) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    createMutation.mutate(
      {
        body: {
          sectionId: data.section,
          courseId: data.course,
          staffId: data.teacher,
          day: Number(data.day),
          startTime: data.start,
          endTime: data.end,
        },
      },
      {
        onSuccess: () => {
          setNewOpen(false);
        },
      }
    );
  };

  const handleUpdate = (data: ScheduleFormValues) => {
    if (!editId || !data.section || !data.course || !data.teacher) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    updateMutation.mutate(
      {
        params: { path: { id: editId } },
        body: {
          sectionId: data.section,
          courseId: data.course,
          staffId: data.teacher,
          day: Number(data.day),
          startTime: data.start,
          endTime: data.end,
        },
      },
      {
        onSuccess: () => {
          setEditOpen(false);
        },
      }
    );
  };

  const handleDelete = (s: Schedule) => {
    if (confirm(`¿Estás seguro de eliminar esta clase de "${s.course?.name}"?`)) {
      deleteMutation.mutate({ params: { path: { id: s.id } } });
    }
  };

  const startEdit = (s: Schedule) => {
    setEditId(s.id);
    editForm.reset({
      section: s.sectionId,
      course: s.courseId,
      teacher: s.staffId,
      day: String(s.day),
      start: s.startTime,
      end: s.endTime,
    });
    setEditOpen(true);
  };

  // Populate first values
  React.useEffect(() => {
    if (sections && sections.length > 0) {
      if (!createForm.getValues("section")) {
        createForm.setValue("section", sections[0].id);
      }
    }
    if (courses && courses.length > 0) {
      if (!createForm.getValues("course")) {
        createForm.setValue("course", courses[0].id);
      }
    }
    if (teachers && teachers.length > 0) {
      if (!createForm.getValues("teacher")) {
        createForm.setValue("teacher", teachers[0].id);
      }
    }
  }, [sections, courses, teachers, createForm]);

  const list = schedules ?? [];
  const secList = sections ?? [];
  const courseList = courses ?? [];
  const teachList = teachers ?? [];

  return (
    <div className="space-y-6">
      <ScheduleHeader onNewOpen={() => setNewOpen(true)} />

      <ScheduleGrid
        isLoading={loadingSchedules || loadingSections || loadingCourses || loadingTeachers}
        list={list}
        secList={secList}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        onEdit={startEdit}
        onDelete={handleDelete}
      />

      <ScheduleCreateDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        form={createForm}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
        sections={secList}
        courses={courseList}
        teachers={teachList}
      />

      <ScheduleEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        form={editForm}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
        sections={secList}
        courses={courseList}
        teachers={teachList}
      />
    </div>
  );
}
