import { apiClient } from "@/services/api/client";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";
import type { ExamResult } from "@/types/lms";
export async function listExamResults(examId: string) {
  const { data } = await apiClient.get<PaginatedEnvelope<ExamResult>>(
    "/results",
    { params: { exam_id: examId } },
  );
  return data;
}
export async function publishResults(examId: string) {
  const { data } = await apiClient.post<
    ApiEnvelope<{ published_count: number }>
  >(`/results/exams/${examId}/publish`);
  return data.data;
}
export async function listStudentResults() {
  const { data } =
    await apiClient.get<PaginatedEnvelope<ExamResult>>("/student/results");
  return data;
}
export async function getStudentResult(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<ExamResult>>(
    `/student/results/${id}`,
  );
  return data.data;
}
