"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/materials.service";

const keys = { all: ["materials"] as const };
export function useMaterials(courseId?: string, filter: service.MaterialFilter = {}) {
  return useQuery({
    queryKey: [...keys.all, courseId ?? "all", filter],
    queryFn: () => service.listMaterials(courseId, filter),
  });
}
export function useSaveMaterial() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id?: string;
      input: service.MaterialInput;
    }) =>
      id ? service.updateMaterial(id, input) : service.createMaterial(input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.all }),
  });
}
export function usePublishMaterial() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.publishMaterial,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.all }),
  });
}
export function useCompleteMaterial() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.completeMaterial,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.all }),
  });
}
