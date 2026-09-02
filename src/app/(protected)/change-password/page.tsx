"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { clearAccessToken } from "@/lib/auth-session";
import { changePassword } from "@/services/auth.service";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmation)
      return setError("Konfirmasi kata sandi belum sama.");
    setError(undefined);
    setLoading(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      clearAccessToken();
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
    <section className="mx-auto max-w-lg panel">
      <p className="eyebrow">ACCOUNT SECURITY</p>
      <h1 className="page-title">Perbarui kata sandi</h1>
      <p className="page-description">
        Credential sementara harus diganti sebelum akun dapat menggunakan fitur
        LMS.
      </p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <label className="field-label">
          Kata sandi saat ini
          <input
            className="field-input"
            type="password"
            autoComplete="current-password"
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
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
        </label>
        <label className="field-label">
          Ulangi kata sandi baru
          <input
            className="field-input"
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            required
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button-primary w-full" disabled={loading}>
          {loading ? "Memperbarui…" : "Perbarui kata sandi"}
        </button>
      </form>
    </section>
  );
}
