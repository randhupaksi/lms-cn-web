"use client";

import { useState, type FormEvent } from "react";
import {
  useResetCredential,
  useToggleUser,
  useUsers,
} from "@/features/users/use-users";
import { DataTable, DataTableShell } from "@/components/ui/data-table";

export function UserDirectory() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const users = useUsers({ search, role, page });
  const toggle = useToggleUser();
  const resetCredential = useResetCredential();

  function submitReset(event: FormEvent) {
    event.preventDefault();
    if (!resetUserId) return;
    resetCredential.mutate(
      { id: resetUserId, password: resetPassword },
      {
        onSuccess: () => {
          setResetUserId(null);
          setResetPassword("");
        },
      },
    );
  }

  return (
    <DataTableShell>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border p-5">
        <div>
          <h2 className="section-title">Daftar pengguna</h2>
          <p className="mt-1 text-xs text-muted">
            {users.data?.meta.total ?? 0} akun
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            className="field-input w-56"
            type="search"
            placeholder="Cari nama atau identitas…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <select
            className="field-input w-36"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua peran</option>
            <option value="teacher">Guru</option>
            <option value="student">Siswa</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTable>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Identitas</th>
              <th>Peran</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.data?.data.map((user) => (
              <tr key={user.id}>
                <td className="font-semibold">{user.full_name}</td>
                <td>{user.identifier}</td>
                <td className="capitalize">{user.role}</td>
                <td>
                  <span
                    className={`status-badge ${user.status === "active" ? "status-active" : ""}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-1">
                    <button
                      className="button-ghost"
                      onClick={() => {
                        setResetUserId(user.id);
                        setResetPassword("");
                      }}
                    >
                      Reset credential
                    </button>
                    <button
                      className="button-ghost"
                      onClick={() =>
                        toggle.mutate({
                          id: user.id,
                          status:
                            user.status === "active" ? "inactive" : "active",
                        })
                      }
                    >
                      {user.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!users.isLoading && users.data?.data.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-cell">
                  Belum ada pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>
      </div>
      {resetUserId && (
        <form
          className="flex flex-wrap items-end gap-3 border-t border-border bg-surface p-4"
          onSubmit={submitReset}
        >
          <label className="field-label min-w-64 flex-1">
            Kata sandi sementara baru
            <input
              className="field-input"
              type="password"
              minLength={8}
              value={resetPassword}
              onChange={(event) => setResetPassword(event.target.value)}
              required
            />
          </label>
          <button
            className="button-primary"
            disabled={resetCredential.isPending}
          >
            Simpan reset
          </button>
          <button
            className="button-ghost"
            type="button"
            onClick={() => setResetUserId(null)}
          >
            Batal
          </button>
        </form>
      )}
      <div className="flex items-center justify-between border-t border-border p-4 text-sm">
        <p className="text-muted">
          Halaman {users.data?.meta.page ?? page} dari{" "}
          {Math.max(users.data?.meta.total_pages ?? 1, 1)}
        </p>
        <div className="flex gap-2">
          <button
            className="button-ghost"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Sebelumnya
          </button>
          <button
            className="button-ghost"
            disabled={page >= (users.data?.meta.total_pages ?? 1)}
            onClick={() => setPage((value) => value + 1)}
          >
            Berikutnya
          </button>
        </div>
      </div>
    </DataTableShell>
  );
}
