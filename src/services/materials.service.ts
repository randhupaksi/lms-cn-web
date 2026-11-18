import { apiClient } from "@/services/api/client";
import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";
import type { CourseMaterial, MaterialAttachment } from "@/types/lms";

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
export async function uploadMaterialAttachment(materialId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<ApiEnvelope<MaterialAttachment>>(
    `/materials/${materialId}/attachments`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}
export async function downloadMaterialAttachment(
  materialId: string,
  attachmentId: string,
  signal: AbortSignal,
) {
  const { data } = await apiClient.get<Blob>(
    `/materials/${materialId}/attachments/${attachmentId}`,
    { responseType: "blob", signal },
  );
  return data;
}
export async function deleteMaterialAttachment(
  materialId: string,
  attachmentId: string,
) {
  await apiClient.delete(`/materials/${materialId}/attachments/${attachmentId}`);
}
export async function publishMaterial(id: string) {
  await apiClient.post(`/materials/${id}/publish`);
}
export async function completeMaterial(id: string) {
  await apiClient.post(`/materials/${id}/complete`);
}
