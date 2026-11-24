"use client";
import { ActionButton } from "@/components/ui/action-button";
import { KeyRound, UserRoundMinus, UserRoundCheck } from "lucide-react";

import { useState, type FormEvent } from "react";
import {
  useResetCredential,
  useToggleUser,
  useUsers,
} from "@/features/users/use-users";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";

export function UserDirectory() {
  const [page, setPage] = useState(1);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const users = useUsers({ page });
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
  function closeReset() {
    setResetUserId(null);
    setResetPassword("");
  }

  return (
    <DataTableShell>
      <DataTable caption="Direktori pengguna sekolah">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Identitas</th>
            <th>Peran</th>
            <th>Status</th>
            <th className="action-column">Aksi</th>
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
                  <ActionButton
                    icon={KeyRound}
                    label={`Atur ulang kata sandi ${user.full_name}`}
                    aria-haspopup="dialog"
                    aria-expanded={resetUserId === user.id}
                    aria-controls={
                      resetUserId === user.id
                        ? "credential-reset-form"
                        : undefined
                    }
                    onClick={() => {
                      setResetUserId(user.id);
                      setResetPassword("");
                      setSuccessMessage("");
                    }}
                  />
                  <ActionButton
                    icon={
                      user.status === "active"
                        ? UserRoundMinus
                        : UserRoundCheck
                    }
                    label={`${user.status === "active" ? "Nonaktifkan" : "Aktifkan"} akun ${user.full_name}`}
                    tone={user.status === "active" ? "danger" : "neutral"}
                    pending={toggle.isPending}
                    onClick={() =>
                      toggle.mutate(
                        {
                          id: user.id,
                          status:
                            user.status === "active" ? "inactive" : "active",
                        },
                        {
                          onSuccess: () =>
                            setSuccessMessage(
                              `Status akun ${user.full_name} berhasil diperbarui.`,
                            ),
                        },
                      )
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
          {!users.isLoading && users.data?.data.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-cell">
                Belum ada pengguna. Tambahkan akun melalui tombol Tambah pengguna.
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
                Daftar pengguna belum dapat dimuat.{" "}
                <Button
                  variant="ghost"
                  size="compact"
                  onClick={() => void users.refetch()}
                >
                  Coba lagi
                </Button>
              </td>
            </tr>
          ) : null}
        </tbody>
      </DataTable>
      {resetUserId && (
        <FormDialog
          id="credential-reset-form"
          eyebrow="Akses pengguna"
          title="Atur ulang kata sandi sementara"
          description="Tetapkan kata sandi baru. Sesi aktif akun akan dicabut setelah kata sandi diperbarui."
          onClose={closeReset}
        >
          <form
            className="flex flex-wrap items-end gap-3"
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
              <span className="text-xs font-normal leading-5 text-muted">
                Sesi aktif pengguna akan dicabut saat kata sandi diperbarui.
              </span>
            </label>
            <Button type="submit" disabled={resetCredential.isPending}>
              Simpan reset
            </Button>
            <Button variant="ghost" type="button" onClick={closeReset}>
              Batal
            </Button>
          </form>
        </FormDialog>
      )}
      {successMessage ? (
        <p
          className="border-t border-border px-4 py-3 text-sm font-medium text-success"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}
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
