import { apiClient } from "@/services/api/client";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";
import type { Exam } from "@/types/lms";

export type ExamInput = {
  course_id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  allow_back_navigation: boolean;
  randomize_questions: boolean;
  randomize_options: boolean;
};
export async function listExams(courseId: string) {
  const { data } = await apiClient.get<PaginatedEnvelope<Exam>>("/exams", {
    params: { course_id: courseId },
  });
  return data;
}
export async function getExam(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<Exam>>(`/exams/${id}`);
  return data.data;
}
export async function createExam(input: ExamInput) {
  const { data } = await apiClient.post<ApiEnvelope<Exam>>("/exams", input);
  return data.data;
}
export async function updateExam(id: string, input: ExamInput) {
  const { data } = await apiClient.put<ApiEnvelope<Exam>>(
    `/exams/${id}`,
    input,
  );
  return data.data;
}
export async function setExamQuestions(
  id: string,
  questions: { question_id: string; points: number }[],
) {
  await apiClient.put(`/exams/${id}/questions`, { questions });
}
export async function setExamParticipants(id: string, studentIds: string[]) {
  await apiClient.put(`/exams/${id}/participants`, { student_ids: studentIds });
}
export async function publishExam(id: string) {
  await apiClient.post(`/exams/${id}/publish`);
}
export async function unpublishExam(id: string) {
  await apiClient.post(`/exams/${id}/unpublish`);
}
