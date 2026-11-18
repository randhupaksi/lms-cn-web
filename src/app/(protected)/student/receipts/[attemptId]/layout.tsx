import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Bukti pengumpulan · Siswa" };

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
