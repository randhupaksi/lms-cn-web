import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { SettingsWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Pengaturan sekolah · Superadmin" };

export default function Page() {
  return (
    <RoleBoundary allow={["superadmin"]}>
      <SettingsWorkspace />
    </RoleBoundary>
  );
}
