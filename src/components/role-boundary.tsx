"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";
import { PermissionDeniedState } from "@/components/data-state";
import type { UserRole } from "@/types/api";

export function RoleBoundary({
  allow,
  children,
}: Readonly<{ allow: UserRole[]; children: ReactNode }>) {
  const { user } = useAuth();
  if (!user || !allow.includes(user.role))
    return <PermissionDeniedState />;
  return children;
}
