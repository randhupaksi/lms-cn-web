import { cn } from "@/lib/cn";
import { SkeletonBlock, SkeletonRegion } from "./skeleton";

export function RecordListSkeleton({
  label,
  rows = 3,
  className,
}: {
  label: string;
  rows?: number;
  className?: string;
}) {
  return (
    <SkeletonRegion label={label}>
      <div className={cn("record-list", className)}>
        {Array.from({ length: rows }, (_, index) => (
          <article className="record-row" key={index}>
            <div className="record-skeleton-content">
              <div className="record-skeleton-heading">
                <SkeletonBlock className="skeleton-cell-badge" />
                <SkeletonBlock className="record-skeleton-title" />
              </div>
              <SkeletonBlock className="record-skeleton-meta" />
              <div className="record-skeleton-copy">
                <SkeletonBlock className="record-skeleton-line" />
                <SkeletonBlock className="record-skeleton-line-short" />
              </div>
            </div>
            <div className="record-skeleton-actions">
              <SkeletonBlock className="skeleton-action-icon" />
              <SkeletonBlock className="skeleton-action-icon" />
            </div>
          </article>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function QuestionListSkeleton() {
  return (
    <SkeletonRegion label="Memuat bank soal">
      <div className="record-list">
        {[0, 1, 2, 3].map((item) => (
          <article className="record-row question-skeleton-row" key={item}>
            <SkeletonBlock className="record-skeleton-meta" />
            <SkeletonBlock className="record-skeleton-meta question-skeleton-tags" />
            <SkeletonBlock className="record-skeleton-title question-skeleton-stem" />
            <SkeletonBlock className="record-skeleton-line" />
            <div className="record-skeleton-actions question-skeleton-actions">
              <SkeletonBlock className="skeleton-action-icon" />
              <SkeletonBlock className="skeleton-action-icon" />
            </div>
          </article>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function AssignmentCardsSkeleton({
  label,
  rows = 3,
}: {
  label: string;
  rows?: number;
}) {
  return (
    <SkeletonRegion label={label}>
      <div className="assignment-skeleton-list">
        {Array.from({ length: rows }, (_, index) => (
          <article className="assignment-card" key={index}>
            <div className="assignment-skeleton-heading">
              <div className="assignment-skeleton-title-group">
                <SkeletonBlock className="skeleton-cell-badge" />
                <SkeletonBlock className="record-skeleton-title" />
                <SkeletonBlock className="record-skeleton-meta" />
              </div>
              <SkeletonBlock className="assignment-skeleton-score" />
            </div>
            <div className="assignment-skeleton-copy">
              <SkeletonBlock className="record-skeleton-line" />
              <SkeletonBlock className="record-skeleton-line" />
              <SkeletonBlock className="record-skeleton-line-short" />
            </div>
            <SkeletonBlock className="assignment-skeleton-deadline" />
            <div className="assignment-skeleton-response">
              <SkeletonBlock className="record-skeleton-line" />
              <SkeletonBlock className="assignment-skeleton-button" />
            </div>
          </article>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function ExamScheduleSkeleton({
  label,
  rows = 3,
}: {
  label: string;
  rows?: number;
}) {
  return (
    <SkeletonRegion label={label}>
      <section className="record-list" aria-label="Ujian">
        {Array.from({ length: rows }, (_, index) => (
          <article className="record-row exam-schedule-row" key={index}>
            <div className="schedule-skeleton-main">
              <SkeletonBlock className="skeleton-cell-badge" />
              <SkeletonBlock className="record-skeleton-title" />
              <SkeletonBlock className="record-skeleton-meta" />
              <SkeletonBlock className="record-skeleton-line" />
            </div>
            <div className="schedule-skeleton-facts">
              <div className="schedule-skeleton-fact">
                <SkeletonBlock className="skeleton-square schedule-skeleton-icon" />
                <span>
                  <SkeletonBlock className="record-skeleton-meta" />
                  <SkeletonBlock className="record-skeleton-line-short" />
                </span>
              </div>
              <div className="schedule-skeleton-fact">
                <SkeletonBlock className="skeleton-square schedule-skeleton-icon" />
                <span>
                  <SkeletonBlock className="record-skeleton-meta" />
                  <SkeletonBlock className="record-skeleton-line" />
                </span>
              </div>
            </div>
            <SkeletonBlock className="assignment-skeleton-button" />
          </article>
        ))}
      </section>
    </SkeletonRegion>
  );
}

export function ReadingWorkspaceSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label}>
      <div className="reading-workspace">
        <section className="reading-skeleton-index" aria-label="Daftar materi">
          <div className="collection-heading mb-4">
            <SkeletonBlock className="record-skeleton-title" />
            <SkeletonBlock className="record-skeleton-meta" />
          </div>
          <div className="reading-index">
            {[0, 1, 2, 3].map((index) => (
              <div className="reading-index-item" key={index}>
                <SkeletonBlock className="record-skeleton-meta" />
                <SkeletonBlock className="record-skeleton-title" />
                <SkeletonBlock className="reading-skeleton-link" />
              </div>
            ))}
          </div>
        </section>
        <article className="learning-reader">
          <div className="learning-reader-heading">
            <div className="reading-skeleton-reader-title">
              <SkeletonBlock className="record-skeleton-meta" />
              <SkeletonBlock className="reading-skeleton-title" />
              <SkeletonBlock className="record-skeleton-line" />
            </div>
            <SkeletonBlock className="skeleton-cell-badge" />
          </div>
          <div className="learning-reader-body reading-skeleton-body">
            {[0, 1, 2].map((paragraph) => (
              <div className="reading-skeleton-paragraph" key={paragraph}>
                <SkeletonBlock className="record-skeleton-line" />
                <SkeletonBlock className="record-skeleton-line" />
                <SkeletonBlock className="record-skeleton-line-short" />
              </div>
            ))}
          </div>
          <div className="learning-reader-footer">
            <SkeletonBlock className="record-skeleton-meta" />
            <SkeletonBlock className="assignment-skeleton-button" />
          </div>
        </article>
      </div>
    </SkeletonRegion>
  );
}

export function ExamSheetSkeleton() {
  return (
    <SkeletonRegion label="Menyiapkan lembar ujian">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="exam-toolbar">
          <div className="exam-skeleton-progress">
            <SkeletonBlock className="record-skeleton-meta" />
            <SkeletonBlock className="record-skeleton-title" />
            <SkeletonBlock className="exam-skeleton-progress-track" />
          </div>
          <div className="exam-skeleton-timer">
            <SkeletonBlock className="record-skeleton-meta" />
            <SkeletonBlock className="exam-skeleton-time" />
          </div>
        </header>
        <div className="exam-layout">
          <section className="panel exam-question">
            <SkeletonBlock className="record-skeleton-meta" />
            <SkeletonBlock className="exam-skeleton-question-title" />
            <SkeletonBlock className="record-skeleton-line" />
            <SkeletonBlock className="record-skeleton-line-short" />
            <fieldset className="mt-6 space-y-3">
              <legend className="sr-only">Pilihan jawaban</legend>
              {[0, 1, 2, 3].map((option) => (
                <div className="exam-skeleton-option" key={option}>
                  <SkeletonBlock className="exam-skeleton-radio" />
                  <SkeletonBlock className="record-skeleton-line" />
                </div>
              ))}
            </fieldset>
            <div className="exam-question-footer">
              <SkeletonBlock className="assignment-skeleton-button" />
              <SkeletonBlock className="assignment-skeleton-button" />
            </div>
          </section>
          <aside className="panel exam-navigation" aria-label="Navigasi soal">
            <SkeletonBlock className="record-skeleton-title" />
            <div className="exam-skeleton-navigation">
              {Array.from({ length: 15 }, (_, index) => (
                <SkeletonBlock className="exam-skeleton-nav-item" key={index} />
              ))}
            </div>
            <SkeletonBlock className="record-skeleton-meta" />
            <SkeletonBlock className="assignment-skeleton-button mt-6" />
          </aside>
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function MemberListSkeleton({
  label,
  rows = 5,
}: {
  label: string;
  rows?: number;
}) {
  return (
    <SkeletonRegion label={label}>
      <div className="member-skeleton-list">
        {Array.from({ length: rows }, (_, index) => (
          <div className="selection-item member-skeleton-item" key={index}>
            <SkeletonBlock className="member-skeleton-checkbox" />
            <span>
              <SkeletonBlock className="record-skeleton-title" />
              <SkeletonBlock className="record-skeleton-meta" />
            </span>
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function SessionRowsSkeleton() {
  return (
    <SkeletonRegion label="Memuat sesi aktif">
      <div className="session-skeleton-list">
        {[0, 1].map((item) => (
          <div className="session-record" key={item}>
            <SkeletonBlock className="record-skeleton-title" />
            <SkeletonBlock className="record-skeleton-meta" />
            <SkeletonBlock className="record-skeleton-meta" />
            <SkeletonBlock className="record-skeleton-meta" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function MetricStripSkeleton({
  label,
  count = 4,
}: {
  label: string;
  count?: number;
}) {
  return (
    <SkeletonRegion label={label}>
      <dl className="metric-strip metric-strip-skeleton">
        {Array.from({ length: count }, (_, item) => (
          <div className="metric-card" key={item}>
            <SkeletonBlock className="record-skeleton-meta" />
            <SkeletonBlock className="metric-skeleton-value" />
          </div>
        ))}
      </dl>
    </SkeletonRegion>
  );
}

export function FilterOptionsSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label} className="filter-options-skeleton">
      <SkeletonBlock className="filter-options-skeleton-line" />
    </SkeletonRegion>
  );
}

export function AcademicStructureSkeleton() {
  return (
    <SkeletonRegion label="Memuat struktur akademik">
      <div className="academic-skeleton-workspace">
        <div className="academic-skeleton-intro">
          <SkeletonBlock className="record-skeleton-line" />
          <SkeletonBlock className="record-skeleton-line-short" />
        </div>
        <div className="academic-skeleton-grid">
          {[0, 1, 2, 3].map((panel) => (
            <section className="panel academic-skeleton-panel" key={panel}>
              <SkeletonBlock className="record-skeleton-title" />
              <div className="academic-skeleton-fields">
                {[0, 1, 2, 3].map((field) => (
                  <SkeletonBlock
                    className="academic-skeleton-field"
                    key={field}
                  />
                ))}
              </div>
              <SkeletonBlock className="assignment-skeleton-button" />
              <div className="academic-skeleton-rows">
                {[0, 1, 2].map((row) => (
                  <div key={row}>
                    <SkeletonBlock className="record-skeleton-line" />
                    <SkeletonBlock className="record-skeleton-meta" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function QuestionSelectionSkeleton() {
  return (
    <SkeletonRegion label="Memuat daftar soal untuk ujian">
      <div className="question-selection-skeleton">
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            className="selection-item question-selection-skeleton-row"
            key={item}
          >
            <SkeletonBlock className="member-skeleton-checkbox" />
            <span>
              <SkeletonBlock className="record-skeleton-title" />
              <SkeletonBlock className="record-skeleton-meta" />
            </span>
            <SkeletonBlock className="question-selection-skeleton-points" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function ExamConfigurationSkeleton() {
  return (
    <SkeletonRegion label="Memuat konfigurasi ujian">
      <div className="space-y-8">
        <header className="page-header">
          <div className="exam-config-skeleton-header">
            <div>
              <SkeletonBlock className="record-skeleton-meta" />
              <SkeletonBlock className="exam-config-skeleton-title" />
              <SkeletonBlock className="record-skeleton-line" />
              <SkeletonBlock className="record-skeleton-line-short" />
            </div>
            <SkeletonBlock className="assignment-skeleton-button" />
          </div>
        </header>
        <div className="metric-strip exam-config-skeleton-metrics">
          {[0, 1, 2].map((item) => (
            <div className="metric-card" key={item}>
              <SkeletonBlock className="record-skeleton-meta" />
              <SkeletonBlock className="exam-config-skeleton-value" />
            </div>
          ))}
        </div>
        <div className="exam-config-skeleton-panels">
          {[0, 1].map((panel) => (
            <section className="panel exam-config-skeleton-panel" key={panel}>
              <SkeletonBlock className="record-skeleton-title" />
              <SkeletonBlock className="exam-config-skeleton-control" />
              {[0, 1, 2, 3].map((row) => (
                <div
                  className="selection-item exam-config-skeleton-row"
                  key={row}
                >
                  <SkeletonBlock className="member-skeleton-checkbox" />
                  <span>
                    <SkeletonBlock className="record-skeleton-title" />
                    <SkeletonBlock className="record-skeleton-meta" />
                  </span>
                </div>
              ))}
              <SkeletonBlock className="assignment-skeleton-button" />
            </section>
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function AuthGateSkeleton() {
  return (
    <SkeletonRegion label="Menyiapkan sesi">
      <div className="auth-skeleton-card">
        <SkeletonBlock className="skeleton-square auth-skeleton-mark" />
        <SkeletonBlock className="record-skeleton-title" />
        <SkeletonBlock className="record-skeleton-line" />
      </div>
    </SkeletonRegion>
  );
}

export function ReceiptSkeleton() {
  return (
    <SkeletonRegion label="Memuat bukti pengumpulan ujian">
      <section className="mx-auto max-w-lg panel text-center receipt-skeleton">
        <SkeletonBlock className="receipt-skeleton-icon" />
        <SkeletonBlock className="record-skeleton-meta receipt-skeleton-eyebrow" />
        <SkeletonBlock className="receipt-skeleton-title" />
        <div className="receipt-skeleton-copy">
          <SkeletonBlock className="record-skeleton-line" />
          <SkeletonBlock className="record-skeleton-line-short" />
        </div>
        <div className="receipt-skeleton-code">
          <SkeletonBlock className="record-skeleton-meta" />
          <SkeletonBlock className="receipt-skeleton-code-value" />
        </div>
        <SkeletonBlock className="assignment-skeleton-button receipt-skeleton-button" />
      </section>
    </SkeletonRegion>
  );
}
