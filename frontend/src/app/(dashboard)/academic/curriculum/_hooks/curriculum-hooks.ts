import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function useCurriculum(search: string) {
  const { data: courses, isLoading } = backend.useQuery("get", "/api/academic/courses", {
    params: {
      query: {
        search: search || undefined,
      } as any,
    },
  });

  return { courses, isLoading };
}

export function useCurriculumMutations() {
  const queryClient = useQueryClient();

  const createMutation = backend.useMutation("post", "/api/academic/courses", {
    onSuccess: () => {
      toast.success("Curso creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("patch", "/api/academic/courses/{id}", {
    onSuccess: () => {
      toast.success("Curso actualizado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/courses/{id}", {
    onSuccess: () => {
      toast.success("Curso eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
