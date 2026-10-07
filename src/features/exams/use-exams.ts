"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/exams.service";
export const examKeys = {
  byCourse: (courseId: string) => ["exams", courseId] as const,
  detail: (id: string) => ["exam", id] as const,
};
export function useExams(courseId?: string, filter: service.ExamFilter = {}) {
  return useQuery({
    queryKey: [...examKeys.byCourse(courseId ?? "all"), filter],
    queryFn: () => service.listExams(courseId, filter),
  });
}
export function useExam(id: string) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: () => service.getExam(id),
    enabled: Boolean(id),
  });
}
export function useCreateExam() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.createExam,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["exams"] }),
  });
}
export function useExamAction(
  action: (id: string) => Promise<unknown>,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["exams"] }),
  });
}
export function useConfigureExam(examId: string) {
  const client = useQueryClient();
  const refresh = () =>
    client.invalidateQueries({ queryKey: examKeys.detail(examId) });
  return {
    questions: useMutation({
      mutationFn: (items: { question_id: string; points: number }[]) =>
        service.setExamQuestions(examId, items),
      onSuccess: refresh,
    }),
    participants: useMutation({
      mutationFn: (ids: string[]) => service.setExamParticipants(examId, ids),
      onSuccess: refresh,
    }),
  };
}
