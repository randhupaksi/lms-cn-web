import type { Metadata } from "next";
import { RoleBoundary } from "@/components/role-boundary";
import { RequestsWorkspace } from "@/features/governance";

export const metadata: Metadata = { title: "Permintaan jadwal" };

export default function Page() {
  return (
    <RoleBoundary allow={["superadmin", "principal", "curriculum", "admin", "teacher"]}>
      <RequestsWorkspace />
    </RoleBoundary>
  );
}
