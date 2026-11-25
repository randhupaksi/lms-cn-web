"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormDialog } from "@/components/ui/form-dialog";
import { Button } from "@/components/ui/button";
import { invalidateSession } from "@/lib/auth-session";
import { changePassword } from "@/services/auth.service";
import { KeyRound } from "lucide-react";

export function ChangePasswordDialog({
  required,
  onClose,
}: {
  required: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string>();
  const [confirmationInvalid, setConfirmationInvalid] = useState(false);
  const confirmationInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
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
    <FormDialog
      id="change-password-dialog"
      icon={KeyRound}
      eyebrow="Keamanan akun"
      title="Perbarui kata sandi"
      description={
        required
          ? "Kata sandi sementara wajib diperbarui sebelum melanjutkan penggunaan LMS."
          : "Gunakan kata sandi pribadi yang berbeda dari akun lain."
      }
      onClose={onClose}
      dismissible={!required && !loading}
      footer={
        <>
          {!required ? (
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
          ) : null}
          <Button
            type="submit"
            form="change-password-form"
            disabled={loading}
          >
            {loading ? "Memperbarui…" : "Perbarui kata sandi"}
          </Button>
        </>
      }
    >
      <form
        id="change-password-form"
        className="space-y-4"
        onSubmit={submit}
      >
        <label className="field-label">
          Kata sandi saat ini
          <input
            className="field-input"
            type="password"
            autoComplete="current-password"
            placeholder="Masukkan kata sandi saat ini"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            disabled={loading}
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
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
              disabled={loading}
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
              aria-describedby={
                confirmationInvalid ? "confirmation-error" : undefined
              }
              onChange={(event) => {
                setConfirmation(event.target.value);
                setConfirmationInvalid(false);
              }}
              disabled={loading}
              required
            />
          </label>
        </div>
        {confirmationInvalid ? (
          <p id="confirmation-error" className="form-error" role="alert">
            Konfirmasi kata sandi belum sama.
          </p>
        ) : null}
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </FormDialog>
  );
}
