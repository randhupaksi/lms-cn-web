"use client";
import { useQuery } from "@tanstack/react-query";
import { getExamMonitoring } from "@/services/monitoring.service";
export function useExamMonitoring(examId: string, filter: { search?: string; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ["exam-monitoring", examId, filter],
    queryFn: () => getExamMonitoring(examId, filter),
    enabled: Boolean(examId),
    refetchInterval: 10_000,
  });
}
