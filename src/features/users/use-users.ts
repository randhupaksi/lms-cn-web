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
  return useGovernedUserMutation(service.createUser);
}
export function useToggleUser() {
  return useGovernedUserMutation(
    ({ id, status }: { id: string; status: "active" | "inactive" }) =>
      service.updateUser(id, { status }),
  );
}

export function useResetCredential() {
  return useGovernedUserMutation(
    ({ id, password }: { id: string; password: string }) =>
      service.resetCredential(id, password),
  );
}

export function useUserSessions(id: string, enabled = true) {
  return useQuery({
    queryKey: [...userKeys.all, id, "sessions"],
    queryFn: () => service.listUserSessions(id),
    enabled: Boolean(id) && enabled,
  });
}
function useGovernedUserMutation<T>(
  mutationFn: (input: T) => Promise<unknown>,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: userKeys.all }),
        client.invalidateQueries({ queryKey: ["governance"] }),
      ]),
  });
}
export const useChangeUserRole = () =>
  useGovernedUserMutation(service.changeUserRole);
export const useRevokeUserSessions = () =>
  useGovernedUserMutation(service.revokeUserSessions);
export const useUpdateManagedUser = () =>
  useGovernedUserMutation(
    (input: { id: string; identifier: string; full_name: string }) =>
      service.updateUser(input.id, {
        identifier: input.identifier,
        full_name: input.full_name,
      }),
  );
