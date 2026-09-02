import { apiClient } from "@/services/api/client";
import type { ApiEnvelope } from "@/types/api";
import type { ExamMonitoring } from "@/types/lms";

export async function getExamMonitoring(examId: string) {
  const { data } = await apiClient.get<ApiEnvelope<ExamMonitoring>>(
    `/monitoring/exams/${examId}`,
  );
  return data.data;
}
