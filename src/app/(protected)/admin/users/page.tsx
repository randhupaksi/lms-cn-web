import { RoleBoundary } from "@/components/role-boundary";
import { UserCreateForm } from "@/features/users/components/user-create-form";
import { UserDirectory } from "@/features/users/components/user-directory";
import { PageHeader } from "@/components/ui/page-header";
import { UsersRound } from "lucide-react";

export default function UsersPage() {
  return (
    <RoleBoundary allow={["admin"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Identitas & akses"
          title="Pengguna"
          description="Kelola akun guru dan siswa. Penonaktifan akun langsung mencabut seluruh sesi aktif."
          icon={UsersRound}
        />
        <UserCreateForm />
        <UserDirectory />
      </div>
    </RoleBoundary>
  );
}
