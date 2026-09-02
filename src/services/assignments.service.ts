import { apiClient } from "@/services/api/client";
import type { ApiEnvelope } from "@/types/api";
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

export async function listAssignments(courseId: string) {
  const { data } = await apiClient.get<ApiEnvelope<Assignment[]>>(
    "/assignments",
    { params: { course_id: courseId } },
  );
  return data.data;
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
export async function listSubmissions(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<AssignmentSubmission[]>>(
    `/assignments/${id}/submissions`,
  );
  return data.data;
}
export async function gradeSubmission(id: string, input: GradeInput) {
  await apiClient.post(`/assignments/submissions/${id}/grade`, input);
}
