import { RoleBoundary } from "@/components/role-boundary";
import { SettingsWorkspace } from "@/features/governance";
export default function Page() {
  return (
    <RoleBoundary allow={["principal"]}>
      <SettingsWorkspace />
    </RoleBoundary>
  );
}
