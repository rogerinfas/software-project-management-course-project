import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function useSections(levelFilter: string) {
  const { data: sections, isLoading } = backend.useQuery("get", "/api/academic/sections", {
    params: {
      query: {
        level: levelFilter === "ALL" ? undefined : (levelFilter as any),
      } as any,
    },
  });

  return { sections, isLoading };
}

export function useSectionsMutations() {
  const queryClient = useQueryClient();

  const createMutation = backend.useMutation("post", "/api/academic/sections", {
    onSuccess: () => {
      toast.success("Sección creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/sections"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("patch", "/api/academic/sections/{id}", {
    onSuccess: () => {
      toast.success("Sección actualizada con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/sections"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/sections/{id}", {
    onSuccess: () => {
      toast.success("Sección eliminada con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/sections"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
