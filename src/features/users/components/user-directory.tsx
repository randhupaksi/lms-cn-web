"use client";
import { ActionButton } from "@/components/ui/action-button";
import { KeyRound, UserRoundMinus, UserRoundCheck } from "lucide-react";

import { useState, type FormEvent } from "react";
import type { User } from "@/types/api";
import {
  useResetCredential,
  useToggleUser,
  useUsers,
} from "@/features/users/use-users";
import { DataTable, DataTableShell } from "@/components/ui/data-table";
import { DataTableSkeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { AsyncFeedback } from "@/components/async-feedback";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { FilterBar } from "@/components/ui/filter-bar";
import { RadixSelectField } from "@/components/ui/radix-select";
import { useToast } from "@/providers/toast-provider";

export function UserDirectory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [statusUser, setStatusUser] = useState<User | null>(null);
  const { success: notifySuccess } = useToast();
  const users = useUsers({
    search,
    role: role === "all" ? undefined : role,
    page,
    per_page: 15,
  });
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
          notifySuccess("Kata sandi sementara berhasil diperbarui.");
        },
      },
    );
  }
  function closeReset() {
    setResetUserId(null);
    setResetPassword("");
  }

  function closeStatusDialog() {
    setStatusUser(null);
    toggle.reset();
  }

  function confirmStatusChange() {
    if (!statusUser) return;
    const nextStatus =
      statusUser.status === "active" ? "inactive" : "active";
    toggle.mutate(
      { id: statusUser.id, status: nextStatus },
      {
        onSuccess: () => {
          const message =
            nextStatus === "inactive"
              ? `Akun ${statusUser.full_name} berhasil dinonaktifkan.`
              : `Akun ${statusUser.full_name} berhasil diaktifkan.`;
          setStatusUser(null);
          notifySuccess(message);
        },
      },
    );
  }

  return (
    <DataTableShell>
      <FilterBar>
        <label className="field-label">
          Cari pengguna
          <input
            className="field-input"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Nama atau identitas"
          />
        </label>
        <label className="field-label">
          Peran
          <RadixSelectField
            value={role}
            onValueChange={(value) => {
              setRole(value);
              setPage(1);
            }}
            placeholder="Semua peran"
            options={[
              { value: "all", label: "Semua peran" },
              { value: "curriculum", label: "Kurikulum" },
              { value: "admin", label: "Administrator" },
              { value: "teacher", label: "Guru" },
              { value: "student", label: "Siswa" },
            ]}
          />
        </label>
      </FilterBar>
      {users.isLoading ? (
        <DataTableSkeleton
          label="Memuat direktori pengguna"
          rows={6}
          columns={[
            { label: "Nama", kind: "stack" },
            { label: "Identitas", kind: "text" },
            { label: "Peran", kind: "badge" },
            { label: "Status", kind: "badge" },
            { label: "Aksi", kind: "actions", align: "center" },
          ]}
        />
      ) : (
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
                <td className="action-column">
                  <div className="record-actions">
                    <ActionButton
                      icon={KeyRound}
                      tone="info"
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
                      }}
                    />
                    <ActionButton
                      icon={
                        user.status === "active"
                          ? UserRoundMinus
                          : UserRoundCheck
                      }
                      label={`${user.status === "active" ? "Nonaktifkan" : "Aktifkan"} akun ${user.full_name}`}
                      tone={user.status === "active" ? "danger" : "success"}
                      pending={toggle.isPending && statusUser?.id === user.id}
                      aria-haspopup="dialog"
                      aria-expanded={statusUser?.id === user.id}
                      onClick={() => {
                        toggle.reset();
                        setStatusUser(user);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!users.isLoading && users.data?.data.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-cell">
                  {search || role !== "all"
                    ? "Tidak ada pengguna yang cocok dengan filter ini."
                    : "Belum ada pengguna. Tambahkan akun melalui tombol Tambah pengguna."}
                </td>
              </tr>
            )}
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
      )}
      {resetUserId && (
        <FormDialog
          id="credential-reset-form"
          icon={KeyRound}
          eyebrow="Akses pengguna"
          title="Atur ulang kata sandi sementara"
          description="Tetapkan kata sandi baru. Sesi aktif akun akan dicabut setelah kata sandi diperbarui."
          onClose={closeReset}
          footer={
            <>
              <Button variant="secondary" type="button" onClick={closeReset}>
                Batal
              </Button>
              <Button
                type="submit"
                form="credential-reset-fields"
                disabled={resetCredential.isPending}
              >
                Simpan reset
              </Button>
            </>
          }
        >
          <form
            id="credential-reset-fields"
            className="space-y-4"
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
          </form>
        </FormDialog>
      )}
      <ConfirmationDialog
        open={Boolean(statusUser)}
        onOpenChange={(open) => {
          if (!open) closeStatusDialog();
        }}
        title={
          statusUser?.status === "active"
            ? "Nonaktifkan akun?"
            : "Aktifkan akun?"
        }
        description={
          statusUser?.status === "active"
            ? `Akun ${statusUser.full_name} akan dinonaktifkan dan seluruh sesi aktifnya dicabut. Pengguna tidak dapat masuk sampai akun diaktifkan kembali.`
            : `Akun ${statusUser?.full_name ?? "pengguna ini"} akan diaktifkan agar pengguna dapat masuk kembali.`
        }
        icon={
          statusUser?.status === "active" ? UserRoundMinus : UserRoundCheck
        }
        intent={statusUser?.status === "active" ? "danger" : "success"}
        confirmLabel={
          statusUser?.status === "active" ? "Nonaktifkan akun" : "Aktifkan akun"
        }
        confirmVariant={statusUser?.status === "active" ? "danger" : "primary"}
        pending={toggle.isPending}
        pendingLabel="Memperbarui status…"
        onConfirm={confirmStatusChange}
      >
        {toggle.isError ? (
          <p
            className="mt-4 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger"
            role="alert"
          >
            Status akun belum dapat diperbarui. Periksa koneksi lalu coba lagi.
          </p>
        ) : null}
      </ConfirmationDialog>
      <div className="px-4">
        <AsyncFeedback
          error={resetCredential.error}
          isError={resetCredential.isError}
          isSuccess={false}
          errorMessage="Kata sandi sementara belum dapat diperbarui."
          successMessage=""
        />
        {!statusUser ? (
          <AsyncFeedback
            error={toggle.error}
            isError={toggle.isError}
            isSuccess={false}
            errorMessage="Status akun belum dapat diperbarui."
            successMessage=""
          />
        ) : null}
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
