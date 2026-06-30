import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";
import { Interaction } from "../_types/pipeline.types";

export function usePipelineData(showEnrolled: boolean) {
  const { data: prospectsData, isLoading } = backend.useQuery("get", "/api/admission/prospects", {
    params: { query: { page: 1, size: 1000, includeFormalized: showEnrolled } }
  });

  const prospects = prospectsData?.data || [];

  return { prospects, isLoading };
}

export function useInteractions(selectedId: string | null) {
  const { data: interactionsData } = backend.useQuery(
    "get",
    "/api/admission/prospects/{id}/interactions",
    {
      params: { path: { id: selectedId || "" } },
    },
    { enabled: !!selectedId }
  );

  const history = interactionsData
    ? ([...interactionsData].sort((a, b) => (a.date < b.date ? 1 : -1)) as Interaction[])
    : [];

  return { history };
}

export function usePipelineMutations() {
  const queryClient = useQueryClient();

  const createProspectMutation = backend.useMutation("post", "/api/admission/prospects", {
    onSuccess: () => {
      toast.success("Prospecto creado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/prospects"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const moveProspectMutation = backend.useMutation("patch", "/api/admission/prospects/{id}/stage", {
    onSuccess: () => {
      toast.success("Postulante movido con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/prospects"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const createInteractionMutation = backend.useMutation("post", "/api/admission/prospects/{id}/interactions", {
    onSuccess: (_, variables) => {
      toast.success("Interacción registrada con éxito");
      queryClient.invalidateQueries({
        queryKey: ["get", "/api/admission/prospects/{id}/interactions", { params: { path: { id: variables.params.path.id } } }],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateInteractionMutation = backend.useMutation("put", "/api/admission/interactions/{id}", {
    onSuccess: (_, variables) => {
      toast.success("Interacción actualizada con éxito");
      // Since we don't have the prospect ID in variables for put, we rely on caller to invalidate or just invalidate all
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/prospects/{id}/interactions"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return {
    createProspectMutation,
    moveProspectMutation,
    createInteractionMutation,
    updateInteractionMutation,
  };
}
