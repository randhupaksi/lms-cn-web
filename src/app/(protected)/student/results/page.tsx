"use client";

import { RoleBoundary } from "@/components/role-boundary";
import { useStudentResults } from "@/features/results/use-results";

export default function StudentResultsPage() {
  const results = useStudentResults();
  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <header>
          <p className="eyebrow">ASSESSMENT RESULTS</p>
          <h1 className="page-title">Hasil saya</h1>
          <p className="page-description">
            Hanya hasil yang telah ditinjau dan dipublikasikan guru yang
            ditampilkan.
          </p>
        </header>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.data?.data.map((result) => (
            <article className="panel" key={result.id}>
              <span className="status-badge status-active">Dipublikasikan</span>
              <h2 className="mt-4 text-lg font-semibold">
                {result.exam_title}
              </h2>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-muted">NILAI</p>
                  <p className="mt-1 text-3xl font-bold text-primary">
                    {result.percentage.toFixed(1)}
                  </p>
                </div>
                <p className="text-sm text-muted">
                  {result.score} / {result.max_score} poin
                </p>
              </div>
              <p className="mt-4 border-t border-border pt-4 text-xs text-muted">
                Dinilai {new Date(result.graded_at).toLocaleString("id-ID")}
              </p>
            </article>
          ))}
          {!results.isLoading && results.data?.data.length === 0 && (
            <div className="panel text-sm text-muted">
              Belum ada hasil yang dipublikasikan.
            </div>
          )}
        </section>
      </div>
    </RoleBoundary>
  );
}
