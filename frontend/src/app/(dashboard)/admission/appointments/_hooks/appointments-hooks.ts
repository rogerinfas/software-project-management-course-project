import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function useAppointments() {
  const { data: appointments, isLoading: appointmentsLoading } = backend.useQuery("get", "/api/admission/appointments", {});
  const { data: prospectsResponse } = backend.useQuery("get", "/api/admission/prospects", {
    query: { page: 1, size: 100 }
  });

  return { appointments, appointmentsLoading, prospectsResponse };
}

export function useAppointmentsMutations() {
  const queryClient = useQueryClient();

  const scheduleMutation = backend.useMutation("post", "/api/admission/appointments", {
    onSuccess: () => {
      toast.success("Cita agendada con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/admission/prospects"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  return { scheduleMutation };
}
