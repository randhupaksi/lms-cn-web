import type { DashboardMetric } from "@/types/lms";
import {
  Activity,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  GraduationCap,
  School,
  UsersRound,
} from "lucide-react";

const iconByMetric: Record<string, typeof Activity> = {
  active_users: UsersRound,
  active_courses: School,
  published_exams: GraduationCap,
  active_attempts: Activity,
  courses: School,
  questions: BookOpenCheck,
  exams: GraduationCap,
  unpublished_results: Clock3,
  available_exams: Clock3,
  published_results: CheckCircle2,
  completed_materials: CheckCircle2,
};

export function MetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {metrics.map((metric) => {
        const Icon = iconByMetric[metric.key] ?? Activity;
        return (
          <div className="metric-card" key={metric.key}>
            <div className="flex items-start justify-between gap-4">
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
