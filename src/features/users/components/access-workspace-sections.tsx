import { useState, type FormEvent } from "react";
import { Monitor } from "lucide-react";
import type { User, UserRole } from "@/types/api";
import { Button } from "@/components/ui/button";
import { RadixSelectField } from "@/components/ui/radix-select";
import { AsyncFeedback } from "@/components/async-feedback";
import { ErrorState } from "@/components/data-state";
import {
  useCreateUser,
  useUpdateManagedUser,
  useUserSessions,
} from "../use-users";
export const labels: Record<UserRole, string> = {
  superadmin: "Superadmin",
  admin: "Administrator",
  teacher: "Guru",
  student: "Siswa",
};
const when = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
export function Feedback({
  mutation,
  success = "Perubahan berhasil disimpan.",
}: {
  mutation: { error: unknown; isError: boolean; isSuccess: boolean };
  success?: string;
}) {
  return (
    <AsyncFeedback
      {...mutation}
      errorMessage="Perubahan belum dapat disimpan."
      successMessage={success}
    />
  );
}

export function CreateManagedUser({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const mutation = useCreateUser();
  const [form, setForm] = useState({
    identifier: "",
    full_name: "",
    role: "admin" as "admin" | "teacher" | "student",
    temporary_password: "",
  });
  function submit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate(form, { onSuccess: onCreated });
  }
  return (
    <section className="governance-section">
      <header className="governance-section-heading">
        <div>
          <p className="eyebrow">Akun sekolah</p>
          <h2 className="section-title">Buat akses baru</h2>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Tutup
        </Button>
      </header>
      <form className="governance-form-grid p-6" onSubmit={submit}>
        <label className="field-label">
          Nama lengkap
          <input
            className="field-input"
            value={form.full_name}
            minLength={2}
            maxLength={160}
            required
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </label>
        <label className="field-label">
          NIS, NIP, atau username
          <input
            className="field-input"
            value={form.identifier}
            minLength={3}
            maxLength={64}
            required
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          />
        </label>
        <label className="field-label">
          Peran
          <RadixSelectField
            placeholder="Pilih opsi"
            value={form.role}
            onValueChange={(value) =>
              setForm({ ...form, role: value as typeof form.role })
            }
            options={["admin", "teacher", "student"].map((role) => ({
              value: role,
              label: labels[role as UserRole],
            }))}
          />
        </label>
        <label className="field-label">
          Kata sandi sementara
          <input
            className="field-input"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            value={form.temporary_password}
            required
            onChange={(e) =>
              setForm({ ...form, temporary_password: e.target.value })
            }
          />
        </label>
        <div className="governance-form-wide">
          <p className="text-sm text-muted mb-4">
            Pengguna wajib mengganti kata sandi saat masuk. Pemberian peran
            superadmin dilakukan melalui tindakan perubahan peran dengan
            konfirmasi kata sandi Anda.
          </p>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Membuat akun…" : "Buat akun"}
          </Button>
          <Feedback mutation={mutation} />
        </div>
      </form>
    </section>
  );
}
export function UserInspector({ user }: { user: User }) {
  const [name, setName] = useState(user.full_name);
  const [identifier, setIdentifier] = useState(user.identifier);
  const update = useUpdateManagedUser();
  const sessions = useUserSessions(user.id);
  function submit(e: FormEvent) {
    e.preventDefault();
    update.mutate({ id: user.id, identifier, full_name: name });
  }
  return (
    <aside className="governance-section access-inspector">
      <header className="governance-section-heading">
        <div>
          <p className="eyebrow">Rincian pengguna</p>
          <h2 className="section-title">{user.full_name}</h2>
        </div>
      </header>
      <form className="p-6 space-y-4" onSubmit={submit}>
        <label className="field-label">
          Nama lengkap
          <input
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={160}
            required
          />
        </label>
        <label className="field-label">
          Identitas masuk
          <input
            className="field-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            minLength={3}
            maxLength={64}
            required
          />
        </label>
        <Button type="submit" variant="secondary" disabled={update.isPending}>
          Simpan identitas
        </Button>
        <Feedback mutation={update} />
      </form>
      <div className="access-sessions">
        <h3>
          <Monitor size={17} aria-hidden="true" />
          Sesi aktif
        </h3>
        {sessions.isLoading && (
          <p className="text-sm text-muted">Memuat sesi…</p>
        )}
        {sessions.isError && (
          <ErrorState
            label="Sesi belum dapat dimuat."
            onRetry={() => void sessions.refetch()}
          />
        )}{" "}
        {sessions.data?.length === 0 && (
          <p className="text-sm text-muted">Tidak ada sesi aktif.</p>
        )}
        {sessions.data?.map((session, index) => (
          <div className="session-record" key={session.id}>
            <strong>Sesi {index + 1}</strong>
            <p>Dibuat {when(session.created_at)} WIB</p>
            <p>Pembaruan sesi {when(session.last_used_at)} WIB</p>
            <small>Berakhir {when(session.expires_at)} WIB</small>
          </div>
        ))}
      </div>
    </aside>
  );
}
