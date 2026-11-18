import type { Metadata } from "next";
import { LoginWorkspace } from "@/features/auth/components/login-workspace";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return <LoginWorkspace />;
}
