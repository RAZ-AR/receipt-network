import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";
import type { AppRouter } from "@beleg/api/src/router";

/**
 * In development the app runs on a phone while the API runs on this machine,
 * so "localhost" would point at the phone itself. Expo exposes the dev
 * server's host, which is the same machine — reuse its address for the API.
 */
function apiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(":")[0];
  return host ? `http://${host}:4000` : "http://localhost:4000";
}

export const api = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: apiUrl() })],
});

export const API_URL = apiUrl();
