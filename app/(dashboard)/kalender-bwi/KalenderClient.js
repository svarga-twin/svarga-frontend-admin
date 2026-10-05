"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Plus, Pencil, Trash2 } from "@/components/ui/AppIcon";
import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { TextInput, TextArea, SelectInput, Button } from "@/components/ui/FormControls";
import { adminApi, fieldErrors } from "@/lib/adminApi";

const days = ["S", "S", "R", "K", "J", "S", "M"];
const CATEGORIES = [
  { value: "", label: "Semua Kategori" },
  { value: "budaya", label: "Budaya" },
  { value: "pariwisata", label: "Pariwisata" },
  { value: "seni", label: "Seni" },
];

const EMPTY = { name: "", location_name: "", address: "", category: "budaya", event_date: "", start_time: "", end_time: "", description: "" };

function toForm(f) {
  return {
    name: f.name, location_name: f.locationName ?? f.location, address: f.routeInfo ?? "", category: f.category ?? "budaya",
    event_date: f.rawDate ?? "", start_time: f.startTime ?? "", end_time: f.endTime ?? "", description: f.description ?? "",
  };
}

export default function KalenderClient({ festivals }) {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const filtered = useMemo(
    () => (category ? festivals.filter((f) => f.category === category) : festivals),
    [festivals, category]
  );
  const [selected, setSelected] = useState(filtered[0] ?? null);
  const current = filtered.find((f) => f.id === selected?.id) ?? filtered[0] ?? null;

  const [modal, setModal] = useState(null); // { mode: "create"|"edit" }
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const highlightDates = filtered.map((f) => Number(f.date.match(/^(\d+)/)?.[1] ?? 0));
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function open(mode) {
    setForm(mode === "edit" && current ? toForm(current) : EMPTY);
    setErrors({});
    setMessage("");
    setModal({ mode });
  }

  async function save() {
    setBusy(true);
    setErrors({});
    setMessage("");
    const res = modal.mode === "create"
      ? await adminApi.create("festivals", form)
      : await adminApi.update("festivals", current.id, form);
    setBusy(false);

    if (!res.ok) {
      setErrors(fieldErrors(res.errors));
      setMessage(res.message ?? "Gagal menyimpan event.");
      return;
    }
    setModal(null);
    router.refresh();
  }

  async function confirmDelete() {
    setBusy(true);
    setDeleteError("");
    const res = await adminApi.remove("festivals", toDelete.id);
    setBusy(false);
    if (!res.ok) return setDeleteError(res.message ?? "Gagal menghapus event.");
    setToDelete(null);
    setSelected(null);
    router.refresh();
  }

  return (
    <AdminShell
      title="Kalender Festival BWI"
      badge="Kalender Event"
      description="Pusat informasi agenda festival budaya dan pariwisata Banyuwangi."
      actions={
        <button onClick={() => open("create")} className="text-sm bg-canopy-700 text-sand-50 rounded-full px-4 py-2 flex items-center gap-1.5">
          <Plus size={14} /> Tambah Event
        </button>
      }
    >
      <div className="flex items-center gap-3 mb-5">
        <SelectInput value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES} />
        <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Kecamatan: Semua Lokasi</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          <AdminCard title="Mei 2026" action={<div className="flex items-center gap-2 text-canopy-700"><ChevronLeft size={16} /><ChevronRight size={16} /></div>}>
            <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
              {days.map((d, i) => <span key={i} className="text-xs text-ink-500">{d}</span>)}
              {Array.from({ length: 31 }).map((_, i) => {
                const date = i + 1;
                const active = highlightDates.includes(date);
                return (
                  <span key={date} className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-sm ${active ? "bg-canopy-700 text-sand-50 font-medium" : "text-ink-700"}`}>
                    {date}
                  </span>
                );
              })}
            </div>
          </AdminCard>

          <AdminCard title="Event Terdekat">
            <div className="flex flex-col gap-3">
              {filtered.length === 0 && <p className="text-sm text-ink-500">Tidak ada event untuk kategori ini.</p>}
              {filtered.map((f) => (
                <button key={f.id} onClick={() => setSelected(f)} className={`flex items-center gap-3 text-left rounded-xl p-1.5 -mx-1.5 ${current?.id === f.id ? "bg-canopy-100" : ""}`}>
                  <span className="h-11 w-11 rounded-lg bg-canopy-100 text-canopy-700 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{f.name}</p>
                    <p className="text-xs text-ink-500">{f.date} • {f.location}</p>
                  </div>
                </button>
              ))}
            </div>
          </AdminCard>
        </div>

        {current ? (
          <AdminCard title={current.name} className="col-span-2">
            <div className="w-full h-56 rounded-xl bg-gradient-to-br from-canopy-200 via-ochre-100 to-canopy-100 flex items-center justify-center overflow-hidden">
              {current.image ? <img src={current.image} alt={current.name} className="w-full h-full object-cover" /> : <Calendar size={40} className="text-canopy-700/40" />}
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-700 mt-4">
              <Calendar size={15} className="text-canopy-700" />
              {current.date}{current.startTime ? `, ${current.startTime} - ${current.endTime} WIB` : ""}
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-700 mt-1.5">
              <MapPin size={15} className="text-canopy-700" />
              {current.routeInfo ?? current.location}
            </div>

            <p className="text-sm text-ink-500 leading-relaxed mt-4">{current.description}</p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-sand-100 rounded-xl p-3">
                <p className="text-xs text-ink-500">Rute Terkait</p>
                <p className="font-semibold text-ink-900 mt-1">{current.routeCount ?? "-"} Rute Hijau</p>
              </div>
              <div className="bg-sand-100 rounded-xl p-3">
                <p className="text-xs text-ink-500">Notifikasi Terkirim</p>
                <p className="font-semibold text-ink-900 mt-1">{current.notifSent?.toLocaleString("id-ID") ?? "-"} Warga</p>
              </div>
              <div className="bg-sand-100 rounded-xl p-3">
                <p className="text-xs text-ink-500">UMKM Terlibat</p>
                <p className="font-semibold text-ink-900 mt-1">{current.umkmCount ?? "-"} Usaha</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button onClick={() => open("edit")} className="bg-canopy-700 text-sand-50 rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-1.5">
                <Pencil size={14} /> Kelola Event
              </button>
              <button onClick={() => { setDeleteError(""); setToDelete(current); }} className="bg-alert-600/10 text-alert-600 rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-1.5">
                <Trash2 size={14} /> Hapus Event
              </button>
            </div>
          </AdminCard>
        ) : (
          <AdminCard title="Belum ada event" className="col-span-2">
            <p className="text-sm text-ink-500">Klik &quot;Tambah Event&quot; untuk membuat agenda baru.</p>
          </AdminCard>
        )}
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        wide
        title={modal?.mode === "create" ? "Tambah Event Festival" : "Edit Event Festival"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)} disabled={busy}>Batal</Button>
            <Button onClick={save} disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><TextInput label="Nama event" value={form.name} onChange={set("name")} error={errors.name} /></div>
          <TextInput label="Nama lokasi" value={form.location_name} onChange={set("location_name")} error={errors.location_name} />
          <SelectInput label="Kategori" value={form.category} onChange={set("category")} error={errors.category}
            options={[{ value: "budaya", label: "Budaya" }, { value: "pariwisata", label: "Pariwisata" }, { value: "seni", label: "Seni" }]} />
          <div className="col-span-2"><TextInput label="Alamat lengkap" value={form.address} onChange={set("address")} error={errors.address} /></div>
          <TextInput label="Tanggal" type="date" value={form.event_date} onChange={set("event_date")} error={errors.event_date} />
          <div className="grid grid-cols-2 gap-2">
            <TextInput label="Jam mulai" type="time" value={form.start_time} onChange={set("start_time")} error={errors.start_time} />
            <TextInput label="Jam selesai" type="time" value={form.end_time} onChange={set("end_time")} error={errors.end_time} />
          </div>
          <div className="col-span-2"><TextArea label="Deskripsi" value={form.description} onChange={set("description")} error={errors.description} /></div>
        </div>
        {message && <p className="text-sm text-alert-600 mt-4">{message}</p>}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Hapus event?"
        message={`Event "${toDelete?.name}" akan dihapus permanen dari kalender.`}
        busy={busy}
        error={deleteError}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </AdminShell>
  );
}
