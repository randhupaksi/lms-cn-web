"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { useAuth } from "@/providers/auth-provider";
import { useSchoolProfile } from "@/providers/school-provider";

const learningSteps = [
  {
    title: "Materi",
    description: "Buka materi dari course yang Anda akses.",
  },
  {
    title: "Tugas",
    description: "Periksa instruksi, tenggat, dan status pengumpulan.",
  },
  {
    title: "Evaluasi",
    description: "Ikuti ujian atau kelola evaluasi sesuai peran Anda.",
  },
];

export function LoginWorkspace() {
  const school = useSchoolProfile();
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
      await login({ identifier, password });
      router.replace("/dashboard");
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
              <BrandMark size={36} />
            </span>
            <div>
              <p className="text-base font-semibold">{school.school_name}</p>
              <p className="login-brand-caption mt-1">
                Portal pembelajaran dan ujian
              </p>
            </div>
          </div>
          <div className="login-brand-statement">
            <p className="login-brand-caption mb-5">PORTAL PEMBELAJARAN</p>
            <h2 className="login-brand-title">
              Materi, tugas, dan ujian dalam satu alur belajar
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 opacity-90">
              Masuk untuk membuka materi, meninjau tugas, atau mengelola
              evaluasi sesuai peran Anda.
            </p>
            <ol className="login-learning-path" aria-label="Alur pembelajaran">
              {learningSteps.map(({ title, description }, index) => (
                <li className="login-learning-step" key={title}>
                  <span className="login-learning-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <div className="login-mobile-brand mb-8 flex items-center gap-3 lg:hidden">
            <span className="workspace-user-avatar size-12" aria-hidden="true">
              <BrandMark size={32} />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">
                {school.school_name} LMS
              </p>
              <p className="text-xs text-muted">Portal akademik sekolah</p>
            </div>
          </div>

          <div className="login-form-intro">
            <div className="login-form-kicker">
              <span className="login-form-mark" aria-hidden="true">
                <BrandMark size={28} />
              </span>
              <p className="eyebrow">Akses akun</p>
            </div>
            <h1 className="login-form-title">Selamat Datang!</h1>
            <p className="login-form-description">
              Gunakan NIS, NIP, atau username yang telah terdaftar.
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

            <div className="field-label">
              <label htmlFor="login-password">Kata sandi</label>
              <span className="relative block">
                <input
                  id="login-password"
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
                  aria-controls="login-password"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
                </button>
              </span>
            </div>

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
          <div className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-5 text-xs text-muted">
            <LockKeyhole size={14} /> Gunakan akun yang diberikan sekolah.
          </div>
        </div>
      </section>
    </main>
  );
}
