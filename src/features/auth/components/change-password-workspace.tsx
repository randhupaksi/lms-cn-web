"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { invalidateSession } from "@/lib/auth-session";
import { changePassword } from "@/services/auth.service";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export function ChangePasswordWorkspace() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string>();
  const [confirmationInvalid, setConfirmationInvalid] = useState(false);
  const confirmationInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmation) {
      setError(undefined);
      setConfirmationInvalid(true);
      confirmationInput.current?.focus();
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      invalidateSession(
        "Kata sandi berhasil diperbarui. Silakan masuk kembali dengan kata sandi baru.",
      );
      router.replace("/login");
    } catch {
      setError(
        "Kata sandi belum dapat diperbarui. Periksa kata sandi saat ini.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        eyebrow="Akun · Kata sandi"
        title="Perbarui kata sandi"
        description="Gunakan kata sandi pribadi yang berbeda dari akun lain. Kata sandi sementara perlu diganti sebelum menggunakan LMS."
        icon={KeyRound}
      />
      <form className="panel space-y-4" onSubmit={submit}>
        <label className="field-label">
          Kata sandi saat ini
          <input
            className="field-input"
            type="password"
            autoComplete="current-password"
            placeholder="Masukkan kata sandi saat ini"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
        </label>
        <label className="field-label">
          Kata sandi baru
          <input
            className="field-input"
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="Gunakan minimal 8 karakter"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setConfirmationInvalid(false);
            }}
            required
          />
        </label>
        <label className="field-label">
          Ulangi kata sandi baru
          <input
            ref={confirmationInput}
            className="field-input"
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="Ketik ulang kata sandi baru"
            value={confirmation}
            aria-invalid={confirmationInvalid || undefined}
            aria-describedby={confirmationInvalid ? "confirmation-error" : undefined}
            onChange={(event) => {
              setConfirmation(event.target.value);
              setConfirmationInvalid(false);
            }}
            required
          />
        </label>
        {confirmationInvalid && (
          <p id="confirmation-error" className="form-error" role="alert">
            Konfirmasi kata sandi belum sama.
          </p>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Memperbarui…" : "Perbarui kata sandi"}
        </Button>
      </form>
    </div>
  );
}
