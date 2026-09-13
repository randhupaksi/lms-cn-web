"use client";

import { useAuth } from "@/providers/auth-provider";
import { ErrorState, LoadingState } from "@/components/data-state";
import { useDashboardSummary } from "@/features/analytics/use-analytics";
import { DashboardWorkspace } from "@/features/analytics/components/dashboard-workspace";
import { PageHeader } from "@/components/ui/page-header";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const summary = useDashboardSummary();
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Dashboard"
        description="Prioritaskan pekerjaan yang perlu diselesaikan, lalu pantau aktivitas sesuai peran dan scope akun Anda."
        icon={LayoutDashboard}
      />
      {summary.isLoading && <LoadingState label="Menyiapkan ringkasan…" />}
      {summary.isError && <ErrorState label="Ringkasan belum dapat dimuat." onRetry={() => void summary.refetch()} />}
      {summary.data && user ? <DashboardWorkspace role={user.role} metrics={summary.data.metrics} /> : null}
    </section>
  );
}
