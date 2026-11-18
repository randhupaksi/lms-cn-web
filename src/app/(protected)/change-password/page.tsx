import type { Metadata } from "next";
import { ChangePasswordWorkspace } from "@/features/auth/components/change-password-workspace";

export const metadata: Metadata = { title: "Perbarui kata sandi" };

export default function ChangePasswordPage() {
  return <ChangePasswordWorkspace />;
}
