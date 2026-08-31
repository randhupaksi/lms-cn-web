export type ApiEnvelope<T> = { success: boolean; message: string; data: T };
export type ApiErrorPayload = { success: false; message: string; code?: string; errors?: Record<string, string[]> };
