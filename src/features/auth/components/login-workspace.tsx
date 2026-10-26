"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpenCheck,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

const benefits = [
  { icon: BookOpenCheck, label: "Materi dan tugas dalam satu ruang belajar" },
  { icon: GraduationCap, label: "Ujian terstruktur dengan sesi terlindungi" },
  { icon: ShieldCheck, label: "Akses disesuaikan dengan peran pengguna" },
];

export function LoginWorkspace() {
  const router = useRouter();
  const { login, sessionMessage } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="login-canvas">
      <section
        className="login-brand-panel"
        aria-label="Tentang Citra Negara LMS"
      >
        <div className="login-brand-content">
          <div className="flex items-center gap-4">
            <span className="workspace-brand-mark">
              <GraduationCap aria-hidden="true" size={24} />
            </span>
            <div>
              <p className="text-base font-semibold">Citra Negara</p>
              <p className="login-brand-caption mt-1">
                Learning Management System
              </p>
            </div>
          </div>
          <div className="login-brand-statement">
            <p className="login-brand-caption mb-5">RUANG AKADEMIK DIGITAL</p>
            <h2 className="login-brand-title">
              Tempat belajar.
              <br />
              Ruang bertumbuh.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 opacity-90">
              Materi, tugas, dan evaluasi yang terhubung untuk mendampingi
              proses belajar di Citra Negara.
            </p>
            <div className="mt-10">
              {benefits.map(({ icon: Icon, label }) => (
                <div key={label} className="login-benefit">
                  <Icon aria-hidden="true" size={19} />
                  <p className="text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="login-brand-caption">
            Portal resmi pembelajaran Citra Negara
          </p>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="workspace-user-avatar size-12">CN</span>
            <div>
              <p className="text-sm font-bold text-foreground">
                Citra Negara LMS
              </p>
              <p className="text-xs text-muted">Portal akademik sekolah</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="eyebrow">
              <ShieldCheck size={14} /> Akses akun
            </p>
            <h1 className="page-title mt-3">Selamat datang</h1>
            <p className="page-description mt-2">
              Masukkan NIS, NIP, atau username yang telah terdaftar.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="field-label">
              Identitas
              <input
                className="field-input"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="NIS, NIP, atau username"
                autoComplete="username"
                required
              />
            </label>

            <label className="field-label">
              Kata sandi
              <span className="relative block">
                <input
                  className="field-input pr-12"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan kata sandi akun Anda"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-1 my-auto grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-primary-soft hover:text-primary"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {error || sessionMessage ? (
              <div
                className="flex items-start gap-3 rounded-2xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger"
                role="alert"
              >
                <LockKeyhole className="mt-0.5 shrink-0" size={17} />
                <p>{error ?? sessionMessage}</p>
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn size={17} /> {loading ? "Memverifikasi…" : "Masuk ke LMS"}
            </Button>
          </form>
          <p className="login-help">
            Belum memiliki akun atau mengalami kendala masuk? Hubungi
            administrator sekolah untuk bantuan akses.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-5 text-xs text-muted">
            <LockKeyhole size={14} /> Gunakan akun yang diberikan sekolah.
          </div>
        </div>
      </section>
    </main>
  );
}
