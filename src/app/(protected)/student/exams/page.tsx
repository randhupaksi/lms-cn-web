"use client";

import { useRouter } from "next/navigation";
import { RoleBoundary } from "@/components/role-boundary";
import {
  useAvailableExams,
  useStartExam,
} from "@/features/attempts/use-attempts";
import { PageHeader } from "@/components/ui/page-header";
import { GraduationCap } from "lucide-react";

export default function StudentExamsPage() {
  const exams = useAvailableExams();
  const start = useStartExam();
  const router = useRouter();
  return (
    <RoleBoundary allow={["student"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Assessment"
          title="Ujian saya"
          description="Waktu ujian dihitung oleh server. Pastikan koneksi stabil sebelum mulai."
          icon={GraduationCap}
        />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exams.data?.map((exam) => (
            <article className="panel panel-interactive" key={exam.id}>
              <span className="status-badge">
                {exam.attempt_status ?? "belum dimulai"}
              </span>
              <h2 className="mt-4 text-lg font-semibold">{exam.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                {exam.description || "Tidak ada deskripsi."}
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted">Durasi</dt>
                  <dd className="font-semibold">
                    {exam.duration_minutes} menit
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Berakhir</dt>
                  <dd className="font-semibold">
                    {new Date(exam.ends_at).toLocaleString("id-ID")}
                  </dd>
                </div>
              </dl>
              <button
                className="button-primary mt-5 w-full"
                disabled={
                  start.isPending || exam.attempt_status === "submitted"
                }
                onClick={() =>
                  start.mutate(exam.id, {
                    onSuccess: (attempt) =>
                      router.push(`/student/attempts/${attempt.attempt_id}`),
                  })
                }
              >
                {exam.attempt_status === "in_progress"
                  ? "Lanjutkan ujian"
                  : exam.attempt_status === "submitted"
                    ? "Sudah dikumpulkan"
                    : "Mulai ujian"}
              </button>
            </article>
          ))}
          {!exams.isLoading && exams.data?.length === 0 && (
            <div className="panel text-sm text-muted">
              Belum ada ujian yang tersedia.
            </div>
          )}
        </section>
      </div>
    </RoleBoundary>
  );
}
