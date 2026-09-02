"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/exams.service";
export const examKeys = {
  byCourse: (courseId: string) => ["exams", courseId] as const,
  detail: (id: string) => ["exam", id] as const,
};
export function useExams(courseId: string) {
  return useQuery({
    queryKey: examKeys.byCourse(courseId),
    queryFn: () => service.listExams(courseId),
    enabled: Boolean(courseId),
  });
}
export function useExam(id: string) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: () => service.getExam(id),
    enabled: Boolean(id),
  });
}
export function useCreateExam(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.createExam,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: examKeys.byCourse(courseId) }),
  });
}
export function useExamAction(
  courseId: string,
  action: (id: string) => Promise<unknown>,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: examKeys.byCourse(courseId) }),
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
