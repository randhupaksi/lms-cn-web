import type { UserRole } from "@/types/api";
import { SkeletonBlock, SkeletonRegion } from "@/components/ui/skeleton";

type StandardRole = Exclude<UserRole, "superadmin" | "principal">;

function DashboardMetricSkeleton() {
  return (
    <div className="metric-card">
      <div className="metric-card-label-with-icon">
        <SkeletonBlock className="dashboard-skeleton-icon" />
        <SkeletonBlock className="skeleton-text dashboard-skeleton-label" />
      </div>
      <SkeletonBlock className="dashboard-skeleton-value" />
    </div>
  );
}

function DashboardMetricsSkeleton() {
  return (
    <section className="dashboard-kpis">
      <div className="dashboard-overview-heading">
        <SkeletonBlock className="dashboard-skeleton-heading" />
        <SkeletonBlock className="skeleton-text dashboard-skeleton-copy" />
      </div>
      <div className="dashboard-kpi-surface">
        <div className="metric-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <DashboardMetricSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <header
      className="dashboard-welcome dashboard-welcome-skeleton"
      aria-hidden="true"
    >
      <div className="dashboard-welcome-copy">
        <SkeletonBlock className="dashboard-skeleton-header-eyebrow" />
        <SkeletonBlock className="dashboard-skeleton-header-title" />
        <SkeletonBlock className="dashboard-skeleton-header-description" />
        <SkeletonBlock className="dashboard-skeleton-header-description-short" />
      </div>
      <div className="dashboard-welcome-actions">
        <SkeletonBlock className="dashboard-skeleton-header-action" />
        <SkeletonBlock className="dashboard-skeleton-header-refresh" />
      </div>
    </header>
  );
}

function SkeletonChartHeading() {
  return (
    <div className="chart-heading">
      <SkeletonBlock className="skeleton-text dashboard-skeleton-eyebrow" />
      <SkeletonBlock className="dashboard-skeleton-heading mt-3" />
      <SkeletonBlock className="skeleton-text dashboard-skeleton-copy mt-3" />
    </div>
  );
}

function ActivityChartSkeleton() {
  return (
    <section className="insight-surface activity-surface">
      <SkeletonChartHeading />
      <div className="chart-summary">
        {[0, 1].map((item) => (
          <div key={item}>
            <SkeletonBlock className="skeleton chart-dot" />
            <SkeletonBlock className="skeleton-text dashboard-skeleton-chart-label" />
            <SkeletonBlock className="skeleton-text dashboard-skeleton-chart-total" />
          </div>
        ))}
      </div>
      <div className="activity-chart skeleton-activity-chart">
        <div className="chart-axis">
          {[0, 1, 2].map((item) => (
            <SkeletonBlock
              key={item}
              className="skeleton-text dashboard-skeleton-axis-label"
            />
          ))}
        </div>
        <div className="chart-columns skeleton-chart-columns">
          {Array.from({ length: 14 }, (_, index) => (
            <span className="skeleton-chart-day" key={index}>
              <span className="skeleton-chart-bars">
                <SkeletonBlock className="skeleton-chart-bar skeleton-chart-bar-primary" />
                <SkeletonBlock className="skeleton-chart-bar skeleton-chart-bar-info" />
              </span>
              {index % 3 === 0 || index === 13 ? (
                <SkeletonBlock className="skeleton-text dashboard-skeleton-day-label" />
              ) : null}
            </span>
          ))}
        </div>
      </div>
      <SkeletonBlock className="skeleton-text dashboard-skeleton-footnote" />
      <div className="chart-data">
        <SkeletonBlock className="skeleton-text dashboard-skeleton-data-link" />
      </div>
    </section>
  );
}

function DistributionSkeleton() {
  return (
    <section className="insight-surface distribution-surface">
      <SkeletonChartHeading />
      <SkeletonBlock className="skeleton insight-skeleton-ring" />
      <div className="distribution-legend">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <dt>
              <SkeletonBlock className="skeleton chart-dot" />
              <SkeletonBlock className="skeleton-text dashboard-skeleton-legend-label" />
            </dt>
            <dd>
              <SkeletonBlock className="skeleton-text dashboard-skeleton-legend-value" />
              <SkeletonBlock className="skeleton-text dashboard-skeleton-legend-percent" />
            </dd>
          </div>
        ))}
      </div>
    </section>
  );
}

function StudentProgressSkeleton() {
  return (
    <section className="insight-surface learning-progress-surface">
      <SkeletonChartHeading />
      <SkeletonBlock className="skeleton insight-skeleton-ring" />
      <SkeletonBlock className="skeleton-text dashboard-skeleton-progress-copy" />
      <SkeletonBlock className="skeleton dashboard-skeleton-progress-link" />
      <div className="student-task-snapshot">
        <SkeletonBlock className="skeleton-text dashboard-skeleton-task-title" />
        <div className="distribution-legend">
          {[0, 1, 2].map((item) => (
            <div key={item}>
              <dt>
                <SkeletonBlock className="skeleton chart-dot" />
                <SkeletonBlock className="skeleton-text dashboard-skeleton-legend-label" />
              </dt>
              <dd>
                <SkeletonBlock className="skeleton-text dashboard-skeleton-legend-value" />
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentResultsSkeleton() {
  return (
    <section className="insight-surface result-chart-surface">
      <SkeletonChartHeading />
      <ol className="result-bars">
        {[0, 1, 2].map((item) => (
          <li key={item}>
            <div className="result-bar-heading">
              <span className="dashboard-skeleton-result-title">
                <SkeletonBlock className="skeleton-text" />
                <SkeletonBlock className="skeleton-text dashboard-skeleton-result-course" />
              </span>
              <SkeletonBlock className="skeleton-text dashboard-skeleton-result-value" />
            </div>
            <SkeletonBlock className="skeleton result-bar-track" />
          </li>
        ))}
      </ol>
      <div className="insight-footer-link">
        <SkeletonBlock className="skeleton-text dashboard-skeleton-data-link" />
      </div>
    </section>
  );
}

function DashboardInsightsSkeletonContent({ role }: { role: StandardRole }) {
  return (
    <div className="dashboard-insights">
      <dl className="insight-metrics">
        {[0, 1, 2].map((item) => (
          <div key={item}>
            <SkeletonBlock className="skeleton dashboard-skeleton-insight-icon" />
            <span className="dashboard-skeleton-insight-copy">
              <SkeletonBlock className="skeleton-text dashboard-skeleton-insight-label" />
              <SkeletonBlock className="skeleton dashboard-skeleton-insight-value" />
            </span>
          </div>
        ))}
      </dl>
      <div
        className={`insights-grid ${role === "student" ? "insights-grid-student" : ""}`}
      >
        {role === "student" ? <StudentProgressSkeleton /> : null}
        <ActivityChartSkeleton />
        {role === "student" ? (
          <RecentResultsSkeleton />
        ) : (
          <DistributionSkeleton />
        )}
      </div>
      <SkeletonBlock className="skeleton-text dashboard-skeleton-freshness" />
    </div>
  );
}

export function DashboardInsightsSkeleton({ role }: { role: StandardRole }) {
  return (
    <SkeletonRegion label="Menyiapkan grafik dan analisis dashboard">
      <DashboardInsightsSkeletonContent role={role} />
    </SkeletonRegion>
  );
}

function PriorityQueueSkeleton() {
  return (
    <section className="workspace-section">
      <div className="workspace-section-header">
        <div className="dashboard-skeleton-section-copy">
          <SkeletonBlock className="dashboard-skeleton-heading" />
          <SkeletonBlock className="skeleton-text dashboard-skeleton-copy" />
        </div>
        <SkeletonBlock className="skeleton-text dashboard-skeleton-count" />
      </div>
      <div className="workspace-section-body task-list">
        {[0, 1, 2].map((item) => (
          <div className="task-list-item" key={item}>
            <SkeletonBlock className="skeleton dashboard-skeleton-task-icon" />
            <span className="dashboard-skeleton-task-copy">
              <SkeletonBlock className="skeleton-text dashboard-skeleton-task-category" />
              <SkeletonBlock className="skeleton-text dashboard-skeleton-task-line" />
              <SkeletonBlock className="skeleton dashboard-skeleton-task-status" />
            </span>
            <SkeletonBlock className="skeleton dashboard-skeleton-task-arrow" />
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickActionsSkeleton({ role }: { role: StandardRole }) {
  return (
    <div className="quick-action-grid">
      {Array.from({ length: role === "student" ? 4 : 3 }, (_, index) => (
        <div className="quick-action-card" key={index}>
          <SkeletonBlock className="skeleton dashboard-skeleton-action-index" />
          <span className="dashboard-skeleton-action-copy">
            <SkeletonBlock className="skeleton-text dashboard-skeleton-action-title" />
            <SkeletonBlock className="skeleton-text dashboard-skeleton-action-description" />
          </span>
          <SkeletonBlock className="skeleton dashboard-skeleton-task-arrow" />
        </div>
      ))}
    </div>
  );
}

function QuickActionPanelSkeleton({ role }: { role: StandardRole }) {
  return (
    <section className="dashboard-quick-panel">
      <div className="dashboard-skeleton-section-copy">
        <SkeletonBlock className="dashboard-skeleton-heading" />
        <SkeletonBlock className="skeleton-text dashboard-skeleton-copy" />
      </div>
      <QuickActionsSkeleton role={role} />
    </section>
  );
}

function DashboardActionsSkeleton({ role }: { role: StandardRole }) {
  if (role === "student") {
    return (
      <div className="dashboard-student-focus">
        <PriorityQueueSkeleton />
        <section className="dashboard-student-links">
          <div className="dashboard-skeleton-section-copy">
            <SkeletonBlock className="dashboard-skeleton-heading" />
            <SkeletonBlock className="skeleton-text dashboard-skeleton-copy" />
          </div>
          <QuickActionsSkeleton role={role} />
        </section>
      </div>
    );
  }
  if (role === "teacher") {
    return (
      <div className="dashboard-teacher-focus">
        <PriorityQueueSkeleton />
        <QuickActionPanelSkeleton role={role} />
      </div>
    );
  }
  return (
    <>
      <PriorityQueueSkeleton />
      <QuickActionPanelSkeleton role={role} />
    </>
  );
}

export function DashboardSectionsSkeleton({ role }: { role: StandardRole }) {
  return (
    <SkeletonRegion label="Menyiapkan dashboard">
      <section className="space-y-8">
        <DashboardHeaderSkeleton />
        <div className="dashboard-composition" data-role={role}>
          <DashboardMetricsSkeleton />
          <DashboardInsightsSkeletonContent role={role} />
          <DashboardActionsSkeleton role={role} />
        </div>
      </section>
    </SkeletonRegion>
  );
}
