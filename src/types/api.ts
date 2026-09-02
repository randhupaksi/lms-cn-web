export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  code?: string;
  errors?: Record<string, string[]>;
  meta?: unknown;
};
export type ApiErrorPayload = {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
};

export type UserRole = "admin" | "teacher" | "student";
export type UserStatus = "active" | "inactive";
export type User = {
  id: string;
  identifier: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
};
export type Session = { access_token: string; expires_in: number; user: User };

export type PageMeta = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};
export type PaginatedEnvelope<T> = ApiEnvelope<T[]> & { meta: PageMeta };
