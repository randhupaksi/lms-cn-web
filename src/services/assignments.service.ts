import { apiClient } from "@/services/api/client";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";
import type { Assignment, AssignmentSubmission } from "@/types/lms";

export type AssignmentInput = {
  course_id: string;
  title: string;
  instructions: string;
  due_at: string;
  max_score: number;
};
export type SubmissionInput = { content: string; attachment_url: string };
export type GradeInput = { score: number; feedback: string };
export type AssignmentFilter = { search?: string; status?: string; page?: number; per_page?: number };

export async function listAssignments(courseId?: string, filter: AssignmentFilter = {}) {
  const { data } = await apiClient.get<PaginatedEnvelope<Assignment>>(
    "/assignments",
    { params: { course_id: courseId || undefined, ...filter } },
  );
  return data;
}
export async function createAssignment(input: AssignmentInput) {
  const { data } = await apiClient.post<ApiEnvelope<Assignment>>(
    "/assignments",
    input,
  );
  return data.data;
}
export async function updateAssignment(id: string, input: AssignmentInput) {
  const { data } = await apiClient.put<ApiEnvelope<Assignment>>(
    `/assignments/${id}`,
    input,
  );
  return data.data;
}
export async function publishAssignment(id: string) {
  await apiClient.post(`/assignments/${id}/publish`);
}
export async function submitAssignment(id: string, input: SubmissionInput) {
  await apiClient.post(`/assignments/${id}/submit`, input);
}
export async function listSubmissions(id: string, filter: { search?: string; page?: number; per_page?: number } = {}) {
  const { data } = await apiClient.get<PaginatedEnvelope<AssignmentSubmission>>(
    `/assignments/${id}/submissions`,
    { params: filter },
  );
  return data;
}
export async function gradeSubmission(id: string, input: GradeInput) {
  await apiClient.post(`/assignments/submissions/${id}/grade`, input);
}
