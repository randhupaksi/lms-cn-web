import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Citra Negara LMS",
    template: "%s | Citra Negara LMS",
  },
  description: "Digital learning and assessment platform for Citra Negara.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
