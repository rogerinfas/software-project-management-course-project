import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";
import { UseFormReturn } from "react-hook-form";
import { AnnouncementFormValues } from "../_types/announcements.types";

export function useAnnouncements(categoryFilter: string, search: string) {
  const { data: communications, isLoading } = backend.useQuery(
    "get",
    "/api/academic/communications",
    {
      params: {
        query: {
          category: categoryFilter === "ALL" ? undefined : categoryFilter,
          search: search || undefined,
        } as any,
      },
    }
  );

  return { communications, isLoading };
}

export function useAnnouncementsMutations() {
  const queryClient = useQueryClient();

  const createMutation = backend.useMutation("post", "/api/academic/communications", {
    onSuccess: () => {
      toast.success("Comunicado publicado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/communications"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("patch", "/api/academic/communications/{id}", {
    onSuccess: () => {
      toast.success("Comunicado actualizado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/communications"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/academic/communications/{id}", {
    onSuccess: () => {
      toast.success("Comunicado eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/academic/communications"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
