"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/materials.service";

const keys = { course: (id: string) => ["materials", id] as const };
export function useMaterials(courseId: string) {
  return useQuery({
    queryKey: keys.course(courseId),
    queryFn: () => service.listMaterials(courseId),
    enabled: Boolean(courseId),
  });
}
export function useSaveMaterial(courseId: string) {
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
      client.invalidateQueries({ queryKey: keys.course(courseId) }),
  });
}
export function usePublishMaterial(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.publishMaterial,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.course(courseId) }),
  });
}
export function useCompleteMaterial(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.completeMaterial,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.course(courseId) }),
  });
}
