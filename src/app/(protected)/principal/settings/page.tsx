import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { SettingsWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Pengaturan sekolah · Kepala sekolah" };

export default function Page() {
  return (
    <RoleBoundary allow={["principal"]}>
      <SettingsWorkspace />
    </RoleBoundary>
  );
}
