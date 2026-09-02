"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "@/services/academics.service";
export const academicKeys = {
  years: ["academic-years"] as const,
  classes: ["class-groups"] as const,
  subjects: ["subjects"] as const,
  courses: ["courses"] as const,
  members: (courseId: string) => ["courses", courseId, "members"] as const,
};
export function useAcademicData() {
  return {
    years: useQuery({
      queryKey: academicKeys.years,
      queryFn: service.listAcademicYears,
    }),
    classes: useQuery({
      queryKey: academicKeys.classes,
      queryFn: () => service.listClassGroups(),
    }),
    subjects: useQuery({
      queryKey: academicKeys.subjects,
      queryFn: service.listSubjects,
    }),
    courses: useQuery({
      queryKey: academicKeys.courses,
      queryFn: service.listCourses,
    }),
  };
}
export function useCourses() {
  return useQuery({
    queryKey: academicKeys.courses,
    queryFn: service.listCourses,
  });
}
function useInvalidatingMutation<T>(
  mutationFn: (input: T) => Promise<unknown>,
  key: readonly string[],
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
}
export function useCreateAcademicYear() {
  return useInvalidatingMutation(
    service.createAcademicYear,
    academicKeys.years,
  );
}
export function useCreateClassGroup() {
  return useInvalidatingMutation(
    service.createClassGroup,
    academicKeys.classes,
  );
}
export function useCreateSubject() {
  return useInvalidatingMutation(service.createSubject, academicKeys.subjects);
}
export function useCreateCourse() {
  return useInvalidatingMutation(service.createCourse, academicKeys.courses);
}

export function useCourseMembers(courseId: string) {
  return useQuery({
    queryKey: academicKeys.members(courseId),
    queryFn: () => service.getCourseMembers(courseId),
    enabled: Boolean(courseId),
  });
}

export function useAssignCourseMembers(courseId: string) {
  const client = useQueryClient();
  const refresh = () =>
    client.invalidateQueries({ queryKey: academicKeys.members(courseId) });
  return {
    teachers: useMutation({
      mutationFn: (ids: string[]) => service.assignTeachers(courseId, ids),
      onSuccess: refresh,
    }),
    students: useMutation({
      mutationFn: (ids: string[]) => service.assignStudents(courseId, ids),
      onSuccess: refresh,
    }),
  };
}
