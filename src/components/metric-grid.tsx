import type { DashboardMetric } from "@/types/lms";
import { Activity, BookOpenCheck, CheckCircle2, Clock3 } from "lucide-react";

const icons = [Activity, BookOpenCheck, Clock3, CheckCircle2];

export function MetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = icons[index % icons.length];
        return (
          <div className="metric-card" key={metric.key}>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  {metric.label}
                </dt>
                <dd className="mt-3 text-3xl font-bold tracking-[-0.05em] text-foreground">
                  {metric.value.toLocaleString("id-ID")}
                </dd>
              </div>
              <span className="metric-icon"><Icon aria-hidden="true" size={18} /></span>
            </div>
          </div>
        );
      })}
    </dl>
  );
}
