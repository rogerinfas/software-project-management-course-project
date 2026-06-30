import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";
import { UseFormReturn } from "react-hook-form";
import { BulkFormValues, PaymentFormValues, SingleFormValues } from "../_types/collections.types";

export function useCollectionsData() {
  const { data: charges, isLoading: loadingCharges } = backend.useQuery(
    "get",
    "/api/treasury/charges",
    { params: { query: {} as any } }
  );

  const { data: tariffs } = backend.useQuery(
    "get",
    "/api/treasury/tariffs",
    { params: { query: {} as any } }
  );

  const { data: studentsData } = backend.useQuery(
    "get",
    "/api/enrollment/students" as any,
    { params: { query: { page: 1, size: 200 } as any } }
  );
  
  const students = (studentsData as any)?.data || [];

  return { charges, loadingCharges, tariffs, students };
}

export function useCollectionsMutations(
  bulkForm: UseFormReturn<BulkFormValues>,
  singleForm: UseFormReturn<SingleFormValues>,
  paymentForm: UseFormReturn<PaymentFormValues>,
  setBulkOpen: (val: boolean) => void,
  setSingleOpen: (val: boolean) => void,
  setPayOpen: (val: boolean) => void,
  setPayCharge: (val: any) => void
) {
  const queryClient = useQueryClient();

  const generateBulkMutation = backend.useMutation("post", "/api/treasury/charges/bulk", {
    onSuccess: (res: any) => {
      toast.success(`Cargos masivos generados con éxito: ${res.count || 0} alumnos cobrados.`);
      setBulkOpen(false);
      bulkForm.reset();
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/charges"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const createSingleMutation = backend.useMutation("post", "/api/treasury/charges", {
    onSuccess: () => {
      toast.success("Cargo registrado de forma individual");
      setSingleOpen(false);
      singleForm.reset();
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/charges"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteChargeMutation = backend.useMutation("delete", "/api/treasury/charges/{id}", {
    onSuccess: () => {
      toast.success("Cargo eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/charges"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const registerPaymentMutation = backend.useMutation("post", "/api/treasury/payments", {
    onSuccess: () => {
      toast.success("Pago registrado correctamente");
      setPayOpen(false);
      setPayCharge(null);
      paymentForm.reset();
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/charges"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/treasury/payments"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { generateBulkMutation, createSingleMutation, deleteChargeMutation, registerPaymentMutation };
}
