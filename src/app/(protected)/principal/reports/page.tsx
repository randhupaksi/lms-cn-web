import { RoleBoundary } from "@/components/role-boundary";
import { ReportsWorkspace } from "@/features/governance";
export default function Page() {
  return (
    <RoleBoundary allow={["principal"]}>
      <ReportsWorkspace />
    </RoleBoundary>
  );
}
