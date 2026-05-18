"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { FetchError } from "../lib/api/types/backend";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (
                error &&
                typeof error === "object" &&
                "statusCode" in error
              ) {
                const fetchError = error as unknown as FetchError;
                if (
                  fetchError.statusCode >= 400 &&
                  fetchError.statusCode < 500
                ) {
                  return false;
                }
              }
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
          },
          mutations: {
            retry: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (error) {
              const fetchError = error as unknown as FetchError;
              if (fetchError.statusCode === 401) {
                toast.error("Sesión expirada o no iniciada");
                router.push("/login");
              }
            }
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
