"use client";

import { useState, type FormEvent } from "react";
import { useCreateUser } from "@/features/users/use-users";
import type { UserRole } from "@/types/api";

const initialForm = {
  identifier: "",
  full_name: "",
  role: "student" as Exclude<UserRole, "admin">,
  temporary_password: "",
};

export function UserCreateForm() {
  const create = useCreateUser();
  const [form, setForm] = useState(initialForm);

  function submit(event: FormEvent) {
    event.preventDefault();
    create.mutate(form, { onSuccess: () => setForm(initialForm) });
  }

  return (
    <section className="panel">
      <h2 className="section-title">Tambah pengguna</h2>
      <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <label className="field-label">
          NIS, NIP, atau username
          <input
            className="field-input"
            value={form.identifier}
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
            onChange={(event) =>
              setForm({ ...form, full_name: event.target.value })
            }
            required
          />
        </label>
        <label className="field-label">
          Peran
          <select
            className="field-input"
            value={form.role}
            onChange={(event) =>
              setForm({
                ...form,
                role: event.target.value as Exclude<UserRole, "admin">,
              })
            }
          >
            <option value="student">Siswa</option>
            <option value="teacher">Guru</option>
          </select>
        </label>
        <label className="field-label">
          Kata sandi sementara
          <input
            className="field-input"
            type="password"
            minLength={8}
            value={form.temporary_password}
            onChange={(event) =>
              setForm({ ...form, temporary_password: event.target.value })
            }
            required
          />
        </label>
        <div className="md:col-span-2">
          <button className="button-primary" disabled={create.isPending}>
            {create.isPending ? "Menyimpan…" : "Tambah pengguna"}
          </button>
        </div>
      </form>
      {create.isError && (
        <p className="form-error">
          Pengguna belum dapat dibuat. Periksa kembali data.
        </p>
      )}
    </section>
  );
}
