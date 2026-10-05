"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "@/components/ui/AppIcon";
import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { TextInput, SelectInput, CheckInput, Button } from "@/components/ui/FormControls";
import { adminApi, fieldErrors } from "@/lib/adminApi";

const EMPTY = { name: "", email: "", password: "", is_admin: false, is_active: true };

export default function PenggunaClient({ data, query }) {
  const { users, total, aktif, nonaktif, baru7Hari, filteredTotal, page, lastPage } = data;
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [qInput, setQInput] = useState(query.q);

  const [modal, setModal] = useState(null); // { mode: "create"|"edit"|"view", user? }
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  function pushQuery(next) {
    const merged = { ...query, ...next };
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== "" && v != null) params.set(k, v);
    });
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function submitSearch(e) {
    e.preventDefault();
    pushQuery({ q: qInput, page: 1 });
  }

  const readOnly = modal?.mode === "view";
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  function open(mode, user) {
    setForm(user ? { name: user.nama, email: user.email, password: "", is_admin: user.peran === "Admin", is_active: user.status === "Aktif" } : EMPTY);
    setErrors({});
    setMessage("");
    setModal({ mode, user });
  }

  async function save() {
    setBusy(true);
    setErrors({});
    setMessage("");
    const payload = { ...form };
    if (modal.mode === "edit" && !payload.password) delete payload.password;

    const res = modal.mode === "create" ? await adminApi.create("users", payload) : await adminApi.update("users", modal.user.id, payload);
    setBusy(false);

    if (!res.ok) {
      setErrors(fieldErrors(res.errors));
      setMessage(res.message ?? "Gagal menyimpan pengguna.");
      return;
    }
    setModal(null);
    router.refresh();
  }

  async function confirmDelete() {
    setBusy(true);
    setDeleteError("");
    const res = await adminApi.remove("users", toDelete.id);
    setBusy(false);
    if (!res.ok) return setDeleteError(res.message ?? "Gagal menghapus pengguna.");
    setToDelete(null);
    router.refresh();
  }

  return (
    <AdminShell
      title="Pengguna"
      badge="Semua User"
      description="Manajemen akun pengguna, verifikasi peran, dan pemantauan keaktifan masyarakat Svarga."
      actions={
        <>
          <form onSubmit={submitSearch} className="flex items-center gap-1.5">
            <span className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Cari pengguna..."
                className="text-sm bg-white border border-canopy-800/10 rounded-full pl-8 pr-4 py-2 text-ink-700 outline-none focus:border-canopy-600"
              />
            </span>
          </form>
          <SelectInput
            value={query.status}
            onChange={(e) => pushQuery({ status: e.target.value, page: 1 })}
            options={[{ value: "", label: "Status: Semua" }, { value: "aktif", label: "Aktif" }, { value: "nonaktif", label: "NonAktif" }]}
          />
          <button onClick={() => open("create")} className="text-sm bg-canopy-700 text-sand-50 rounded-full px-4 py-2 flex items-center gap-1.5">
            <Plus size={14} /> Tambah Pengguna
          </button>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="Users" label="Total Pengguna" value={total.toLocaleString("id-ID")} note="Total terdaftar dalam sistem" />
        <StatCard icon="Activity" label="Pengguna Aktif" value={aktif.toLocaleString("id-ID")} badge={total ? `${Math.round((aktif / total) * 100)}%` : "0%"} badgeTone="info" note="Status akun aktif" />
        <StatCard icon="UserPlus" label="Pengguna Baru (7 Hari)" value={baru7Hari} note="Pendaftaran seminggu terakhir" />
        <StatCard icon="UserX" label="Pengguna NonAktif" value={nonaktif} badgeTone="danger" note="Akun dinonaktifkan" />
      </div>

      <AdminCard title="Daftar Akun Pengguna Svarga" className="mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink-500 uppercase border-b border-canopy-800/10">
              <th className="pb-2.5 font-medium">Nama</th>
              <th className="pb-2.5 font-medium">Email</th>
              <th className="pb-2.5 font-medium">Peran</th>
              <th className="pb-2.5 font-medium">Status</th>
              <th className="pb-2.5 font-medium">Bergabung</th>
              <th className="pb-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-canopy-800/5 last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-7 w-7 rounded-full bg-canopy-100 text-canopy-700 flex items-center justify-center text-xs font-medium">
                      {u.nama.charAt(0)}
                    </span>
                    <span className="font-medium text-canopy-700">{u.nama}</span>
                  </div>
                </td>
                <td className="py-3 text-ink-700">{u.email}</td>
                <td className="py-3 text-ink-700">{u.peran}</td>
                <td className="py-3"><StatusPill>{u.status}</StatusPill></td>
                <td className="py-3 text-ink-500">{u.bergabung}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2.5 text-canopy-700">
                    <button aria-label={`Lihat ${u.nama}`} onClick={() => open("view", u)}><Eye size={15} /></button>
                    <button aria-label={`Edit ${u.nama}`} onClick={() => open("edit", u)}><Pencil size={14} /></button>
                    <button aria-label={`Hapus ${u.nama}`} onClick={() => { setDeleteError(""); setToDelete(u); }}>
                      <Trash2 size={14} className="text-alert-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-ink-500">Tidak ada pengguna yang cocok.</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4 text-sm text-ink-500">
          <span>Menampilkan halaman {page} dari {lastPage} ({filteredTotal.toLocaleString("id-ID")} hasil)</span>
          <div className="flex items-center gap-1.5">
            <button disabled={page <= 1} onClick={() => pushQuery({ page: page - 1 })} className="h-8 w-8 rounded-lg border border-canopy-800/10 flex items-center justify-center disabled:opacity-40">
              <ChevronLeft size={14} />
            </button>
            <span className="h-8 min-w-8 px-2 rounded-lg bg-canopy-700 text-sand-50 flex items-center justify-center">{page}</span>
            <button disabled={page >= lastPage} onClick={() => pushQuery({ page: page + 1 })} className="h-8 w-8 rounded-lg border border-canopy-800/10 flex items-center justify-center disabled:opacity-40">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </AdminCard>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.mode === "create" ? "Tambah Pengguna" : modal?.mode === "edit" ? "Edit Pengguna" : "Detail Pengguna"}
        footer={
          readOnly ? (
            <Button variant="ghost" onClick={() => setModal(null)}>Tutup</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setModal(null)} disabled={busy}>Batal</Button>
              <Button onClick={save} disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</Button>
            </>
          )
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput label="Nama" value={form.name} onChange={set("name")} error={errors.name} disabled={readOnly} />
          <TextInput label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} disabled={readOnly} />
          {!readOnly && (
            <TextInput
              label={modal?.mode === "edit" ? "Kata sandi baru (opsional)" : "Kata sandi"}
              type="password"
              value={form.password}
              onChange={set("password")}
              error={errors.password}
              hint={modal?.mode === "edit" ? "Kosongkan kalau tidak ingin mengganti kata sandi." : "Minimal 6 karakter."}
            />
          )}
          <CheckInput label="Jadikan admin (akses dashboard ini)" checked={form.is_admin} onChange={set("is_admin")} disabled={readOnly} />
          <CheckInput label="Akun aktif" checked={form.is_active} onChange={set("is_active")} disabled={readOnly} />
        </div>
        {message && <p className="text-sm text-alert-600 mt-4">{message}</p>}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Hapus pengguna?"
        message={`Akun "${toDelete?.nama}" akan dihapus permanen beserta seluruh riwayatnya.`}
        busy={busy}
        error={deleteError}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </AdminShell>
  );
}
