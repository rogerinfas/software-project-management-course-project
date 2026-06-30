import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";
import { UseFormReturn } from "react-hook-form";
import { GuardianFormValues } from "../_types/guardians.types";

export function useGuardiansData(page: number, size: number, search: string) {
  const { data: guardiansData, isLoading } = backend.useQuery(
    "get",
    "/api/enrollment/guardians",
    {
      params: {
        query: {
          page,
          size,
          search: search || undefined,
        },
      },
    }
  );

  return { guardiansData, isLoading };
}

export function useGuardiansMutations(
  createForm: UseFormReturn<GuardianFormValues>,
  editForm: UseFormReturn<GuardianFormValues>,
  setNewOpen: (val: boolean) => void,
  setEditId: (val: string | null) => void
) {
  const queryClient = useQueryClient();

  const createMutation = backend.useMutation("post", "/api/enrollment/guardians", {
    onSuccess: () => {
      toast.success("Apoderado registrado con éxito");
      createForm.reset();
      setNewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/guardians"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("put", "/api/enrollment/guardians/{id}", {
    onSuccess: () => {
      toast.success("Datos del apoderado actualizados");
      setEditId(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/guardians"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/enrollment/guardians/{id}", {
    onSuccess: () => {
      toast.success("Apoderado eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/guardians"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
