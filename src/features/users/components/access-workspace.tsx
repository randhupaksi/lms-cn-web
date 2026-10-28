"use client";
import { useState } from "react";
import {
  KeyRound,
  LogOut,
  Monitor,
  Plus,
  Search,
  ShieldCheck,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import type { User, UserRole } from "@/types/api";
import {
  CreateManagedUser,
  Feedback,
  labels,
  UserInspector,
} from "./access-workspace-sections";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { RadixSelectField } from "@/components/ui/radix-select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState, ErrorState } from "@/components/data-state";
import {
  useChangeUserRole,
  useResetCredential,
  useRevokeUserSessions,
  useToggleUser,
  useUsers,
} from "../use-users";

export function AccessWorkspace() {
  const [notice, setNotice] = useState("");
  const { user: actor } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [inspected, setInspected] = useState("");
  const query = useUsers({ search, role, page, per_page: 15 });
  const selected = query.data?.data.find((user) => user.id === inspected);
  const [action, setAction] = useState<{
    user: User;
    kind: "role" | "reset" | "toggle" | "revoke";
  } | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("admin");
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const changeRole = useChangeUserRole();
  const reset = useResetCredential();
  const toggle = useToggleUser();
  const revoke = useRevokeUserSessions();
  const mutations = [changeRole, reset, toggle, revoke];
  const pending = mutations.some((m) => m.isPending);
  function open(user: User, kind: NonNullable<typeof action>["kind"]) {
    setNotice("");
    mutations.forEach((m) => m.reset());
    setAction({ user, kind });
    setNewRole(user.role);
    setReason("");
    setPassword("");
  }
  function close() {
    setAction(null);
    setPassword("");
    setReason("");
  }
  function confirm() {
    if (!action) return;
    const options = {
      onSuccess: () => {
        setNotice(
          action.kind === "role"
            ? "Role diperbarui dan sesi lama akun tujuan diakhiri."
            : action.kind === "reset"
              ? "Kredensial direset. Pengguna wajib mengganti kata sandi saat masuk."
              : action.kind === "revoke"
                ? "Seluruh sesi akun tujuan berhasil diakhiri."
                : "Status akun berhasil diperbarui.",
        );
        close();
      },
    };
    if (action.kind === "role")
      changeRole.mutate(
        {
          id: action.user.id,
          role: newRole,
          reason,
          current_password: password,
        },
        options,
      );
    if (action.kind === "reset")
      reset.mutate({ id: action.user.id, password }, options);
    if (action.kind === "toggle")
      toggle.mutate(
        {
          id: action.user.id,
          status: action.user.status === "active" ? "inactive" : "active",
        },
        options,
      );
    if (action.kind === "revoke") revoke.mutate(action.user.id, options);
  }
  const disabled =
    action?.kind === "role"
      ? newRole === action.user.role ||
        reason.trim().length < 10 ||
        password.length === 0
      : action?.kind === "reset"
        ? password.length < 8
        : false;
  return (
    <div className="governance-workspace">
      <PageHeader
        eyebrow="Tata kelola akses"
        title="Orang yang tepat, kewenangan yang jelas"
        description="Kelola akun sekolah, administrator, dan sesi aktif dengan jejak perubahan yang terjaga."
        actions={
          <Button onClick={() => setCreating(!creating)}>
            <Plus size={17} aria-hidden="true" />
            Buat akun
          </Button>
        }
      />
      <div className="governance-guidance">
        <ShieldCheck size={22} aria-hidden="true" />
        <p>
          Perubahan peran memerlukan konfirmasi kata sandi Anda dan mengakhiri
          sesi akun tujuan. Akun dengan relasi akademik memiliki batas perubahan
          role.
        </p>
      </div>
      {creating && (
        <CreateManagedUser
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            setNotice(
              "Akun baru berhasil dibuat dan wajib mengganti kata sandi saat masuk.",
            );
          }}
        />
      )}
      {notice && (
        <p className="feedback-message feedback-message-success" role="status">
          {notice}
        </p>
      )}
      <div
        className="governance-tabs"
        role="group"
        aria-label="Filter peran pengguna"
      >
        {["", "superadmin", "admin", "teacher", "student"].map((value) => (
          <button
            key={value}
            aria-pressed={role === value}
            onClick={() => {
              setRole(value);
              setPage(1);
              setInspected("");
            }}
          >
            {value ? labels[value as UserRole] : "Semua pengguna"}
          </button>
        ))}
      </div>
      <div className={`access-layout ${selected ? "has-inspector" : ""}`}>
        <section className="governance-section">
          <div className="governance-toolbar">
            <label className="governance-search">
              <Search size={17} aria-hidden="true" />
              <input
                value={search}
                aria-label="Cari pengguna"
                placeholder="Cari nama atau identitas…"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </label>
            <span className="text-sm text-muted">
              {query.data?.meta.total ?? "—"} pengguna
            </span>
          </div>
          {query.isLoading && <LoadingState label="Memuat pengguna sekolah…" />}
          {query.isError && (
            <ErrorState
              label="Pengguna belum dapat dimuat."
              onRetry={() => void query.refetch()}
            />
          )}
          {query.data && (
            <>
              <div className="table-scroll">
                <table className="data-table access-table">
                  <caption className="sr-only">
                    Akun sekolah dan status akses
                  </caption>
                  <thead>
                    <tr>
                      <th>Pengguna</th>
                      <th>Peran</th>
                      <th>Status</th>
                      <th>
                        <span className="sr-only">Tindakan</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {query.data.data.map((user) => (
                      <tr key={user.id} data-inspected={inspected === user.id}>
                        <td>
                          <button
                            className="access-user-link"
                            onClick={() =>
                              setInspected(inspected === user.id ? "" : user.id)
                            }
                            aria-expanded={inspected === user.id}
                          >
                            {user.full_name}
                          </button>
                          <p className="text-xs text-muted mt-1">
                            {user.identifier}
                            {user.id === actor?.id ? " · Anda" : ""}
                          </p>
                        </td>
                        <td>{labels[user.role]}</td>
                        <td>
                          <StatusBadge
                            tone={
                              user.status === "active" ? "success" : "neutral"
                            }
                          >
                            {user.status === "active" ? "Aktif" : "Nonaktif"}
                          </StatusBadge>
                        </td>
                        <td>
                          <div className="table-actions">
                            <ActionButton
                              icon={Monitor}
                              label={`Rincian dan sesi ${user.full_name}`}
                              onClick={() =>
                                setInspected(
                                  inspected === user.id ? "" : user.id,
                                )
                              }
                            />
                            <ActionButton
                              icon={ShieldCheck}
                              label={`Ubah peran ${user.full_name}`}
                              disabled={user.id === actor?.id}
                              onClick={() => open(user, "role")}
                            />
                            <ActionButton
                              icon={KeyRound}
                              label={`Reset kredensial ${user.full_name}`}
                              disabled={user.id === actor?.id}
                              onClick={() => open(user, "reset")}
                            />
                            <ActionButton
                              icon={
                                user.status === "active"
                                  ? UserRoundX
                                  : UserRoundCheck
                              }
                              label={`${user.status === "active" ? "Nonaktifkan" : "Aktifkan"} ${user.full_name}`}
                              disabled={user.id === actor?.id}
                              onClick={() => open(user, "toggle")}
                            />
                            <ActionButton
                              icon={LogOut}
                              tone="danger"
                              label={`Akhiri seluruh sesi ${user.full_name}`}
                              disabled={user.id === actor?.id}
                              onClick={() => open(user, "revoke")}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {query.data.data.length === 0 && (
                <p className="governance-empty">
                  Tidak ada pengguna yang sesuai pencarian.
                </p>
              )}
              <Pagination
                page={page}
                totalPages={query.data.meta.total_pages}
                onPageChange={setPage}
                disabled={query.isFetching}
              />
            </>
          )}
        </section>
        {selected && (
          <UserInspector
            key={`${selected.id}-${selected.updated_at}`}
            user={selected}
          />
        )}
      </div>
      <ConfirmationDialog
        open={Boolean(action)}
        onOpenChange={(value) => {
          if (!value) close();
        }}
        title={
          action?.kind === "role"
            ? "Ubah peran pengguna"
            : action?.kind === "reset"
              ? "Reset kredensial"
              : action?.kind === "revoke"
                ? "Akhiri seluruh sesi?"
                : action?.user.status === "active"
                  ? "Nonaktifkan akun?"
                  : "Aktifkan akun?"
        }
        description={action?.user.full_name ?? ""}
        confirmLabel={
          action?.kind === "role"
            ? "Simpan peran"
            : action?.kind === "reset"
              ? "Reset kredensial"
              : "Lanjutkan"
        }
        pending={pending}
        confirmDisabled={disabled}
        onConfirm={confirm}
      >
        {action?.kind === "role" && (
          <div className="space-y-4 mt-4">
            <label className="field-label">
              Peran baru
              <RadixSelectField
                placeholder="Pilih opsi"
                value={newRole}
                onValueChange={(value) => setNewRole(value as UserRole)}
                options={Object.entries(labels).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </label>
            <label className="field-label">
              Alasan perubahan
              <textarea
                className="field-input"
                rows={2}
                value={reason}
                minLength={10}
                maxLength={500}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
            <label className="field-label">
              Konfirmasi kata sandi Anda
              <input
                className="field-input"
                type="password"
                autoComplete="current-password"
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
        )}
        {action?.kind === "reset" && (
          <label className="field-label mt-4">
            Kata sandi sementara baru
            <input
              className="field-input"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="text-xs text-muted">
              Pengguna wajib mengganti kata sandi pada login berikutnya.
            </span>
          </label>
        )}
        {mutations.map((mutation, index) => (
          <Feedback key={index} mutation={mutation} />
        ))}
      </ConfirmationDialog>
    </div>
  );
}
