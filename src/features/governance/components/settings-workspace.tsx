"use client";
import { useState, type FormEvent } from "react";
import { History, School, Save, RefreshCw } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import type { SchoolSettings } from "@/services/governance.service";
import {
  useSaveSchoolSettings,
  useSchoolSettings,
  useSettingHistory,
} from "../use-governance";
import {
  GovernanceSection,
  MutationFeedback,
  QueryState,
  schoolTime,
} from "./governance-shared";

function SettingsForm({
  initial,
  onSaved,
}: {
  initial: SchoolSettings;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [reason, setReason] = useState("");
  const save = useSaveSchoolSettings();
  function submit(event: FormEvent) {
    event.preventDefault();
    const { updated_at, ...settings } = form;
    void updated_at;
    save.mutate({ ...settings, reason }, { onSuccess: onSaved });
  }
  return (
    <form onSubmit={submit} className="settings-layout">
      <section className="governance-section">
        <header className="governance-section-heading">
          <div>
            <p className="eyebrow">Identitas & layanan</p>
            <h2 className="section-title">Profil sekolah</h2>
          </div>
          <School size={22} aria-hidden="true" />
        </header>
        <div className="governance-form-grid p-6">
          <label className="field-label governance-form-wide">
            Nama sekolah
            <input
              className="field-input"
              value={form.school_name}
              minLength={2}
              maxLength={160}
              onChange={(e) =>
                setForm({ ...form, school_name: e.target.value })
              }
              required
            />
          </label>
          <label className="field-label governance-form-wide">
            Motto
            <input
              className="field-input"
              value={form.motto}
              maxLength={255}
              onChange={(e) => setForm({ ...form, motto: e.target.value })}
            />
          </label>
          <label className="field-label">
            Email bantuan
            <input
              className="field-input"
              type="email"
              value={form.contact_email}
              maxLength={160}
              onChange={(e) =>
                setForm({ ...form, contact_email: e.target.value })
              }
            />
          </label>
          <label className="field-label">
            Referensi ketuntasan (%)
            <input
              className="field-input"
              type="number"
              value={form.passing_reference}
              min={0}
              max={100}
              step="0.01"
              onChange={(e) =>
                setForm({ ...form, passing_reference: Number(e.target.value) })
              }
              required
            />
          </label>
          <label className="field-label governance-form-wide">
            Pesan bantuan akses
            <textarea
              className="field-input"
              value={form.support_message}
              rows={3}
              maxLength={1000}
              onChange={(e) =>
                setForm({ ...form, support_message: e.target.value })
              }
            />
          </label>
          <label className="field-label governance-form-wide">
            Alasan perubahan
            <textarea
              className="field-input"
              value={reason}
              rows={2}
              minLength={10}
              maxLength={500}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Catat tujuan perubahan untuk riwayat sekolah."
              required
            />
          </label>
          <div className="governance-form-wide">
            <Button type="submit" disabled={save.isPending}>
              <Save size={17} aria-hidden="true" />
              {save.isPending ? "Menyimpan…" : "Simpan pengaturan"}
            </Button>
            <MutationFeedback mutation={save} />
          </div>
        </div>
      </section>
      <aside className="settings-aside">
        <p className="eyebrow">Pratinjau identitas</p>
        <h2>{form.school_name}</h2>
        <p>{form.motto || "Motto sekolah belum diisi."}</p>
        <hr />
        <h3>Bantuan akses</h3>
        <p>{form.support_message || "Pesan bantuan belum diisi."}</p>
        {form.contact_email && <p>{form.contact_email}</p>}
        <hr />
        <dl>
          <div>
            <dt>Zona waktu</dt>
            <dd>Asia/Jakarta · WIB</dd>
          </div>
          <div>
            <dt>Referensi ketuntasan</dt>
            <dd>{form.passing_reference}%</dd>
          </div>
          <div>
            <dt>Versi pengaturan</dt>
            <dd>{initial.version}</dd>
          </div>
        </dl>
        <p className="text-xs">
          Referensi ketuntasan dipakai untuk membaca laporan. Perubahan
          pengaturan tidak menghitung ulang nilai atau mengubah ujian yang sudah
          dibuat.
        </p>
      </aside>
    </form>
  );
}
export function SettingsWorkspace() {
  const [saved, setSaved] = useState(false);
  const query = useSchoolSettings();
  const history = useSettingHistory();
  return (
    <div className="governance-workspace">
      <PageHeader
        eyebrow="Pengaturan sekolah"
        title="Identitas yang terjaga, perubahan yang tercatat"
        description="Kelola profil dan informasi bantuan sekolah. Setiap penyimpanan membentuk versi baru."
        actions={
          <ActionButton
            icon={RefreshCw}
            label="Muat ulang pengaturan sekolah"
            pending={query.isFetching}
            onClick={() => void query.refetch()}
          />
        }
      />
      <QueryState query={query} />
      {saved && (
        <p className="feedback-message feedback-message-success" role="status">
          Pengaturan berhasil disimpan. Profil sekolah dan laporan memakai versi
          terbaru.
        </p>
      )}
      {query.data && (
        <SettingsForm
          key={query.data.version}
          initial={query.data}
          onSaved={() => setSaved(true)}
        />
      )}
      <GovernanceSection
        eyebrow="Jejak perubahan"
        title="Riwayat pengaturan"
        action={<History size={20} aria-hidden="true" />}
      >
        <QueryState query={history} />
        {history.data?.length === 0 && (
          <p className="governance-empty">
            Belum ada perubahan sejak konfigurasi awal.
          </p>
        )}
        <div className="settings-history">
          {history.data?.map((change) => (
            <details key={change.id}>
              <summary>
                <span className="settings-history-version">
                  v{change.version}
                </span>
                <div>
                  <strong>{change.reason}</strong>
                  <p>
                    {change.actor_name} · {schoolTime(change.created_at)} WIB
                  </p>
                </div>
              </summary>
              <dl className="settings-history-snapshot">
                <div>
                  <dt>Nama sekolah</dt>
                  <dd>{change.snapshot.school_name}</dd>
                </div>
                <div>
                  <dt>Motto</dt>
                  <dd>{change.snapshot.motto || "—"}</dd>
                </div>
                <div>
                  <dt>Email bantuan</dt>
                  <dd>{change.snapshot.contact_email || "—"}</dd>
                </div>
                <div>
                  <dt>Referensi ketuntasan</dt>
                  <dd>{change.snapshot.passing_reference}%</dd>
                </div>
                <div>
                  <dt>Pesan bantuan</dt>
                  <dd>{change.snapshot.support_message || "—"}</dd>
                </div>
              </dl>
            </details>
          ))}
        </div>
      </GovernanceSection>
    </div>
  );
}
