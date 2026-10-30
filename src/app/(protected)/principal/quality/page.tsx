import { RoleBoundary } from "@/components/role-boundary";
import { QualityWorkspace } from "@/features/governance";
export default function Page() {
  return (
    <RoleBoundary allow={["principal"]}>
      <QualityWorkspace />
    </RoleBoundary>
  );
}
