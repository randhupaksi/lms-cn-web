"use client";

import { useAuth } from "@/providers/auth-provider";
import { ErrorState, LoadingState } from "@/components/data-state";
import { MetricGrid } from "@/components/metric-grid";
import { useDashboardSummary } from "@/features/analytics/use-analytics";
import { PageHeader } from "@/components/ui/page-header";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const summary = useDashboardSummary();
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title={<>Selamat datang, {user?.full_name}</>}
        description="Ringkasan aktivitas akademik yang tersedia sesuai peran dan scope akun Anda."
        icon={LayoutDashboard}
      />
      {summary.isLoading && <LoadingState label="Menyiapkan ringkasan…" />}
      {summary.isError && <ErrorState label="Ringkasan belum dapat dimuat." />}
      {summary.data && <MetricGrid metrics={summary.data.metrics} />}
    </section>
  );
}
