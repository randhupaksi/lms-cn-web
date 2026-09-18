"use client";

import { useState, type FormEvent } from "react";
import {
  useResetCredential,
  useToggleUser,
  useUsers,
} from "@/features/users/use-users";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { RadixSelectField } from "@/components/ui/radix-select";
import { Pagination } from "@/components/ui/pagination";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";

export function UserDirectory() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
            setSuccessMessage("Kata sandi sementara berhasil diperbarui.");
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
            aria-label="Cari pengguna berdasarkan nama atau identitas"
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <RadixSelectField
            value={role}
            onValueChange={(value) => {
              setRole(value);
              setPage(1);
            }}
            placeholder="Semua peran"
            options={[{ value: "teacher", label: "Guru" }, { value: "student", label: "Siswa" }]}
            ariaLabel="Filter pengguna berdasarkan peran"
            className="w-36"
          />
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
                    <Button
                      variant="ghost"
                      size="compact"
                      onClick={() => {
                        setResetUserId(user.id);
                        setResetPassword("");
                        setSuccessMessage("");
                      }}
                    >
                      Reset kata sandi
                    </Button>
                    <Button
                      variant="ghost"
                      size="compact"
                      onClick={() =>
                        toggle.mutate({
                          id: user.id,
                          status:
                            user.status === "active" ? "inactive" : "active",
                        }, { onSuccess: () => setSuccessMessage(`Status akun ${user.full_name} berhasil diperbarui.`) })
                      }
                    >
                      {user.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
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
            {users.isLoading ? (
              <tr>
                <td colSpan={5} className="empty-cell" role="status">
                  Memuat daftar pengguna…
                </td>
              </tr>
            ) : null}
            {users.isError ? (
              <tr>
                <td colSpan={5} className="empty-cell text-danger" role="alert">
                  Daftar pengguna belum dapat dimuat.{' '}
                  <Button variant="ghost" size="compact" onClick={() => void users.refetch()}>
                    Coba lagi
                  </Button>
                </td>
              </tr>
            ) : null}
          </tbody>
        </DataTable>
      </div>
      {resetUserId && (
        <form
          className="flex flex-wrap items-end gap-3 border-t border-border bg-surface p-4"
          onSubmit={submitReset}
          aria-label="Atur ulang kata sandi sementara"
        >
          <label className="field-label min-w-64 flex-1">
            Kata sandi sementara baru
            <input
              className="field-input"
              type="password"
              minLength={8}
              value={resetPassword}
              placeholder="Masukkan kata sandi sementara baru"
              onChange={(event) => setResetPassword(event.target.value)}
            required
          />
            <span className="text-xs font-normal leading-5 text-muted">Sesi aktif pengguna akan dicabut saat kata sandi diperbarui.</span>
          </label>
          <Button
            type="submit"
            disabled={resetCredential.isPending}
          >
            Simpan reset
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={() => setResetUserId(null)}
          >
            Batal
          </Button>
        </form>
      )}
      {successMessage ? <p className="border-t border-border px-4 py-3 text-sm font-medium text-success" role="status">{successMessage}</p> : null}
      <div className="px-4">
        <AsyncFeedback
          error={resetCredential.error}
          isError={resetCredential.isError}
          isSuccess={false}
          errorMessage="Kata sandi sementara belum dapat diperbarui."
          successMessage=""
        />
        <AsyncFeedback
          error={toggle.error}
          isError={toggle.isError}
          isSuccess={false}
          errorMessage="Status akun belum dapat diperbarui."
          successMessage=""
        />
      </div>
      <Pagination
        page={users.data?.meta.page ?? page}
        totalPages={users.data?.meta.total_pages ?? 1}
        onPageChange={setPage}
        disabled={users.isFetching}
        label="Navigasi halaman pengguna"
      />
    </DataTableShell>
  );
}
