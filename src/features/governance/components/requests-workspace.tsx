"use client";
import { useState, type FormEvent } from "react";
import { ArrowDown, Check, Plus, X, Ban } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { RadixSelectField } from "@/components/ui/radix-select";
import type { ScheduleRequest } from "@/services/governance.service";
import {
  useRequests,
  useReadiness,
  useCreateScheduleRequest,
  useDecideScheduleRequest,
  useCancelScheduleRequest,
} from "../use-governance";
import {
  GovernanceBadge,
  GovernanceSection,
  inputToISO,
  MutationFeedback,
  QueryState,
  schoolTime,
  stateLabels,
} from "./governance-shared";

function ScheduleForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [search, setSearch] = useState("");
  const exams = useReadiness({ search, per_page: 100 }, true);
  const mutation = useCreateScheduleRequest();
  const [examId, setExamId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const selected = exams.data?.data.find((exam) => exam.id === examId);
  function submit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate(
      {
        exam_id: examId,
        reason,
        proposed_starts_at: inputToISO(start),
        proposed_ends_at: inputToISO(end),
      },
      { onSuccess: onCreated },
    );
  }
  return (
    <GovernanceSection
      eyebrow="Pengajuan baru"
      title="Usulkan perubahan jadwal"
      action={
        <Button variant="ghost" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <form className="governance-form-grid p-6" onSubmit={submit}>
        <label className="field-label">
          Cari ujian
          <input
            className="field-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Judul ujian atau nama course"
          />
        </label>
        <label className="field-label">
          Ujian
          <RadixSelectField
            value={examId}
            onValueChange={setExamId}
            placeholder="Pilih ujian"
            options={(exams.data?.data ?? [])
              .filter(
                (exam) =>
                  exam.attempt_count === 0 &&
                  (exam.status === "draft" || exam.status === "published"),
              )
              .map((exam) => ({
                value: exam.id,
                label: `${exam.title} · ${exam.class_name}`,
              }))}
          />
        </label>
        <QueryState query={exams} />
        {selected && (
          <p className="governance-form-wide text-sm text-muted">
            Jadwal saat ini: {schoolTime(selected.starts_at)} –{" "}
            {schoolTime(selected.ends_at)} WIB. Durasi ujian{" "}
            {selected.duration_minutes} menit.
          </p>
        )}
        <label className="field-label">
          Usulan mulai · WIB
          <input
            className="field-input"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </label>
        <label className="field-label">
          Usulan selesai · WIB
          <input
            className="field-input"
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </label>
        <label className="field-label governance-form-wide">
          Alasan perubahan
          <textarea
            className="field-input"
            rows={3}
            minLength={10}
            maxLength={1000}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Jelaskan kebutuhan perubahan agar peninjau memiliki konteks yang cukup."
            required
          />
        </label>
        <div className="governance-form-wide flex flex-wrap gap-3 items-center">
          <Button type="submit" disabled={!examId || mutation.isPending}>
            {mutation.isPending ? "Mengajukan…" : "Kirim pengajuan"}
          </Button>
          <p className="text-xs text-muted">
            Jadwal berlaku setelah disetujui pimpinan sekolah.
          </p>
        </div>
        <div className="governance-form-wide">
          <MutationFeedback mutation={mutation} />
        </div>
      </form>
    </GovernanceSection>
  );
}

export function RequestsWorkspace() {
  const [notice, setNotice] = useState("");
  const { user } = useAuth();
  const reviewer = user?.role === "superadmin" || user?.role === "principal";
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [creating, setCreating] = useState(false);
  const query = useRequests({ page, status });
  const rows = query.data?.data ?? [];
  const selected = rows.find((row) => row.id === selectedId) ?? rows[0];
  const decision = useDecideScheduleRequest();
  const cancel = useCancelScheduleRequest();
  const [confirm, setConfirm] = useState<{
    row: ScheduleRequest;
    action: "approved" | "rejected" | "cancelled";
  } | null>(null);
  const [note, setNote] = useState("");
  function open(
    row: ScheduleRequest,
    action: "approved" | "rejected" | "cancelled",
  ) {
    decision.reset();
    cancel.reset();
    setNote("");
    setConfirm({ row, action });
  }
  function execute() {
    if (!confirm) return;
    const options = {
      onSuccess: () => {
        setNotice(
          confirm.action === "approved"
            ? "Usulan disetujui dan jadwal ujian berhasil diperbarui."
            : confirm.action === "rejected"
              ? "Pengajuan ditolak. Catatan keputusan tersedia bagi pengaju."
              : "Pengajuan berhasil dibatalkan.",
        );
        setConfirm(null);
      },
    };
    if (confirm.action === "cancelled") cancel.mutate(confirm.row.id, options);
    else
      decision.mutate(
        { id: confirm.row.id, decision: confirm.action, note },
        options,
      );
  }
  return (
    <div className="governance-workspace">
      <PageHeader
        eyebrow={reviewer ? "Kotak keputusan" : "Koordinasi sekolah"}
        title={
          reviewer ? "Setiap perubahan punya konteks" : "Pengajuan jadwal ujian"
        }
        description={
          reviewer
            ? "Bandingkan usulan dengan jadwal awal, lalu berikan keputusan yang dapat ditelusuri."
            : "Ajukan perubahan jadwal kepada pimpinan sekolah dan ikuti keputusannya."
        }
        actions={
          !reviewer ? (
            <Button onClick={() => setCreating(!creating)}>
              <Plus size={17} aria-hidden="true" />
              Buat pengajuan
            </Button>
          ) : undefined
        }
      />
      {creating && (
        <ScheduleForm
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            setNotice("Pengajuan jadwal berhasil dikirim kepada pimpinan sekolah.");
          }}
        />
      )}
      {notice && (
        <p className="feedback-message feedback-message-success" role="status">
          {notice}
        </p>
      )}
      <div
        className="governance-tabs"
        role="group"
        aria-label="Filter status pengajuan"
      >
        {["pending", "approved", "rejected", "cancelled", ""].map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={status === value}
            onClick={() => {
              setStatus(value);
              setPage(1);
              setSelectedId("");
            }}
          >
            {value ? stateLabels[value] : "Semua"}
          </button>
        ))}
      </div>
      <QueryState query={query} />
      {query.data && (
        <div className="decision-layout">
          <section className="decision-index" aria-label="Daftar pengajuan">
            <div className="decision-index-heading">
              {query.data.meta.total} pengajuan
            </div>
            {rows.map((row) => (
              <button
                className={`decision-item ${selected?.id === row.id ? "is-selected" : ""}`}
                key={row.id}
                onClick={() => setSelectedId(row.id)}
                aria-pressed={selected?.id === row.id}
              >
                <GovernanceBadge value={row.status} />
                <strong>{row.exam_title}</strong>
                <span>{row.course_name}</span>
                <small>
                  {row.requester_name} · {schoolTime(row.created_at, true)}
                </small>
              </button>
            ))}
            {rows.length === 0 && (
              <p className="governance-empty">
                Belum ada pengajuan pada status ini.
              </p>
            )}
            <Pagination
              page={page}
              totalPages={query.data.meta.total_pages}
              onPageChange={setPage}
              disabled={query.isFetching}
            />
          </section>
          <section className="decision-detail" aria-label="Rincian pengajuan">
            {selected ? (
              <>
                <div className="decision-detail-heading">
                  <p className="eyebrow">Perubahan jadwal</p>
                  <h2>{selected.exam_title}</h2>
                  <p>{selected.course_name}</p>
                </div>
                <div className="decision-reason">
                  <span>Diajukan oleh {selected.requester_name}</span>
                  <p>{selected.reason}</p>
                </div>
                <div className="schedule-comparison">
                  <div>
                    <span>Jadwal awal</span>
                    <strong>
                      {schoolTime(selected.original_starts_at)} WIB
                    </strong>
                    <p>sampai {schoolTime(selected.original_ends_at)} WIB</p>
                  </div>
                  <ArrowDown size={20} aria-hidden="true" />
                  <div className="schedule-proposal">
                    <span>Usulan baru</span>
                    <strong>
                      {schoolTime(selected.proposed_starts_at)} WIB
                    </strong>
                    <p>sampai {schoolTime(selected.proposed_ends_at)} WIB</p>
                  </div>
                </div>
                {selected.status === "pending" ? (
                  <div className="decision-action-area">
                    {reviewer && selected.requester_id !== user?.id ? (
                      <>
                        <p>
                          Persetujuan memperbarui jadwal ujian. Jadwal diperiksa
                          ulang dan terkunci bila sudah ada siswa yang memulai
                          ujian.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Button onClick={() => open(selected, "approved")}>
                            <Check size={17} aria-hidden="true" />
                            Setujui usulan
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => open(selected, "rejected")}
                          >
                            <X size={17} aria-hidden="true" />
                            Tolak
                          </Button>
                        </div>
                      </>
                    ) : selected.requester_id === user?.id ? (
                      <Button
                        variant="secondary"
                        onClick={() => open(selected, "cancelled")}
                      >
                        <Ban size={17} aria-hidden="true" />
                        Batalkan pengajuan
                      </Button>
                    ) : (
                      <p>Menunggu keputusan pimpinan sekolah.</p>
                    )}
                  </div>
                ) : (
                  <div className="decision-resolution">
                    <GovernanceBadge value={selected.status} />
                    <p>{selected.decision_note}</p>
                    <small>
                      {selected.reviewer_name || selected.requester_name}
                      {selected.decided_at
                        ? ` · ${schoolTime(selected.decided_at)} WIB`
                        : ""}
                    </small>
                  </div>
                )}
              </>
            ) : (
              <div className="decision-placeholder">
                <ClipboardIllustration />
                <h2>Ruang untuk keputusan berikutnya</h2>
                <p>Pengajuan dan perbandingan jadwal akan tampil di sini.</p>
              </div>
            )}
          </section>
        </div>
      )}
      <ConfirmationDialog
        open={Boolean(confirm)}
        onOpenChange={(value) => {
          if (!value) setConfirm(null);
        }}
        title={
          confirm?.action === "approved"
            ? "Setujui perubahan jadwal?"
            : confirm?.action === "rejected"
              ? "Tolak pengajuan ini?"
              : "Batalkan pengajuan?"
        }
        description={confirm?.row.exam_title ?? ""}
        confirmLabel={
          confirm?.action === "approved"
            ? "Setujui"
            : confirm?.action === "rejected"
              ? "Tolak pengajuan"
              : "Batalkan pengajuan"
        }
        confirmDisabled={
          confirm?.action !== "cancelled" && note.trim().length < 10
        }
        pending={decision.isPending || cancel.isPending}
        onConfirm={() => {
          if (confirm?.action !== "cancelled" && note.trim().length < 10)
            return;
          execute();
        }}
      >
        {confirm?.action !== "cancelled" && (
          <label className="field-label mt-4">
            Catatan keputusan · minimal 10 karakter
            <textarea
              className="field-input"
              rows={3}
              value={note}
              maxLength={1000}
              onChange={(e) => setNote(e.target.value)}
              required
            />
            <span className="text-xs text-muted">
              Catatan akan terlihat oleh pengaju.
            </span>
          </label>
        )}
        <MutationFeedback mutation={decision} />
        <MutationFeedback mutation={cancel} />
      </ConfirmationDialog>
    </div>
  );
}
function ClipboardIllustration() {
  return (
    <span className="decision-placeholder-icon">
      <Check size={28} aria-hidden="true" />
    </span>
  );
}
