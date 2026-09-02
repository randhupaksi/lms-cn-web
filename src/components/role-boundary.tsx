"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";
import type { UserRole } from "@/types/api";

export function RoleBoundary({
  allow,
  children,
}: Readonly<{ allow: UserRole[]; children: ReactNode }>) {
  const { user } = useAuth();
  if (!user || !allow.includes(user.role))
    return (
      <section className="panel">
        <h1 className="text-xl font-semibold">Akses tidak tersedia</h1>
        <p className="mt-2 text-sm text-muted">
          Akun Anda tidak memiliki akses ke halaman ini.
        </p>
      </section>
    );
  return children;
}
