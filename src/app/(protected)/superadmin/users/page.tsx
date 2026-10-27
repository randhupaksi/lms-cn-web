import { RoleBoundary } from "@/components/role-boundary";
import { AccessWorkspace } from "@/features/users/components/access-workspace";
export default function Page() {
  return (
    <RoleBoundary allow={["superadmin"]}>
      <AccessWorkspace />
    </RoleBoundary>
  );
}
