import { useState, type FormEvent } from "react";
import { Monitor, UserRoundPlus } from "lucide-react";
import type { User, UserRole } from "@/types/api";
import { Button } from "@/components/ui/button";
import { RadixSelectField } from "@/components/ui/radix-select";
import { FormDialog } from "@/components/ui/form-dialog";
import { AsyncFeedback } from "@/components/async-feedback";
import { ErrorState } from "@/components/data-state";
import { SessionRowsSkeleton } from "@/components/ui/skeleton-patterns";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import {
  useCreateUser,
  useUpdateManagedUser,
  useUserSessions,
} from "../use-users";
export const labels: Record<UserRole, string> = {
  superadmin: "Superadmin",
  principal: "Kepala Sekolah",
  curriculum: "Guru Kurikulum",
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
  showSuccess = true,
}: {
  mutation: { error: unknown; isError: boolean; isSuccess: boolean };
  success?: string;
  showSuccess?: boolean;
}) {
  return (
    <AsyncFeedback
      {...mutation}
      isSuccess={showSuccess && mutation.isSuccess}
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
  const { success: notifySuccess } = useToast();
  const actorRole = useAuth().user?.role;
  const isSuperadmin = actorRole === "superadmin";
  const canCreateCurriculum = isSuperadmin || actorRole === "principal";
  const [form, setForm] = useState({
    identifier: "",
    full_name: "",
    role: "admin" as "principal" | "curriculum" | "admin" | "teacher" | "student",
    temporary_password: "",
  });
  function submit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate(form, {
      onSuccess: () => {
        notifySuccess("Akun sekolah berhasil dibuat.");
        onCreated();
      },
    });
  }
  return (
    <FormDialog
      id="managed-user-form"
      icon={UserRoundPlus}
      eyebrow="Akun sekolah"
      title="Buat akses baru"
      description="Buat akun sekolah dengan peran dan kata sandi sementara."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            form="managed-user-fields"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Membuat akun…" : "Buat akun"}
          </Button>
        </>
      }
    >
      <form
        id="managed-user-fields"
        className="governance-form-grid"
        onSubmit={submit}
      >
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
            options={[
              ...(isSuperadmin ? ["principal"] : []),
              ...(canCreateCurriculum ? ["curriculum"] : []),
              "admin",
              "teacher",
              "student",
            ].map((role) => ({
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
          <Feedback mutation={mutation} showSuccess={false} />
        </div>
      </form>
    </FormDialog>
  );
}
export function UserInspector({
  user,
  showSessions = true,
}: {
  user: User;
  showSessions?: boolean;
}) {
  const [name, setName] = useState(user.full_name);
  const [identifier, setIdentifier] = useState(user.identifier);
  const update = useUpdateManagedUser();
  const sessions = useUserSessions(user.id, showSessions);
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
      {showSessions && (
        <div className="access-sessions">
          <h3>
            <Monitor size={17} aria-hidden="true" />
            Sesi aktif
          </h3>
          {sessions.isLoading && <SessionRowsSkeleton />}
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
      )}
    </aside>
  );
}
