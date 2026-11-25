import { apiClient, refreshAuthSession } from "@/services/api/client";
import type { ApiEnvelope, Session, User } from "@/types/api";

export type LoginInput = { identifier: string; password: string };

export async function login(input: LoginInput) {
  const response = await apiClient.post<ApiEnvelope<Session>>(
    "/auth/login",
    input,
  );
  return response.data.data;
}

export async function refreshSession() {
  return refreshAuthSession();
}

export async function getCurrentUser() {
  const response = await apiClient.get<ApiEnvelope<User>>("/auth/me");
  return response.data.data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function changePassword(input: {
  current_password: string;
  new_password: string;
}) {
  await apiClient.post("/auth/change-password", input);
}
