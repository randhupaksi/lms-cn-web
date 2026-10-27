"use client";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Database,
  RefreshCw,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { ActionButton } from "@/components/ui/action-button";
import { useGovernanceOverview } from "../use-governance";
import {
  GovernanceBadge,
  GovernanceSection,
  QueryState,
  roleLabels,
  schoolTime,
  stateLabels,
  WorkspaceLink,
} from "./governance-shared";

export function ControlCenter() {
  const query = useGovernanceOverview();
  const { user } = useAuth();
  const data = query.data;
  const active = data?.roles.reduce((n, r) => n + r.active, 0) ?? 0;
  const findings = data?.quality.reduce((n, g) => n + g.count, 0) ?? 0;
  const totalExams = data?.exam_states.reduce((n, s) => n + s.count, 0) ?? 0;
  return (
    <div className="governance-workspace">
      <header className="command-heading">
        <div>
          <p className="eyebrow">Citra Negara · Pusat kendali</p>
          <h1>Tata kelola sekolah</h1>
          <p>
            Selamat datang, {user?.full_name}. Lihat kesiapan sekolah dan
            tentukan langkah berikutnya.
          </p>
        </div>
        <div className="command-heading-meta">
          <span className="governance-command-tag">
            <ShieldCheck size={15} aria-hidden="true" />
            Superadmin Sekolah
          </span>
          <ActionButton
            icon={RefreshCw}
            label="Perbarui pusat kendali"
            pending={query.isFetching}
            onClick={() => void query.refetch()}
          />
        </div>
      </header>
      <QueryState query={query} />
      {data && (
        <>
          <div className="command-metrics">
            {[
              {
                label: "Pengguna aktif",
                value: active,
                detail: `${data.roles.reduce((n, r) => n + r.inactive, 0)} akun nonaktif`,
                Icon: UsersRound,
              },
              {
                label: "Course aktif",
                value: data.courses,
                detail: `${data.classes} kelas terdaftar`,
                Icon: Database,
              },
              {
                label: "Sesi ujian berjalan",
                value: data.active_attempts,
                detail: "Sesi pengerjaan yang belum selesai",
                Icon: Activity,
              },
              {
                label: "Menunggu keputusan",
                value: data.pending_requests,
                detail: "Pengajuan perubahan jadwal",
                Icon: ClipboardCheck,
              },
            ].map(({ label, value, detail, Icon }) => (
              <div key={label} className="command-metric">
                <span>
                  {label}
                  <Icon size={17} aria-hidden="true" />
                </span>
                <strong>{value}</strong>
                <small>{detail}</small>
              </div>
            ))}
          </div>
          <div className="command-main-grid">
            <GovernanceSection
              eyebrow="Perlu perhatian"
              title="Mulai dari yang penting"
            >
              <Link href="/governance/requests" className="command-priority">
                <span className="command-priority-number">
                  {data.pending_requests}
                </span>
                <div>
                  <h3>Pengajuan jadwal</h3>
                  <p>
                    Tinjau alasan, bandingkan waktu, lalu berikan keputusan.
                  </p>
                </div>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <Link href="/superadmin/quality" className="command-priority">
                <span className="command-priority-number">{findings}</span>
                <div>
                  <h3>Temuan kualitas data</h3>
                  <p>
                    Periksa kelengkapan penugasan, peserta, dan persiapan ujian.
                  </p>
                </div>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <div className="command-footnote">
                <span>{data.draft_results} hasil belum dipublikasikan</span>
                <WorkspaceLink href="/teacher/results">
                  Tinjau hasil
                </WorkspaceLink>
              </div>
            </GovernanceSection>
            <GovernanceSection
              eyebrow="Lingkup sekolah"
              title="Komposisi akses"
              action={
                <WorkspaceLink href="/superadmin/users">
                  Kelola akses
                </WorkspaceLink>
              }
            >
              <div className="role-ledger">
                {["superadmin", "admin", "teacher", "student"].map((role) => {
                  const row = data.roles.find((r) => r.role === role);
                  const value = row?.active ?? 0;
                  return (
                    <div className="role-ledger-row" key={role}>
                      <div>
                        <span>{roleLabels[role]}</span>
                        <small>{row?.inactive ?? 0} nonaktif</small>
                      </div>
                      <div className="role-ledger-track" aria-hidden="true">
                        <span
                          style={{
                            width: `${active ? (value / active) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <strong>{value}</strong>
                    </div>
                  );
                })}
              </div>
            </GovernanceSection>
          </div>
          <GovernanceSection
            eyebrow="Pelaksanaan asesmen"
            title="Siklus ujian sekolah"
            action={
              <WorkspaceLink href="/superadmin/exams">
                Periksa kesiapan
              </WorkspaceLink>
            }
          >
            <div className="exam-cycle-bar" aria-hidden="true">
              {["draft", "scheduled", "running", "ended"].map((key) => {
                const count =
                  data.exam_states.find((s) => s.key === key)?.count ?? 0;
                return count > 0 ? (
                  <span
                    className={`cycle-${key}`}
                    key={key}
                    style={{ width: `${(count / totalExams) * 100}%` }}
                  />
                ) : null;
              })}
            </div>
            <dl className="exam-cycle-legend">
              {["draft", "scheduled", "running", "ended"].map((key) => (
                <div key={key}>
                  <dt>
                    <span className={`cycle-dot cycle-${key}`} />
                    {stateLabels[key]}
                  </dt>
                  <dd>
                    {data.exam_states.find((s) => s.key === key)?.count ?? 0}
                  </dd>
                </div>
              ))}
            </dl>
          </GovernanceSection>
          <div className="command-main-grid">
            <GovernanceSection
              eyebrow="Berikutnya"
              title="Ujian mendatang"
              action={
                <WorkspaceLink href="/superadmin/exams">
                  Semua ujian
                </WorkspaceLink>
              }
            >
              {data.exams.length === 0 ? (
                <p className="governance-empty">
                  Belum ada ujian mendatang atau berlangsung.
                </p>
              ) : (
                <div className="command-exam-list">
                  {data.exams.slice(0, 6).map((exam) => (
                    <div key={exam.id}>
                      <div>
                        <h3>{exam.title}</h3>
                        <p>
                          {exam.class_name} · {exam.course_name}
                        </p>
                        <small>{schoolTime(exam.starts_at)} WIB</small>
                      </div>
                      <GovernanceBadge value={exam.lifecycle} />
                    </div>
                  ))}
                </div>
              )}
            </GovernanceSection>
            <GovernanceSection
              eyebrow="30 hari ke depan"
              title="Agenda sekolah"
              action={
                <WorkspaceLink href="/superadmin/calendar">
                  Buka kalender
                </WorkspaceLink>
              }
            >
              {data.agenda.length === 0 ? (
                <p className="governance-empty">
                  Belum ada agenda pada rentang ini.
                </p>
              ) : (
                <div className="command-agenda">
                  {data.agenda.slice(0, 5).map((event) => (
                    <div key={`${event.category}-${event.id}`}>
                      <span className="agenda-date">
                        <CalendarDays size={17} aria-hidden="true" />
                        {schoolTime(event.starts_at, true)}
                      </span>
                      <div>
                        <h3>{event.title}</h3>
                        <p>
                          {stateLabels[event.category] ?? event.category} ·{" "}
                          {schoolTime(event.starts_at)} WIB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GovernanceSection>
          </div>
          <p className="governance-update">
            Diperbarui {schoolTime(data.generated_at)} WIB · Lingkup seluruh
            sekolah
          </p>
        </>
      )}
    </div>
  );
}
