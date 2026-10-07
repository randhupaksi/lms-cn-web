"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/results.service";
export const resultKeys = {
  exam: (id: string) => ["results", "exam", id] as const,
  student: ["results", "student"] as const,
};
export function useExamResults(id: string) {
  return useQuery({
    queryKey: resultKeys.exam(id),
    queryFn: () => service.listExamResults(id),
    enabled: Boolean(id),
  });
}
export function useResults(filter: service.ResultFilter = {}) {
  return useQuery({
    queryKey: ["results", "staff", filter],
    queryFn: () => service.listResults(filter),
  });
}
export function usePublishResults(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => service.publishResults(id),
    onSuccess: () => client.invalidateQueries({ queryKey: ["results"] }),
  });
}
export function useStudentResults(filter: { search?: string; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: [...resultKeys.student, filter],
    queryFn: () => service.listStudentResults(filter),
  });
}
