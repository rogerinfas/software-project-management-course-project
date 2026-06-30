import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function useFamilyRecordsStudents() {
  const { data: studentsData, isLoading: isLoadingStudents } = backend.useQuery(
    "get",
    "/api/enrollment/students",
    { params: { query: { page: 1, size: 100 } } }
  );

  const students = studentsData?.data ?? [];
  return { students, isLoadingStudents };
}

export function useFamilyRecordsMutations(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const updateMutation = backend.useMutation("put", "/api/enrollment/guardians/{id}", {
    onSuccess: () => {
      toast.success("Apoderado actualizado en el expediente");
      if (onSuccess) onSuccess();
      queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/students"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { updateMutation };
}
