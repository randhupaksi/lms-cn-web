"use client";
import { useQuery } from "@tanstack/react-query";
import * as service from "@/services/analytics.service";
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: service.getDashboardSummary,
  });
}
export function useExamAnalytics(examId: string) {
  return useQuery({
    queryKey: ["exam-analytics", examId],
    queryFn: () => service.getExamAnalytics(examId),
    enabled: Boolean(examId),
  });
}
