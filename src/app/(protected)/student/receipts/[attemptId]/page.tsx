"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { RoleBoundary } from "@/components/role-boundary";
import { useAttempt } from "@/features/attempts/use-attempts";
import { ErrorState, LoadingState } from "@/components/data-state";
export default function ReceiptPage() {
  const id = useParams<{ attemptId: string }>().attemptId;
  const attempt = useAttempt(id);
  if (attempt.isLoading) return <LoadingState label="Memuat bukti pengumpulan…" />;
  if (!attempt.data || attempt.isError) return <ErrorState label="Bukti pengumpulan belum dapat dimuat." onRetry={() => void attempt.refetch()} />;
  return (
    <RoleBoundary allow={["student"]}>
      <section className="mx-auto max-w-lg panel text-center">
        <CheckCircle2 className="mx-auto text-primary" size={48} />
        <p className="eyebrow mt-5">SUBMISSION RECEIVED</p>
        <h1 className="mt-2 text-2xl font-semibold">
          Ujian berhasil dikumpulkan
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Jawaban sudah difinalisasi oleh server dan tidak dapat diubah kembali.
          Hasil akan tersedia setelah dipublikasikan guru.
        </p>
        {attempt.data?.submission_receipt && (
          <div className="mt-5 rounded-lg bg-surface p-4">
            <p className="text-xs font-bold text-muted">KODE PENERIMAAN</p>
            <p className="mt-1 break-all font-mono text-sm font-semibold">
              {attempt.data.submission_receipt}
            </p>
          </div>
        )}
        <Link href="/student/exams" className="button-primary mt-6">
          Kembali ke daftar ujian
        </Link>
      </section>
    </RoleBoundary>
  );
}
