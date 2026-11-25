"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useAgenda } from "../use-governance";
import { GovernanceBadge, QueryState, schoolTime } from "./governance-shared";
import { CalendarWorkspaceSkeleton } from "./governance-skeletons";

const schoolDay = (value: string) =>
  new Date(new Date(value).getTime() + 7 * 3_600_000)
    .toISOString()
    .slice(0, 10);
const today = () => schoolDay(new Date().toISOString());

export function CalendarWorkspace() {
  const [month, setMonth] = useState(() => today().slice(0, 7));
  const [selected, setSelected] = useState("");
  const first = new Date(`${month}-01T00:00:00Z`);
  const offset = (first.getUTCDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, index) =>
    new Date(
      Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), index - offset + 1),
    )
      .toISOString()
      .slice(0, 10),
  );
  const end = new Date(`${days[41]}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const query = useAgenda(days[0], end.toISOString().slice(0, 10));
  const exams = query.data ?? [];
  const visible = exams.filter((exam) =>
    selected
      ? schoolDay(exam.starts_at) <= selected &&
        schoolDay(new Date(new Date(exam.ends_at).getTime() - 1).toISOString()) >=
          selected
      : schoolDay(exam.starts_at).slice(0, 7) === month ||
        (schoolDay(exam.starts_at) < `${month}-01` &&
          schoolDay(exam.ends_at) >= `${month}-01`),
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
        eyebrow="Akademik · Jadwal"
        title="Kalender ujian"
        description="Lihat jadwal ujian yang telah dipublikasikan dalam satu kalender."
      />
      <QueryState query={query} skeleton={<CalendarWorkspaceSkeleton />} />
      {query.isLoading ? null : (
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
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                (day) => (
                  <span key={day}>{day}</span>
                ),
              )}
            </div>
            <div className="school-calendar-grid">
              {days.map((day) => {
                const count = exams.filter(
                  (exam) =>
                    schoolDay(exam.starts_at) <= day &&
                    schoolDay(
                      new Date(new Date(exam.ends_at).getTime() - 1).toISOString(),
                    ) >= day,
                ).length;
                return (
                  <button
                    key={day}
                    className={`${day.slice(0, 7) !== month ? "outside-month" : ""} ${day === today() ? "is-today" : ""} ${day === selected ? "is-selected" : ""}`}
                    aria-label={`${schoolTime(`${day}T00:00:00+07:00`, true)}, ${count} ujian`}
                    aria-pressed={selected === day}
                    onClick={() => setSelected(day)}
                  >
                    <span>{Number(day.slice(8))}</span>
                    {count > 0 && (
                      <small>
                        {count}
                        <span className="calendar-agenda-word"> ujian</span>
                      </small>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="calendar-key">
              Waktu ditampilkan dalam WIB. Pilih tanggal untuk melihat ujian.
            </p>
          </section>
          <section className="governance-section calendar-agenda">
            <header className="governance-section-heading">
              <div>
                <p className="eyebrow">Jadwal</p>
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
            {query.isError ? null : visible.length === 0 ? (
              <p className="governance-empty">
                Tidak ada ujian pada tanggal yang dipilih.
              </p>
            ) : (
              visible.map((exam) => (
                <article
                  className="calendar-agenda-item"
                  key={`${exam.category}-${exam.id}`}
                >
                  <GovernanceBadge value="exam" />
                  <h3>{exam.title}</h3>
                  <p>
                    {schoolTime(exam.starts_at)} – {schoolTime(exam.ends_at)} WIB
                  </p>
                </article>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}
