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

export const getBackendUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!envUrl) {
    // Default to NestJS backend port
    return "http://localhost:5000";
  }
  return envUrl;
};

export const BACKEND_URL = getBackendUrl();

export const backendUrl = (
  baseUrl: string,
  version?: string,
  endpoint?: string,
  prefix?: string,
) => {
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  if (prefix) {
    if (prefix.startsWith("/")) {
      prefix = prefix.slice(1);
    }
    if (prefix.endsWith("/")) {
      prefix = prefix.slice(0, -1);
    }
  }
  if (version && version.startsWith("/")) {
    version = version.slice(1);
  }
  if (endpoint && endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  let url = baseUrl;
  if (prefix) {
    url += `/${prefix}`;
  }
  if (version) {
    url += `/${version}`;
  }
  if (endpoint) {
    url += `/${endpoint}`;
  }
  return url;
};

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
  baseUrl: backendUrl(BACKEND_URL),
  fetch: enhancedFetch,
});

export const backend = createClient(fetchClient);
