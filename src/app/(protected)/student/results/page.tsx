"use client";

import { RoleBoundary } from "@/components/role-boundary";
import { useStudentResults } from "@/features/results/use-results";
import { PageHeader } from "@/components/ui/page-header";
import { Trophy } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";

export default function StudentResultsPage() {
  const results = useStudentResults();
  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Assessment results"
          title="Hasil saya"
          description="Hanya hasil yang telah ditinjau dan dipublikasikan guru yang ditampilkan."
          icon={Trophy}
        />
        {results.isLoading ? <LoadingState label="Memuat hasil belajar…" /> : null}
        {results.isError ? <ErrorState label="Hasil belajar belum dapat dimuat." onRetry={() => void results.refetch()} /> : null}
        {!results.isLoading && !results.isError && results.data?.data.length === 0 ? (
          <EmptyState title="Belum ada hasil dipublikasikan" description="Hasil yang telah ditinjau guru akan muncul di halaman ini." />
        ) : null}
        {results.data?.data.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.data?.data.map((result) => (
            <article className="panel panel-interactive" key={result.id}>
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
        </section> : null}
      </div>
    </RoleBoundary>
  );
}
