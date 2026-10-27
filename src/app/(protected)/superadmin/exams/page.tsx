import { RoleBoundary } from "@/components/role-boundary";
import { ReadinessWorkspace } from "@/features/governance";
export default function Page() {
  return (
    <RoleBoundary allow={["superadmin"]}>
      <ReadinessWorkspace />
    </RoleBoundary>
  );
}
