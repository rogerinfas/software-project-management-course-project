import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function usePublicData() {
  const { data: communications, isLoading } = backend.useQuery(
    "get",
    "/api/academic/communications",
    {
      params: {
        query: {
          category: "",
          search: "",
        },
      },
    }
  );

  return { communications, isLoading };
}

export function usePublicMutations(
  setNewOpen: (val: boolean) => void,
  setNombre: (val: string) => void,
  setCelular: (val: string) => void,
  setNivel: (val: any) => void,
  setGrado: (val: string) => void
) {
  const createProspectMutation = backend.useMutation("post", "/api/admission/prospects", {
    onSuccess: () => {
      toast.success("¡Registro exitoso! Nos pondremos en contacto pronto.");
      setNewOpen(false);
      setNombre("");
      setCelular("");
      setNivel("PRIMARY");
      setGrado("1° primaria");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ocurrió un error en el registro");
    },
  });

  return { createProspectMutation };
}
