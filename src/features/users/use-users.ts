"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/users.service";
export const userKeys = { all: ["users"] as const };
export function useUsers(params?: Parameters<typeof service.listUsers>[0]) {
  return useQuery({
    queryKey: [...userKeys.all, params],
    queryFn: () => service.listUsers(params),
  });
}
export function useCreateUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.createUser,
    onSuccess: () => client.invalidateQueries({ queryKey: userKeys.all }),
  });
}
export function useToggleUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "inactive";
    }) => service.updateUser(id, { status }),
    onSuccess: () => client.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useResetCredential() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      service.resetCredential(id, password),
  });
}
