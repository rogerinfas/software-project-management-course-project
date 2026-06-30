import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function useFormalizationData() {
  const { data: prospectsData, isLoading: isLoadingProspects } = backend.useQuery(
    "get",
    "/api/admission/prospects",
    { query: { aptitude: "FIT" } }
  );

  const { data: sections, isLoading: isLoadingSections } = backend.useQuery(
    "get",
    "/api/enrollment/sections",
    {}
  );

  return { prospectsData, sections, isLoadingProspects, isLoadingSections };
}

export function useFormalizationMutations() {
  const queryClient = useQueryClient();

  const createStudentMutation = backend.useMutation("post", "/api/enrollment/formalization/student");
  const assignGuardianMutation = backend.useMutation("post", "/api/enrollment/formalization/guardian");
  const enrollStudentMutation = backend.useMutation("post", "/api/enrollment/formalization/section");

  const invalidateEnrollmentQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/prospects"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/sections"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/students"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/enrollment/documents"] });
  };

  return {
    createStudentMutation,
    assignGuardianMutation,
    enrollStudentMutation,
    invalidateEnrollmentQueries,
  };
}
