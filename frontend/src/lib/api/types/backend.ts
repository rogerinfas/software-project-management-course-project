import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import { paths } from "./api";

export type FetchErrorResponse = {
  statusCode: number;
  message: string;
  error: unknown;
  id?: string;
  category?: string;
  severity?: string;
  timestamp?: string;
  path?: string;
  method?: string;
};

export type FetchError = typeof Error & FetchErrorResponse;

/**
 * In the browser we use a relative base URL so that all /api/* requests
 * pass through the Next.js reverse proxy (configured in next.config.ts).
 * This makes the session cookie same-site — fixing the production
 * cross-domain cookie issue.
 *
 * On the server (SSR / middleware) we still target the backend directly.
 */
export const getBackendUrl = (): string => {
  // Client-side: use relative URL so the Next.js proxy forwards the request
  if (typeof window !== "undefined") {
    return "";
  }
  // Server-side: use the direct backend URL
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";
};

export const BACKEND_URL = getBackendUrl();

export const enhancedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
) => {
  return fetch(input, {
    ...init,
    credentials: "include", // Essential for Better Auth session cookies
  });
};

const fetchClient = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
  fetch: enhancedFetch,
});

export const backend = createClient(fetchClient);
