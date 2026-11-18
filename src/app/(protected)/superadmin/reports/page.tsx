import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { ReportsWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Laporan sekolah · Superadmin" };

export default function Page() {
  return (
    <RoleBoundary allow={["superadmin"]}>
      <ReportsWorkspace />
    </RoleBoundary>
  );
}
