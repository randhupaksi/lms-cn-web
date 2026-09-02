"use client";

import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <section>
      <p className="eyebrow">DASHBOARD</p>
      <h1 className="page-title">Selamat datang, {user?.full_name}</h1>
      <p className="page-description">
        Pilih menu di navigasi untuk mengelola aktivitas pembelajaran dan ujian.
      </p>
    </section>
  );
}
