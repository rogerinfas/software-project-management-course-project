import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function useSchedulesData(selectedSection: string) {
  const { data: sections, isLoading: loadingSections } = backend.useQuery("get", "/api/academic/sections", {} as any);
  const { data: courses, isLoading: loadingCourses } = backend.useQuery("get", "/api/academic/courses", {} as any);
  const { data: teachers, isLoading: loadingTeachers } = backend.useQuery("get", "/api/academic/teachers", {} as any);

  const { data: schedules, isLoading: loadingSchedules } = backend.useQuery(
    "get",
    "/api/academic/schedules",
    {
      params: {
        query: {
          sectionId: selectedSection === "ALL" ? undefined : selectedSection,
        } as any,
      },
    }
  );

  return {
    sections, courses, teachers, schedules,
    loadingSections, loadingCourses, loadingTeachers, loadingSchedules
  };
}

export function useSchedulesMutations() {
  const queryClient = useQueryClient();

  const createMutation = backend.useMutation("post", "/api/academic/schedules", {
    onSuccess: () => {
      toast.success("Horario escolar asignado correctamente");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/schedules"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("patch", "/api/academic/schedules/{id}", {
    onSuccess: () => {
      toast.success("Asignación de horario modificada correctamente");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/schedules"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/schedules/{id}", {
    onSuccess: () => {
      toast.success("Asignación de clase eliminada");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/schedules"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
