"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/assignments.service";

const keys = {
  all: ["assignments"] as const,
  submissions: (id: string) => ["assignment-submissions", id] as const,
};
export function useAssignments(courseId?: string, filter: service.AssignmentFilter = {}) {
  return useQuery({
    queryKey: [...keys.all, courseId ?? "all", filter],
    queryFn: () => service.listAssignments(courseId, filter),
  });
}
export function useSaveAssignment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id?: string;
      input: service.AssignmentInput;
    }) =>
      id
        ? service.updateAssignment(id, input)
        : service.createAssignment(input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.all }),
  });
}
export function usePublishAssignment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: service.publishAssignment,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.all }),
  });
}
export function useSubmitAssignment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: service.SubmissionInput;
    }) => service.submitAssignment(id, input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.all }),
  });
}
export function useSubmissions(assignmentId: string, filter: { search?: string; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: [...keys.submissions(assignmentId), filter],
    queryFn: () => service.listSubmissions(assignmentId, filter),
    enabled: Boolean(assignmentId),
  });
}
export function useGradeSubmission(assignmentId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: service.GradeInput }) =>
      service.gradeSubmission(id, input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: keys.submissions(assignmentId) }),
  });
}
