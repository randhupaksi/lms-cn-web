import { apiClient } from "@/services/api/client";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";
import type { User } from "@/types/api";
import type { AcademicYear, ClassGroup, Course, Subject } from "@/types/lms";

export async function listAcademicYears() {
  const { data } =
    await apiClient.get<ApiEnvelope<AcademicYear[]>>("/academic-years");
  return data.data;
}
export async function createAcademicYear(input: {
  name: string;
  starts_on: string;
  ends_on: string;
  status: string;
}) {
  const { data } = await apiClient.post<ApiEnvelope<AcademicYear>>(
    "/academic-years",
    input,
  );
  return data.data;
}
export async function listClassGroups(academicYearId?: string) {
  const { data } = await apiClient.get<ApiEnvelope<ClassGroup[]>>(
    "/class-groups",
    { params: { academic_year_id: academicYearId } },
  );
  return data.data;
}
export async function createClassGroup(input: {
  academic_year_id: string;
  name: string;
  grade_level: number;
}) {
  const { data } = await apiClient.post<ApiEnvelope<ClassGroup>>(
    "/class-groups",
    input,
  );
  return data.data;
}
export async function listSubjects() {
  const { data } = await apiClient.get<ApiEnvelope<Subject[]>>("/subjects");
  return data.data;
}
export async function createSubject(input: { code: string; name: string }) {
  const { data } = await apiClient.post<ApiEnvelope<Subject>>(
    "/subjects",
    input,
  );
  return data.data;
}
export async function listCourses() {
  const { data } = await apiClient.get<PaginatedEnvelope<Course>>("/courses");
  return data;
}
export async function createCourse(input: {
  academic_year_id: string;
  class_group_id: string;
  subject_id: string;
  name: string;
}) {
  const { data } = await apiClient.post<ApiEnvelope<Course>>("/courses", input);
  return data.data;
}
export async function assignTeachers(courseId: string, userIds: string[]) {
  await apiClient.put(`/courses/${courseId}/teachers`, { user_ids: userIds });
}
export async function assignStudents(courseId: string, userIds: string[]) {
  await apiClient.put(`/courses/${courseId}/students`, { user_ids: userIds });
}

export async function getCourseMembers(courseId: string) {
  const { data } = await apiClient.get<
    ApiEnvelope<{ teachers: User[]; students: User[] }>
  >(`/courses/${courseId}/members`);
  return data.data;
}
