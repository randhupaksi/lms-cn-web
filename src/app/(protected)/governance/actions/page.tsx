import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { LeadershipActions } from "@/features/governance/components/leadership-actions";

export const metadata: Metadata = { title: "Tindak lanjut" };

export default function Page() {
  return (
    <RoleBoundary allow={["superadmin", "principal", "curriculum", "admin", "teacher"]}>
      <LeadershipActions />
    </RoleBoundary>
  );
}
