import { RoleBoundary } from "@/components/role-boundary";
import { UserCreateForm } from "@/features/users/components/user-create-form";
import { UserDirectory } from "@/features/users/components/user-directory";

export default function UsersPage() {
  return (
    <RoleBoundary allow={["admin"]}>
      <div className="space-y-8">
        <header>
          <p className="eyebrow">IDENTITAS & AKSES</p>
          <h1 className="page-title">Pengguna</h1>
          <p className="page-description">
            Kelola akun guru dan siswa. Penonaktifan akun langsung mencabut
            seluruh sesi aktif.
          </p>
        </header>
        <UserCreateForm />
        <UserDirectory />
      </div>
    </RoleBoundary>
  );
}
