import { apiClient } from "@/services/api/client";
import type { ApiEnvelope } from "@/types/api";
import type { DashboardSummary, ExamAnalytics } from "@/types/lms";

export async function getDashboardSummary() {
  const { data } = await apiClient.get<ApiEnvelope<DashboardSummary>>(
    "/analytics/dashboard",
  );
  return data.data;
}
export async function getExamAnalytics(examId: string) {
  const { data } = await apiClient.get<ApiEnvelope<ExamAnalytics>>(
    `/analytics/exams/${examId}`,
  );
  return data.data;
}
