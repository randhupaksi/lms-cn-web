import {
  DataTableSkeleton,
  SkeletonBlock,
  SkeletonRegion,
} from "@/components/ui/skeleton";

function SectionHeadingSkeleton() {
  return (
    <header className="governance-section-heading">
      <div className="governance-skeleton-heading-copy">
        <SkeletonBlock className="governance-skeleton-eyebrow" />
        <SkeletonBlock className="governance-skeleton-title" />
      </div>
      <SkeletonBlock className="governance-skeleton-action" />
    </header>
  );
}

function CommandMetricSkeleton() {
  return (
    <div className="command-metric">
      <SkeletonBlock className="command-metric-icon governance-skeleton-icon" />
      <div className="command-metric-copy governance-skeleton-metric-copy">
        <SkeletonBlock className="governance-skeleton-line" />
        <SkeletonBlock className="governance-skeleton-metric-value" />
        <SkeletonBlock className="governance-skeleton-meta" />
      </div>
    </div>
  );
}

function PrioritySkeleton() {
  return (
    <div className="command-priority">
      <SkeletonBlock className="command-priority-number governance-skeleton-number" />
      <div className="governance-skeleton-priority-copy">
        <SkeletonBlock className="governance-skeleton-title" />
        <SkeletonBlock className="governance-skeleton-line" />
      </div>
      <SkeletonBlock className="governance-skeleton-arrow" />
    </div>
  );
}

export function ControlCenterSkeleton() {
  return (
    <SkeletonRegion label="Memuat ringkasan tata kelola sekolah">
      <div className="governance-control-skeleton">
        <div className="command-metrics">
          {[0, 1, 2, 3].map((item) => (
            <CommandMetricSkeleton key={item} />
          ))}
        </div>
        <section className="governance-section">
          <SectionHeadingSkeleton />
          <div className="governance-skeleton-section-body">
            <SkeletonBlock className="governance-skeleton-cycle" />
            <div className="governance-skeleton-legend">
              {[0, 1, 2, 3].map((item) => (
                <span key={item}>
                  <SkeletonBlock className="governance-skeleton-meta" />
                  <SkeletonBlock className="governance-skeleton-number-small" />
                </span>
              ))}
            </div>
          </div>
        </section>
        <section className="governance-section">
          <SectionHeadingSkeleton />
          <div className="governance-skeleton-section-body governance-skeleton-priorities">
            {[0, 1].map((item) => (
              <PrioritySkeleton key={item} />
            ))}
            <div className="governance-skeleton-footer">
              <SkeletonBlock className="governance-skeleton-line" />
              <SkeletonBlock className="governance-skeleton-action" />
            </div>
          </div>
        </section>
        <div className="command-main-grid">
          {[0, 1].map((section) => (
            <section className="governance-section" key={section}>
              <SectionHeadingSkeleton />
              <div className="governance-skeleton-section-body governance-skeleton-agenda">
                {[0, 1, 2].map((item) => (
                  <div className="governance-skeleton-agenda-item" key={item}>
                    <SkeletonBlock className="governance-skeleton-icon" />
                    <span>
                      <SkeletonBlock className="governance-skeleton-title" />
                      <SkeletonBlock className="governance-skeleton-meta" />
                    </span>
                    <SkeletonBlock className="skeleton-cell-badge" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <section className="governance-section">
          <SectionHeadingSkeleton />
          <div className="governance-skeleton-ledger">
            {[0, 1, 2, 3, 4].map((item) => (
              <div className="governance-skeleton-ledger-row" key={item}>
                <span>
                  <SkeletonBlock className="governance-skeleton-line" />
                  <SkeletonBlock className="governance-skeleton-meta" />
                </span>
                <SkeletonBlock className="governance-skeleton-track" />
                <SkeletonBlock className="governance-skeleton-number-small" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </SkeletonRegion>
  );
}

export function QualityWorkspaceSkeleton() {
  return (
    <SkeletonRegion label="Memuat ringkasan kualitas data">
      <div className="governance-quality-skeleton">
        <div className="quality-summary">
          <SkeletonBlock className="governance-skeleton-summary-number" />
          <span>
            <SkeletonBlock className="governance-skeleton-title" />
            <SkeletonBlock className="governance-skeleton-line" />
            <SkeletonBlock className="governance-skeleton-meta" />
          </span>
        </div>
        <div className="quality-grid">
          {[0, 1, 2, 3].map((item) => (
            <section className="quality-group" key={item}>
              <div className="quality-group-heading">
                <SkeletonBlock className="governance-skeleton-number-small" />
                <SkeletonBlock className="governance-skeleton-icon" />
              </div>
              <SkeletonBlock className="governance-skeleton-title" />
              <SkeletonBlock className="governance-skeleton-line" />
              <div className="governance-skeleton-sample-list">
                {[0, 1, 2].map((sample) => (
                  <SkeletonBlock
                    className="governance-skeleton-meta"
                    key={sample}
                  />
                ))}
              </div>
              <SkeletonBlock className="governance-skeleton-action" />
            </section>
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function DecisionListSkeleton() {
  return (
    <SkeletonRegion label="Memuat pengajuan perubahan jadwal">
      <div className="decision-layout">
        <section className="decision-index" aria-label="Daftar pengajuan">
          <div className="decision-index-heading">
            <SkeletonBlock className="governance-skeleton-line" />
          </div>
          {[0, 1, 2, 3].map((item) => (
            <div className="decision-item decision-skeleton-item" key={item}>
              <SkeletonBlock className="skeleton-cell-badge" />
              <SkeletonBlock className="governance-skeleton-title" />
              <SkeletonBlock className="governance-skeleton-line" />
              <SkeletonBlock className="governance-skeleton-meta" />
            </div>
          ))}
        </section>
        <section className="decision-detail" aria-label="Rincian pengajuan">
          <div className="decision-detail-heading">
            <SkeletonBlock className="governance-skeleton-eyebrow" />
            <SkeletonBlock className="governance-skeleton-title" />
            <SkeletonBlock className="governance-skeleton-meta" />
          </div>
          <div className="governance-skeleton-reason">
            <SkeletonBlock className="governance-skeleton-meta" />
            <SkeletonBlock className="governance-skeleton-line" />
            <SkeletonBlock className="governance-skeleton-line-short" />
          </div>
          <div className="schedule-comparison governance-skeleton-comparison">
            {[0, 1].map((item) => (
              <div key={item}>
                <SkeletonBlock className="governance-skeleton-meta" />
                <SkeletonBlock className="governance-skeleton-title" />
                <SkeletonBlock className="governance-skeleton-line" />
              </div>
            ))}
          </div>
          <SkeletonBlock className="governance-skeleton-action" />
        </section>
      </div>
    </SkeletonRegion>
  );
}

function SettingsFieldSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className={`governance-skeleton-field ${wide ? "governance-form-wide" : ""}`}
    >
      <SkeletonBlock className="governance-skeleton-meta" />
      <SkeletonBlock className="governance-skeleton-control" />
    </div>
  );
}

export function SettingsFormSkeleton() {
  return (
    <SkeletonRegion label="Memuat formulir pengaturan sekolah">
      <div className="settings-layout">
        <section className="governance-section">
          <SectionHeadingSkeleton />
          <div className="governance-form-grid governance-skeleton-form p-6">
            <SettingsFieldSkeleton wide />
            <SettingsFieldSkeleton wide />
            <SettingsFieldSkeleton />
            <SettingsFieldSkeleton />
            <SettingsFieldSkeleton wide />
            <div className="governance-form-wide governance-skeleton-form-actions">
              <SkeletonBlock className="governance-skeleton-action" />
            </div>
          </div>
        </section>
        <aside className="settings-aside settings-skeleton-aside">
          <SkeletonBlock className="governance-skeleton-title" />
          <SkeletonBlock className="governance-skeleton-line" />
          <SkeletonBlock className="governance-skeleton-line-short" />
          <hr />
          <SkeletonBlock className="governance-skeleton-title" />
          <SkeletonBlock className="governance-skeleton-line" />
          <SkeletonBlock className="governance-skeleton-line-short" />
          <hr />
          <div className="settings-skeleton-meta-list">
            {[0, 1, 2].map((item) => (
              <span key={item}>
                <SkeletonBlock className="governance-skeleton-meta" />
                <SkeletonBlock className="governance-skeleton-number-small" />
              </span>
            ))}
          </div>
          <SkeletonBlock className="governance-skeleton-meta" />
          <SkeletonBlock className="governance-skeleton-meta" />
        </aside>
      </div>
    </SkeletonRegion>
  );
}

export function SettingsHistorySkeleton() {
  return (
    <SkeletonRegion label="Memuat riwayat pengaturan sekolah">
      <div className="settings-history">
        {[0, 1, 2].map((item) => (
          <div className="settings-history-skeleton-row" key={item}>
            <SkeletonBlock className="governance-skeleton-icon" />
            <span>
              <SkeletonBlock className="governance-skeleton-title" />
              <SkeletonBlock className="governance-skeleton-meta" />
            </span>
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function CalendarWorkspaceSkeleton() {
  return (
    <SkeletonRegion label="Memuat kalender ujian">
      <div className="calendar-layout governance-calendar-skeleton">
        <section
          className="governance-section school-calendar"
          aria-label="Kalender bulanan"
        >
          <div className="calendar-skeleton-heading">
            <SkeletonBlock className="governance-skeleton-title" />
            <div className="calendar-skeleton-controls">
              <SkeletonBlock />
              <SkeletonBlock />
              <SkeletonBlock />
            </div>
          </div>
          <div
            className="school-calendar-week calendar-skeleton-week"
            aria-hidden="true"
          >
            {[0, 1, 2, 3, 4, 5, 6].map((item) => (
              <SkeletonBlock className="calendar-skeleton-weekday" key={item} />
            ))}
          </div>
          <div
            className="school-calendar-grid calendar-skeleton-grid"
            aria-hidden="true"
          >
            {Array.from({ length: 42 }, (_, item) => (
              <SkeletonBlock key={item} />
            ))}
          </div>
          <div className="calendar-key">
            <SkeletonBlock className="governance-skeleton-line" />
          </div>
        </section>
        <section
          className="governance-section calendar-agenda"
          aria-label="Jadwal ujian"
        >
          <header className="governance-section-heading">
            <div className="governance-skeleton-heading-copy">
              <SkeletonBlock className="governance-skeleton-eyebrow" />
              <SkeletonBlock className="governance-skeleton-title" />
            </div>
          </header>
          <div className="calendar-skeleton-agenda">
            {[0, 1, 2].map((item) => (
              <div className="calendar-skeleton-agenda-item" key={item}>
                <SkeletonBlock className="governance-skeleton-icon" />
                <span>
                  <SkeletonBlock className="governance-skeleton-title" />
                  <SkeletonBlock className="governance-skeleton-meta" />
                  <SkeletonBlock className="governance-skeleton-line" />
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SkeletonRegion>
  );
}

export function ReportsTableSkeleton() {
  return (
    <DataTableSkeleton
      label="Memuat laporan pembelajaran"
      className="report-table"
      rows={6}
      columns={[
        { label: "Course / kelas", kind: "stack" },
        { label: "Siswa", kind: "numeric", align: "right" },
        { label: "Guru", kind: "numeric", align: "right" },
        { label: "Ujian", kind: "numeric", align: "right" },
        { label: "Attempt selesai", kind: "numeric", align: "right" },
        { label: "Hasil publik", kind: "numeric", align: "right" },
        { label: "Rerata", kind: "numeric", align: "right" },
        { label: "Di bawah referensi", kind: "numeric", align: "right" },
        { label: "Tugas", kind: "numeric", align: "right" },
        { label: "Perlu dinilai", kind: "numeric", align: "right" },
      ]}
    />
  );
}

export function FieldOptionsSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label} className="governance-options-skeleton">
      <SkeletonBlock className="governance-skeleton-control" />
    </SkeletonRegion>
  );
}
