"use client";
import { useState, type FormEvent } from "react";
import { Archive, ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { RadixSelectField } from "@/components/ui/radix-select";
import type { SchoolEvent } from "@/services/governance.service";
import {
  useAgenda,
  useArchiveSchoolEvent,
  useSaveSchoolEvent,
} from "../use-governance";
import {
  GovernanceBadge,
  GovernanceSection,
  inputToISO,
  localInput,
  MutationFeedback,
  QueryState,
  schoolTime,
} from "./governance-shared";

const schoolDay = (value: string) =>
  new Date(new Date(value).getTime() + 7 * 3600_000).toISOString().slice(0, 10);
const today = () => schoolDay(new Date().toISOString());
function EventForm({
  initial,
  day,
  onClose,
  onSaved,
}: {
  initial?: SchoolEvent;
  day: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const save = useSaveSchoolEvent();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "academic",
    starts_at: initial ? localInput(initial.starts_at) : `${day}T09:00`,
    ends_at: initial ? localInput(initial.ends_at) : `${day}T10:00`,
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    save.mutate(
      {
        id: initial?.id,
        body: {
          ...form,
          starts_at: inputToISO(form.starts_at),
          ends_at: inputToISO(form.ends_at),
          version: initial?.version ?? 0,
        },
      },
      { onSuccess: onSaved },
    );
  }
  return (
    <GovernanceSection
      eyebrow="Agenda sekolah"
      title={initial ? "Sunting agenda" : "Tambahkan agenda"}
      action={
        <Button variant="ghost" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <form className="governance-form-grid p-6" onSubmit={submit}>
        <label className="field-label">
          Judul agenda
          <input
            className="field-input"
            required
            minLength={3}
            maxLength={180}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label className="field-label">
          Kategori
          <RadixSelectField
            placeholder="Pilih opsi"
            value={form.category}
            onValueChange={(category) => setForm({ ...form, category })}
            options={[
              { value: "academic", label: "Akademik" },
              { value: "holiday", label: "Hari libur" },
              { value: "meeting", label: "Rapat" },
              { value: "announcement", label: "Pengumuman" },
            ]}
          />
        </label>
        <label className="field-label">
          Mulai · WIB
          <input
            className="field-input"
            type="datetime-local"
            value={form.starts_at}
            required
            onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
          />
        </label>
        <label className="field-label">
          Selesai · WIB
          <input
            className="field-input"
            type="datetime-local"
            value={form.ends_at}
            required
            onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
          />
        </label>
        <label className="field-label governance-form-wide">
          Keterangan
          <textarea
            className="field-input"
            rows={3}
            value={form.description}
            maxLength={2000}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <div className="governance-form-wide">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Menyimpan…" : "Simpan agenda"}
          </Button>
          <MutationFeedback mutation={save} />
        </div>
      </form>
    </GovernanceSection>
  );
}

export function CalendarWorkspace() {
  const [saved, setSaved] = useState(false);
  const [month, setMonth] = useState(() => today().slice(0, 7));
  const [selected, setSelected] = useState("");
  const first = new Date(`${month}-01T00:00:00Z`);
  const offset = (first.getUTCDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, i) =>
    new Date(
      Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), i - offset + 1),
    )
      .toISOString()
      .slice(0, 10),
  );
  const end = new Date(`${days[41]}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const query = useAgenda(days[0], end.toISOString().slice(0, 10));
  const events = query.data ?? [];
  const [editor, setEditor] = useState<SchoolEvent | "new" | null>(null);
  const [archiving, setArchiving] = useState<SchoolEvent | null>(null);
  const archive = useArchiveSchoolEvent();
  const visible = events.filter((event) =>
    selected
      ? schoolDay(event.starts_at) <= selected &&
        schoolDay(
          new Date(new Date(event.ends_at).getTime() - 1).toISOString(),
        ) >= selected
      : schoolDay(event.starts_at).slice(0, 7) === month ||
        (schoolDay(event.starts_at) < `${month}-01` &&
          schoolDay(event.ends_at) >= `${month}-01`),
  );
  function navigate(delta: number) {
    const next = new Date(
      Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + delta, 1),
    );
    setMonth(next.toISOString().slice(0, 7));
    setSelected("");
  }
  return (
    <div className="governance-workspace">
      <PageHeader
        eyebrow="Kalender sekolah"
        title="Satu pandangan untuk agenda bersama"
        description="Jadwal ujian terhubung otomatis. Tambahkan agenda akademik, rapat, dan hari libur sekolah."
        actions={
          <Button onClick={() => setEditor("new")}>
            <Plus size={17} aria-hidden="true" />
            Tambah agenda
          </Button>
        }
      />
      {editor && (
        <EventForm
          key={editor === "new" ? "new" : editor.id}
          initial={editor === "new" ? undefined : editor}
          day={
            selected ||
            (month === today().slice(0, 7) ? today() : `${month}-01`)
          }
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            setSaved(true);
          }}
        />
      )}
      <QueryState query={query} />
      {saved && (
        <p className="feedback-message feedback-message-success" role="status">
          Agenda berhasil disimpan di kalender sekolah.
        </p>
      )}
      <MutationFeedback
        mutation={archive}
        success="Agenda berhasil diarsipkan."
      />
      <div className="calendar-layout">
        <section
          className="governance-section school-calendar"
          aria-label="Kalender bulanan"
        >
          <header>
            <h2>
              {new Intl.DateTimeFormat("id-ID", {
                timeZone: "UTC",
                month: "long",
                year: "numeric",
              }).format(first)}
            </h2>
            <div className="flex gap-2">
              <ActionButton
                icon={ChevronLeft}
                label="Bulan sebelumnya"
                onClick={() => navigate(-1)}
              />
              <Button
                variant="ghost"
                size="compact"
                onClick={() => {
                  setMonth(today().slice(0, 7));
                  setSelected(today());
                }}
              >
                Hari ini
              </Button>
              <ActionButton
                icon={ChevronRight}
                label="Bulan berikutnya"
                onClick={() => navigate(1)}
              />
            </div>
          </header>
          <div className="school-calendar-week" aria-hidden="true">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="school-calendar-grid">
            {days.map((day) => {
              const count = events.filter(
                (event) =>
                  schoolDay(event.starts_at) <= day &&
                  schoolDay(
                    new Date(
                      new Date(event.ends_at).getTime() - 1,
                    ).toISOString(),
                  ) >= day,
              ).length;
              return (
                <button
                  key={day}
                  className={`${day.slice(0, 7) !== month ? "outside-month" : ""} ${day === today() ? "is-today" : ""} ${day === selected ? "is-selected" : ""}`}
                  aria-label={`${schoolTime(`${day}T00:00:00+07:00`, true)}, ${count} agenda`}
                  aria-pressed={selected === day}
                  onClick={() => setSelected(day)}
                >
                  <span>{Number(day.slice(8))}</span>
                  {count > 0 && (
                    <small>
                      {count}
                      <span className="calendar-agenda-word"> agenda</span>
                    </small>
                  )}
                </button>
              );
            })}
          </div>
          <p className="calendar-key">
            Seluruh waktu menggunakan WIB. Pilih tanggal untuk melihat agenda.
          </p>
        </section>
        <section className="governance-section calendar-agenda">
          <header className="governance-section-heading">
            <div>
              <p className="eyebrow">Agenda</p>
              <h2 className="section-title">
                {selected
                  ? schoolTime(`${selected}T00:00:00+07:00`, true)
                  : "Bulan ini"}
              </h2>
            </div>
            {selected && (
              <Button
                variant="ghost"
                size="compact"
                onClick={() => setSelected("")}
              >
                Semua
              </Button>
            )}
          </header>
          {visible.length === 0 ? (
            <p className="governance-empty">
              Tidak ada agenda pada pilihan ini.
            </p>
          ) : (
            visible.map((event) => (
              <article
                className="calendar-agenda-item"
                key={`${event.category}-${event.id}`}
              >
                <GovernanceBadge value={event.category} />
                <h3>{event.title}</h3>
                <p>
                  {schoolTime(event.starts_at)} – {schoolTime(event.ends_at)}{" "}
                  WIB
                </p>
                {event.description && (
                  <p className="calendar-description">{event.description}</p>
                )}
                {event.category !== "exam" && (
                  <div className="calendar-item-actions">
                    <ActionButton
                      icon={Pencil}
                      label={`Sunting ${event.title}`}
                      onClick={() => setEditor(event)}
                    />
                    <ActionButton
                      icon={Archive}
                      label={`Arsipkan ${event.title}`}
                      onClick={() => {
                        archive.reset();
                        setArchiving(event);
                      }}
                    />
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      </div>
      <ConfirmationDialog
        open={Boolean(archiving)}
        onOpenChange={(open) => {
          if (!open) setArchiving(null);
        }}
        title="Arsipkan agenda?"
        description={archiving?.title ?? ""}
        confirmLabel="Arsipkan agenda"
        pending={archive.isPending}
        onConfirm={() => {
          if (archiving)
            archive.mutate(
              { id: archiving.id, version: archiving.version },
              { onSuccess: () => setArchiving(null) },
            );
        }}
      >
        <MutationFeedback mutation={archive} />
      </ConfirmationDialog>
    </div>
  );
}
