import { apiClient } from "@/services/api/client";
import type {
  ApiEnvelope,
  PaginatedEnvelope,
  User,
  UserRole,
  UserStatus,
} from "@/types/api";

export type CreateUserInput = {
  identifier: string;
  full_name: string;
  role: Exclude<UserRole, "superadmin">;
  temporary_password: string;
};
export async function listUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  per_page?: number;
}) {
  const { data } = await apiClient.get<PaginatedEnvelope<User>>("/users", {
    params,
  });
  return data;
}
export async function createUser(input: CreateUserInput) {
  const { data } = await apiClient.post<ApiEnvelope<User>>("/users", input);
  return data.data;
}
export async function updateUser(
  id: string,
  input: Partial<{ identifier: string; full_name: string; status: UserStatus }>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<User>>(
    `/users/${id}`,
    input,
  );
  return data.data;
}
export async function resetCredential(id: string, temporaryPassword: string) {
  await apiClient.post(`/users/${id}/reset-credential`, {
    temporary_password: temporaryPassword,
  });
}

export type UserSession = {id:string;created_at:string;last_used_at:string;expires_at:string};
export async function changeUserRole(input:{id:string;role:UserRole;reason:string;current_password:string}){const {id,...body}=input;await apiClient.patch(`/users/${id}/role`,body);}
export async function listUserSessions(id:string){const {data}=await apiClient.get<ApiEnvelope<UserSession[]>>(`/users/${id}/sessions`);return data.data;}
export async function revokeUserSessions(id:string){await apiClient.post(`/users/${id}/revoke-sessions`);}
