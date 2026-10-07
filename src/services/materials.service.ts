import { apiClient } from "@/services/api/client";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";
import type { CourseMaterial } from "@/types/lms";

export type MaterialInput = {
  course_id: string;
  title: string;
  description: string;
  content: string;
  position: number;
};

export type MaterialFilter = { search?: string; status?: string; page?: number; per_page?: number };

export async function listMaterials(courseId?: string, filter: MaterialFilter = {}) {
  const { data } = await apiClient.get<PaginatedEnvelope<CourseMaterial>>(
    "/materials",
    { params: { course_id: courseId || undefined, ...filter } },
  );
  return data;
}
export async function createMaterial(input: MaterialInput) {
  const { data } = await apiClient.post<ApiEnvelope<CourseMaterial>>(
    "/materials",
    input,
  );
  return data.data;
}
export async function updateMaterial(id: string, input: MaterialInput) {
  const { data } = await apiClient.put<ApiEnvelope<CourseMaterial>>(
    `/materials/${id}`,
    input,
  );
  return data.data;
}
export async function publishMaterial(id: string) {
  await apiClient.post(`/materials/${id}/publish`);
}
export async function completeMaterial(id: string) {
  await apiClient.post(`/materials/${id}/complete`);
}
