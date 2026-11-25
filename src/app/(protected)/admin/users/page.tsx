"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RoleBoundary } from "@/components/role-boundary";
import { UserCreateForm } from "@/features/users/components/user-create-form";
import { UserDirectory } from "@/features/users/components/user-directory";
import { PageHeader } from "@/components/ui/page-header";
import { UsersRound, Plus } from "lucide-react";

export default function UsersPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  return (
    <RoleBoundary allow={["superadmin", "admin"]}>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Identitas & akses"
          title="Pengguna"
          description="Kelola akun guru dan siswa. Penonaktifan akun langsung mencabut seluruh sesi aktif."
          icon={UsersRound}
          actions={
            <Button
              id="user-editor-trigger"
              aria-haspopup="dialog"
              aria-expanded={editorOpen}
              aria-controls={editorOpen ? "user-editor" : undefined}
              onClick={() => setEditorOpen(true)}
            >
              <Plus aria-hidden="true" size={17} /> Tambah pengguna
            </Button>
          }
        />
        {editorOpen ? (
          <UserCreateForm onClose={() => setEditorOpen(false)} />
        ) : null}
        <UserDirectory />
      </div>
    </RoleBoundary>
  );
}
