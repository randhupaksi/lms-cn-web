import axios from "axios";
import type { ApiErrorPayload } from "@/types/api";

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError<ApiErrorPayload>(error)) return fallback;
  const message = error.response?.data?.message?.trim();
  return message || fallback;
}
