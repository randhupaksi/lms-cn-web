"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <section className="panel w-full max-w-lg text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger-soft text-danger">
          <AlertTriangle size={24} />
        </span>
        <p className="eyebrow mt-5">Gangguan sistem</p>
        <h1 className="page-title text-2xl">Halaman belum dapat ditampilkan</h1>
        <p className="page-description mx-auto">
          Terjadi kendala saat menyiapkan halaman. Data Anda tetap aman dan Anda dapat mencoba kembali.
        </p>
        <Button className="mt-6" onClick={reset}>Coba lagi</Button>
      </section>
    </main>
  );
}
