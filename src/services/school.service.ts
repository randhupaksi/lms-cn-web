import { apiClient } from "@/services/api/client";
import type { ApiEnvelope } from "@/types/api";
export type SchoolProfile = {
  school_name: string;
  motto: string;
  contact_email: string;
  support_message: string;
};
export async function getSchoolProfile() {
  const { data } =
    await apiClient.get<ApiEnvelope<SchoolProfile>>("/school-profile");
  return data.data;
}
