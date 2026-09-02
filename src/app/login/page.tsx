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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
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
      router.replace(user.must_change_password ? "/change-password" : "/dashboard");
    } catch {
      setError("Identitas atau kata sandi tidak valid.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-canvas">
      <section className="login-brand-panel p-10 xl:p-16" aria-label="Tentang Citra Negara LMS">
        <div className="relative z-10 flex w-full max-w-xl flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="workspace-brand-mark size-16 text-base">CN</div>
            <div>
              <p className="text-lg font-bold">Citra Negara LMS</p>
              <p className="mt-1 text-sm text-white/70">Learning Management System</p>
            </div>
          </div>

          <div className="my-16">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/64">Portal akademik terpadu</p>
            <h1 className="mt-5 max-w-lg text-4xl font-bold leading-tight tracking-[-0.045em] xl:text-5xl">
              Belajar, mengajar, dan mengevaluasi dalam satu alur yang tenang.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/72">
              Ruang kerja resmi Citra Negara untuk membantu guru dan siswa menjalankan aktivitas pembelajaran secara terarah.
            </p>

            <div className="mt-9 space-y-3">
              {benefits.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5">
                  <span className="grid size-10 place-items-center rounded-xl bg-white/10">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <p className="text-sm font-semibold text-white/86">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/52">Sistem internal Sekolah Citra Negara</p>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="workspace-user-avatar size-12">CN</span>
            <div>
              <p className="text-sm font-bold text-foreground">Citra Negara LMS</p>
              <p className="text-xs text-muted">Portal akademik sekolah</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="eyebrow"><ShieldCheck size={14} /> Akses akun</p>
            <h1 className="page-title mt-3">Selamat datang kembali</h1>
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
                autoComplete="username"
                placeholder="NIS, NIP, atau username"
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
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-1 my-auto grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-primary-soft hover:text-primary"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
                <LockKeyhole className="mt-0.5 shrink-0" size={17} />
                <p>{error}</p>
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn size={17} /> {loading ? "Memverifikasi…" : "Masuk ke LMS"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-5 text-xs text-muted">
            <LockKeyhole size={14} /> Sesi dilindungi dan dikelola oleh server.
          </div>
        </div>
      </section>
    </main>
  );
}
