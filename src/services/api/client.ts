import axios from "axios";
import { publicEnv } from "@/config/public-env";
import {
  getAccessToken,
  invalidateSession,
  setAccessToken,
} from "@/lib/auth-session";
import type { ApiEnvelope, Session } from "@/types/api";

export const apiClient = axios.create({
  baseURL: publicEnv.apiBaseUrl,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshRequest: Promise<Session> | null = null;

export function refreshAuthSession() {
  refreshRequest ??= apiClient
    .post<ApiEnvelope<Session>>("/auth/refresh")
    .then(({ data }) => {
      setAccessToken(data.data.access_token);
      return data.data;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

apiClient.interceptors.response.use(undefined, async (error) => {
  const request = error.config;
  if (
    !request ||
    error.response?.status !== 401 ||
    request.url?.endsWith("/auth/refresh") ||
    request.url?.endsWith("/auth/login") ||
    request._retry
  ) {
    return Promise.reject(error);
  }
  request._retry = true;
  const session = await refreshAuthSession().catch((refreshError: unknown) => {
    // Only a definitive rejection means the refresh cookie is no longer valid.
    // A timeout or 5xx response should leave the signed-in UI intact so users
    // can retry their work when the service is reachable again.
    if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
      invalidateSession();
    }
    return null;
  });
  const token = session?.access_token;
  if (!token) return Promise.reject(error);
  request.headers.Authorization = `Bearer ${token}`;
  return apiClient(request);
});
