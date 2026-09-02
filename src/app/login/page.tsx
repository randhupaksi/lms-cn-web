"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login({ identifier, password });
      router.replace(
        user.must_change_password ? "/change-password" : "/dashboard",
      );
    } catch {
      setError("Identitas atau kata sandi tidak valid.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-surface px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-panel">
        <div className="mb-8">
          <p className="eyebrow">CITRA NEGARA LMS</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Masuk ke akun Anda
          </h1>
          <p className="mt-2 text-sm text-muted">
            Gunakan NIS, NIP, atau username yang terdaftar.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="field-label">
            Identitas
            <input
              className="field-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="field-label">
            Kata sandi
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && (
            <p
              className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger"
              role="alert"
            >
              {error}
            </p>
          )}
          <button className="button-primary w-full" disabled={loading}>
            {loading ? (
              "Memverifikasi…"
            ) : (
              <>
                <LogIn size={17} /> Masuk
              </>
            )}
          </button>
        </form>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted">
          <LockKeyhole size={14} /> Sesi dilindungi dan dikelola oleh server.
        </div>
      </section>
    </main>
  );
}
