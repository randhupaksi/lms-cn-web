import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { ReadinessWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Kesiapan ujian · Superadmin" };

export default function Page() {
  return (
    <RoleBoundary allow={["superadmin"]}>
      <ReadinessWorkspace />
    </RoleBoundary>
  );
}
