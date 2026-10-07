import { apiClient } from "@/services/api/client";
import type { ApiEnvelope } from "@/types/api";
import type { PageMeta } from "@/types/api";
import type { ExamMonitoring } from "@/types/lms";

export async function getExamMonitoring(examId: string, filter: { search?: string; page?: number; per_page?: number } = {}) {
  const { data } = await apiClient.get<ApiEnvelope<ExamMonitoring>>(
    `/monitoring/exams/${examId}`,
    { params: filter },
  );
  return { data: data.data, meta: data.meta as PageMeta };
}
