"use client";
import { useQuery } from "@tanstack/react-query";
import { getExamMonitoring } from "@/services/monitoring.service";
export function useExamMonitoring(examId: string) {
  return useQuery({
    queryKey: ["exam-monitoring", examId],
    queryFn: () => getExamMonitoring(examId),
    enabled: Boolean(examId),
    refetchInterval: 10_000,
  });
}
