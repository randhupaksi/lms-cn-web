import { RoleBoundary } from "@/components/role-boundary";
import { RequestsWorkspace } from "@/features/governance";
export default function Page() {
  return (
    <RoleBoundary allow={["superadmin", "principal", "admin", "teacher"]}>
      <RequestsWorkspace />
    </RoleBoundary>
  );
}
