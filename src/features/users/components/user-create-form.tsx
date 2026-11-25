"use client";

import { useState, type FormEvent } from "react";
import { UserRoundPlus } from "lucide-react";
import { useCreateUser } from "@/features/users/use-users";
import type { UserRole } from "@/types/api";
import { RadixSelectField } from "@/components/ui/radix-select";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { useToast } from "@/providers/toast-provider";

const initialForm = {
  identifier: "",
  full_name: "",
  role: "student" as Extract<UserRole, "teacher" | "student">,
  temporary_password: "",
};

export function UserCreateForm({ onClose }: { onClose: () => void }) {
  const create = useCreateUser();
  const { success: notifySuccess } = useToast();
  const [form, setForm] = useState(initialForm);

  function submit(event: FormEvent) {
    event.preventDefault();
    create.mutate(form, {
      onSuccess: () => {
        setForm(initialForm);
        onClose();
        notifySuccess("Pengguna berhasil ditambahkan.");
      },
    });
  }

  return (
    <FormDialog
      id="user-editor"
      icon={UserRoundPlus}
      title="Tambah pengguna"
      description="Daftarkan akun guru atau siswa dengan kata sandi sementara dari sekolah."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            form="user-create-form"
            disabled={create.isPending}
          >
            {create.isPending ? "Menyimpan…" : "Tambah pengguna"}
          </Button>
        </>
      }
    >
      <form
        id="user-create-form"
        className="grid gap-4 md:grid-cols-2"
        onSubmit={submit}
      >
        <label className="field-label">
          NIS, NIP, atau username
          <input
            className="field-input"
            value={form.identifier}
            placeholder="Contoh: 20240017 atau NIP guru"
            onChange={(event) =>
              setForm({ ...form, identifier: event.target.value })
            }
            required
          />
        </label>
        <label className="field-label">
          Nama lengkap
          <input
            className="field-input"
            value={form.full_name}
            placeholder="Contoh: Siti Rahmawati"
            onChange={(event) =>
              setForm({ ...form, full_name: event.target.value })
            }
            required
          />
        </label>
        <label className="field-label">
          Peran
          <RadixSelectField
            value={form.role}
            onValueChange={(value) =>
              setForm({ ...form, role: value as Extract<UserRole, "teacher" | "student"> })
            }
            placeholder="Pilih peran"
            options={[
              { value: "student", label: "Siswa" },
              { value: "teacher", label: "Guru" },
            ]}
          />
        </label>
        <label className="field-label">
          Kata sandi sementara
          <input
            className="field-input"
            type="password"
            minLength={8}
            value={form.temporary_password}
            placeholder="Minimal 8 karakter"
            onChange={(event) =>
              setForm({ ...form, temporary_password: event.target.value })
            }
            required
          />
        </label>
      </form>
      <AsyncFeedback
        error={create.error}
        isError={create.isError}
        isSuccess={false}
        errorMessage="Pengguna belum dapat dibuat. Periksa kembali data."
        successMessage=""
      />
    </FormDialog>
  );
}
