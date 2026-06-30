import { backend } from "@/lib/api/types/backend";

export function useReceiptsData() {
  const { data: payments, isLoading } = backend.useQuery(
    "get",
    "/api/treasury/payments",
    { params: { query: {} as any } }
  );

  return { payments, isLoading };
}
