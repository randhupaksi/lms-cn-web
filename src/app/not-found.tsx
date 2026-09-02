import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <section className="panel w-full max-w-lg text-center">
        <span className="metric-icon mx-auto size-14"><FileQuestion size={24} /></span>
        <p className="eyebrow mt-5">Error 404</p>
        <h1 className="page-title text-2xl">Halaman tidak ditemukan</h1>
        <p className="page-description mx-auto">
          Tautan mungkin sudah berubah atau halaman tersebut tidak tersedia untuk akun Anda.
        </p>
        <Link className="button-primary mt-6" href="/dashboard">Kembali ke dashboard</Link>
      </section>
    </main>
  );
}
