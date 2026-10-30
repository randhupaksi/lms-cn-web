"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorState, LoadingState } from "@/components/data-state";
import { Pagination } from "@/components/ui/pagination";
import * as service from "@/services/leadership.service";

const labels: Record<string, string> = {
  open: "Terbuka",
  in_progress: "Berjalan",
  blocked: "Terhambat",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  academic: "Akademik",
  exam: "Ujian",
  data_quality: "Kualitas data",
  general: "Umum",
  low: "Rendah",
  normal: "Normal",
  high: "Tinggi",
};

export function LeadershipActions() {
  const user = useAuth().user;
  const leader = user?.role === "principal" || user?.role === "superadmin";
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const actions = useQuery({
    queryKey: ["leadership-actions", page],
    queryFn: () => service.listActions(page),
  });
  const assignees = useQuery({
    queryKey: ["leadership-assignees"],
    queryFn: service.listAssignees,
    enabled: leader,
  });
  const [selected, setSelected] = useState("");
  const history = useQuery({
    queryKey: ["leadership-history", selected],
    queryFn: () => service.listUpdates(selected),
    enabled: Boolean(selected),
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "normal",
    assignee_id: "",
    due_at: "",
  });
  const [status, setStatus] = useState("in_progress");
  const [note, setNote] = useState("");
  const refresh = async () => {
    await client.invalidateQueries({ queryKey: ["leadership-actions"] });
    await client.invalidateQueries({ queryKey: ["leadership-history"] });
    await client.invalidateQueries({ queryKey: ["leadership-summary"] });
  };
  const create = useMutation({
    mutationFn: service.createAction,
    onSuccess: async () => {
      setForm({
        title: "",
        description: "",
        category: "general",
        priority: "normal",
        assignee_id: "",
        due_at: "",
      });
      await refresh();
    },
  });
  const update = useMutation({
    mutationFn: service.updateAction,
    onSuccess: async () => {
      setNote("");
      await refresh();
    },
  });
  const current = actions.data?.data.find((item) => item.id === selected);
  function submit(event: FormEvent) {
    event.preventDefault();
    create.mutate({
      ...form,
      due_at: form.due_at ? new Date(`${form.due_at}:00+07:00`).toISOString() : null,
    });
  }
  return (
    <div className="governance-workspace">
      <PageHeader
        eyebrow="Koordinasi sekolah"
        title={leader ? "Tindak lanjut sekolah" : "Tindak lanjut saya"}
        description="Pantau penanggung jawab, tenggat, dan catatan perkembangan."
      />
      {leader && (
        <form
          className="governance-section governance-form-grid p-6"
          onSubmit={submit}
        >
          <h2 className="section-title governance-form-wide">
            Buat tindak lanjut
          </h2>
          <label className="field-label">
            Judul
            <input
              className="field-input"
              required
              minLength={3}
              maxLength={180}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="field-label">
            Penanggung jawab
            <select
              className="field-input"
              value={form.assignee_id}
              onChange={(e) =>
                setForm({ ...form, assignee_id: e.target.value })
              }
            >
              <option value="">Belum ditentukan</option>
              {assignees.data?.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.full_name}
                </option>
              ))}
            </select>
          </label>
          {assignees.isError && (
            <p role="alert">Daftar penanggung jawab belum dapat dimuat.</p>
          )}
          <label className="field-label">
            Kategori
            <select
              className="field-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {["general", "academic", "exam", "data_quality"].map((v) => (
                <option key={v} value={v}>
                  {labels[v]}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Prioritas
            <select
              className="field-input"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {["low", "normal", "high"].map((v) => (
                <option key={v} value={v}>
                  {labels[v]}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Tenggat (WIB)
            <input
              className="field-input"
              type="datetime-local"
              value={form.due_at}
              onChange={(e) => setForm({ ...form, due_at: e.target.value })}
            />
          </label>
          <label className="field-label governance-form-wide">
            Uraian
            <textarea
              className="field-input"
              maxLength={2000}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <div className="governance-form-wide">
            <Button type="submit" disabled={create.isPending}>
              Buat tindak lanjut
            </Button>
            {create.isError && (
              <p role="alert">Tindak lanjut belum dapat dibuat.</p>
            )}
            {create.isSuccess && <p role="status">Tindak lanjut dibuat.</p>}
          </div>
        </form>
      )}
      {actions.isLoading && <LoadingState />}
      {actions.isError && (
        <ErrorState
          label="Tindak lanjut belum dapat dimuat."
          onRetry={() => void actions.refetch()}
        />
      )}
      {actions.data && (
        <section className="governance-section p-6">
          <h2 className="section-title">Daftar tindak lanjut</h2>
          {actions.data.data.length === 0 && <p>Belum ada tindak lanjut.</p>}
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Penanggung jawab</th>
                  <th>Status</th>
                  <th>Tenggat</th>
                </tr>
              </thead>
              <tbody>
                {actions.data.data.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <button
                        className="access-user-link"
                        onClick={() => {
                          setSelected(item.id);
                          setNote("");
                        }}
                      >
                        {item.title}
                      </button>
                      <p>
                        {labels[item.priority]} · {labels[item.category]}
                      </p>
                    </td>
                    <td>{item.assignee_name || "Belum ditentukan"}</td>
                    <td>
                      {labels[item.status]}
                      {item.overdue ? " · Lewat tenggat" : ""}
                    </td>
                    <td>
                      {item.due_at
                        ? new Date(item.due_at).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {actions.data && (
        <Pagination
          page={page}
          totalPages={actions.data.meta.total_pages}
          onPageChange={(value) => {
            setPage(value);
            setSelected("");
          }}
          disabled={actions.isFetching}
        />
      )}
      {current && (
        <section className="governance-section p-6">
          <h2 className="section-title">{current.title}</h2>
          <p>{current.description || "Tidak ada uraian."}</p>
          {(leader || (current.status !== "completed" && current.status !== "cancelled")) && <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              update.mutate({
                id: current.id,
                status,
                note,
                version: current.version,
              });
            }}
          >
            <label className="field-label">
              Status baru
              <select
                className="field-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {(leader
                  ? ["open", "in_progress", "blocked", "completed", "cancelled"]
                  : ["in_progress", "blocked", "completed"]
                ).map((v) => (
                  <option key={v} value={v}>
                    {labels[v]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Catatan perkembangan
              <textarea
                className="field-input"
                required
                minLength={5}
                maxLength={1000}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            <Button
              type="submit"
              disabled={update.isPending || status === current.status}
            >
              Simpan perkembangan
            </Button>
            {update.isError && (
              <p role="alert">
                Perubahan belum dapat disimpan. Muat ulang dan coba lagi.
              </p>
            )}
            {update.isSuccess && <p role="status">Perkembangan disimpan.</p>}
          </form>}
          <h3>Riwayat</h3>
          {history.isLoading && <p>Memuat riwayat…</p>}
          {history.isError && <p role="alert">Riwayat belum dapat dimuat.</p>}
          <ul>
            {history.data?.map((item) => (
              <li key={item.id}>
                {item.actor_name} · {labels[item.to_status]} · {item.note} ·{" "}
                {new Date(item.created_at).toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                })}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
