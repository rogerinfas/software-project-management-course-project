import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";
import { UseFormReturn } from "react-hook-form";
import { TariffFormValues } from "../_types/tariffs.types";

export function useTariffsData() {
  const { data: tariffs, isLoading } = backend.useQuery(
    "get",
    "/api/treasury/tariffs",
    { params: { query: {} as any } }
  );

  return { tariffs, isLoading };
}

export function useTariffsMutations(
  createForm: UseFormReturn<TariffFormValues>,
  editForm: UseFormReturn<TariffFormValues>,
  setNewOpen: (val: boolean) => void,
  setEditOpen: (val: boolean) => void,
  setEditId: (val: string | null) => void
) {
  const queryClient = useQueryClient();

  const createMutation = backend.useMutation("post", "/api/treasury/tariffs", {
    onSuccess: () => {
      toast.success("Tarifa creada con éxito");
      createForm.reset();
      setNewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/tariffs"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("put", "/api/treasury/tariffs/{id}", {
    onSuccess: () => {
      toast.success("Tarifa actualizada con éxito");
      setEditId(null);
      editForm.reset();
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/tariffs"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/treasury/tariffs/{id}", {
    onSuccess: () => {
      toast.success("Tarifa eliminada con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/tariffs"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
