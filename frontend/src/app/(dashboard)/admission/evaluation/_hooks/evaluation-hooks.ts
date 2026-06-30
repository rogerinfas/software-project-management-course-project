import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function useEvaluationProspects() {
  const { data: prospectsResponse, isLoading } = backend.useQuery("get", "/api/admission/prospects", {
    query: { page: 1, size: 100 }
  });

  const prospects = prospectsResponse?.data ? (prospectsResponse.data as any[]).map((p: any) => ({
    ...p,
    stageName: p.stage || "Sin Etapa",
  })) : [];

  return { prospects, isLoading };
}

export function useEvaluationMutations() {
  const queryClient = useQueryClient();

  const evaluateMutation = backend.useMutation("patch", "/api/admission/prospects/{id}/evaluation", {
    onSuccess: () => {
      toast.success("Evaluación guardada con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/prospects"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { evaluateMutation };
}
