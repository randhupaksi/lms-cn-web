import axios from "axios";
import { publicEnv } from "@/config/public-env";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth-session";

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

let refreshRequest: Promise<string | null> | null = null;

apiClient.interceptors.response.use(undefined, async (error) => {
  const request = error.config;
  if (
    error.response?.status !== 401 ||
    request?.url?.endsWith("/auth/refresh") ||
    request?._retry
  ) {
    return Promise.reject(error);
  }
  request._retry = true;
  refreshRequest ??= apiClient
    .post("/auth/refresh")
    .then(({ data }) => {
      const token = data.data.access_token as string;
      setAccessToken(token);
      return token;
    })
    .catch(() => {
      clearAccessToken();
      return null;
    })
    .finally(() => {
      refreshRequest = null;
    });
  const token = await refreshRequest;
  if (!token) return Promise.reject(error);
  request.headers.Authorization = `Bearer ${token}`;
  return apiClient(request);
});
