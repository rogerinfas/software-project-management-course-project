import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function useEnrollmentDocuments(page: number, size: number, search: string) {
  const { data: enrollmentsData, isLoading } = backend.useQuery(
    "get",
    "/api/enrollment/documents",
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

  return { enrollmentsData, isLoading };
}

export function useEnrollmentDocumentsMutations() {
  const queryClient = useQueryClient();

  const handleReemit = (e: any) => {
    toast.success(`Ficha de matrícula del alumno ${e.student?.firstName} ${e.student?.lastName} re-emitida con éxito.`);
    queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/documents"] });
  };

  return { handleReemit };
}
