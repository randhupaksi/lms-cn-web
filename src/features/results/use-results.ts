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
export function usePublishResults(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => service.publishResults(id),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: resultKeys.exam(id) }),
  });
}
export function useStudentResults() {
  return useQuery({
    queryKey: resultKeys.student,
    queryFn: service.listStudentResults,
  });
}
