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
export type ResultFilter = { exam_id?: string; course_id?: string; search?: string; page?: number; per_page?: number };
export async function listResults(filter: ResultFilter = {}) {
  const { data } = await apiClient.get<PaginatedEnvelope<ExamResult>>("/results", {
    params: filter,
  });
  return data;
}
export async function publishResults(examId: string) {
  const { data } = await apiClient.post<
    ApiEnvelope<{ published_count: number }>
  >(`/results/exams/${examId}/publish`);
  return data.data;
}
export async function exportExamResults(examId: string) {
  const { data } = await apiClient.get<Blob>("/results/export", {
    params: { exam_id: examId },
    responseType: "blob",
  });
  return data;
}
export async function listStudentResults(filter: { search?: string; page?: number; per_page?: number } = {}) {
  const { data } = await apiClient.get<PaginatedEnvelope<ExamResult>>("/student/results", {
    params: filter,
  });
  return data;
}
export async function getStudentResult(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<ExamResult>>(
    `/student/results/${id}`,
  );
  return data.data;
}
