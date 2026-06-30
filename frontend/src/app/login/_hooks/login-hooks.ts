import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { backend } from "@/lib/api/types/backend";

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return backend.useMutation("post", "/api/auth/sign-in/email", {
    onSuccess: async () => {
      toast.success("¡Inicio de sesión exitoso!");
      
      // Clear cache to remove stale unauthenticated session state and force loading state on redirect
      queryClient.clear();

      router.refresh();
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login Error details:", error);
      const errorMessage =
          error && typeof error === "object" && "message" in error
              ? (error.message as string)
              : "Credenciales incorrectas o error en el servidor";
      toast.error(errorMessage);
    },
  });
}
