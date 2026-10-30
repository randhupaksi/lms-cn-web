import { RoleBoundary } from "@/components/role-boundary";
import { LeadershipActions } from "@/features/governance/components/leadership-actions";
export default function Page() {
  return (
    <RoleBoundary allow={["superadmin", "principal", "admin", "teacher"]}>
      <LeadershipActions />
    </RoleBoundary>
  );
}
