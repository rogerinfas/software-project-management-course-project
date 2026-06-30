import { backend } from "@/lib/api/types/backend";

export function useTeacherLoad() {
  const { data: teachers, isLoading: loadingTeachers } = backend.useQuery("get", "/api/academic/teachers", {} as any);
  const { data: allSchedules, isLoading: loadingSchedules } = backend.useQuery("get", "/api/academic/schedules", {} as any);

  return { teachers, allSchedules, loadingTeachers, loadingSchedules };
}
