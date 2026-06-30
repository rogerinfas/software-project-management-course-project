"use client";

import * as React from "react";
import { useTeacherLoad } from "./_hooks/teacher-load-hooks";
import { TeacherLoadHeader } from "./_components/header/teacher-load-header";
import { TeacherLoadKpi } from "./_components/header/teacher-load-kpi";
import { TeacherLoadGrid } from "./_components/table/teacher-load-grid";

export default function TeacherLoadPage() {
  // States
  const [search, setSearch] = React.useState("");

  // Data
  const { teachers, allSchedules, loadingTeachers, loadingSchedules } = useTeacherLoad();

  const list = teachers ?? [];
  const schedules = allSchedules ?? [];

  // Filter
  const filtered = list.filter((t: any) => {
    const name = t.user?.name ?? "";
    const specialty = t.specialty ?? "";
    const term = search.toLowerCase();
    return name.toLowerCase().includes(term) || specialty.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      <TeacherLoadHeader />

      <TeacherLoadKpi teachers={list} schedules={schedules} />

      <TeacherLoadGrid
        isLoading={loadingTeachers || loadingSchedules}
        filteredTeachers={filtered}
        schedules={schedules}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}
