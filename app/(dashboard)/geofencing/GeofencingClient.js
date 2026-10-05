"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Pencil, Trash2 } from "@/components/ui/AppIcon";
import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatusPill from "@/components/ui/StatusPill";
import AdminMap from "@/components/maps/AdminMap";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { TextInput, TextArea, SelectInput, CheckInput, Button } from "@/components/ui/FormControls";
import { adminApi, fieldErrors } from "@/lib/adminApi";

const EMPTY = {
  name: "", latitude: "", longitude: "", radius_meter: "60", is_active: true,
  soundscape_id: "", koridor_id: "", welcome_title: "", welcome_desc: "",
};

function toForm(z) {
  return {
    name: z.nama, latitude: String(z.lat), longitude: String(z.lng), radius_meter: String(z.radiusMeter),
    is_active: z.isActive, soundscape_id: z.soundscapeId ? String(z.soundscapeId) : "",
    koridor_id: z.koridorId ? String(z.koridorId) : "", welcome_title: z.welcomeTitle ?? "", welcome_desc: z.welcomeDesc ?? "",
  };
}

export default function GeofencingClient({ zones, options }) {
  const router = useRouter();
  const [modal, setModal] = useState(null); // { mode: "create" | "edit" | "view", zone? }
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const markers = zones.map((z) => ({ id: z.id, label: z.nama, note: `${z.status} • ${z.konten}`, lat: z.lat, lng: z.lng }));
  const readOnly = modal?.mode === "view";
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  function open(mode, zone) {
    setForm(zone ? toForm(zone) : EMPTY);
    setErrors({});
    setMessage("");
    setModal({ mode, zone });
  }

  async function save() {
    setBusy(true);
    setErrors({});
    setMessage("");
    const payload = {
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      radius_meter: Number(form.radius_meter),
      soundscape_id: form.soundscape_id ? Number(form.soundscape_id) : null,
      koridor_id: form.koridor_id ? Number(form.koridor_id) : null,
    };
    const res = modal.mode === "create"
      ? await adminApi.create("geofences", payload)
      : await adminApi.update("geofences", modal.zone.id, payload);
    setBusy(false);

    if (!res.ok) {
      setErrors(fieldErrors(res.errors));
      setMessage(res.message ?? "Gagal menyimpan zona.");
      return;
    }
    setModal(null);
    router.refresh();
  }

  async function confirmDelete() {
    setBusy(true);
    setDeleteError("");
    const res = await adminApi.remove("geofences", toDelete.id);
    setBusy(false);
    if (!res.ok) return setDeleteError(res.message ?? "Gagal menghapus zona.");
    setToDelete(null);
    router.refresh();
  }

  return (
    <AdminShell
      title="Geofencing"
      badge="Spatial Zones"
      description="Pemetaan wilayah geofence aktif untuk pengiriman notifikasi berbasis lokasi (mood, audio, and festival info)."
      actions={
        <>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">
            {zones.filter((z) => z.status === "Aktif").length} dari {zones.length} zona aktif
          </span>
          <button onClick={() => open("create")} className="text-sm bg-canopy-700 text-sand-50 rounded-full px-4 py-2 flex items-center gap-1.5">
            <Plus size={14} /> Tambah Zona
          </button>
        </>
      }
    >
      <AdminCard title="Manajemen Zona Geofence">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink-500 uppercase border-b border-canopy-800/10">
              <th className="pb-2.5 font-medium">Nama Zona</th>
              <th className="pb-2.5 font-medium">Lokasi</th>
              <th className="pb-2.5 font-medium">Luas Wilayah</th>
              <th className="pb-2.5 font-medium">Status</th>
              <th className="pb-2.5 font-medium">Tipe Konten Broadcast</th>
              <th className="pb-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={z.id} className="border-b border-canopy-800/5 last:border-0">
                <td className="py-3 font-medium text-canopy-700">{z.nama}</td>
                <td className="py-3 text-ink-700">{z.lokasi}</td>
                <td className="py-3 text-ink-700">{z.luas}</td>
                <td className="py-3"><StatusPill>{z.status}</StatusPill></td>
                <td className="py-3 text-ink-700">{z.konten}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2.5 text-canopy-700">
                    <button aria-label={`Lihat ${z.nama}`} onClick={() => open("view", z)}><Eye size={15} /></button>
                    <button aria-label={`Edit ${z.nama}`} onClick={() => open("edit", z)}><Pencil size={14} /></button>
                    <button aria-label={`Hapus ${z.nama}`} onClick={() => { setDeleteError(""); setToDelete(z); }}>
                      <Trash2 size={14} className="text-alert-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {zones.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-ink-500">Belum ada zona. Klik &quot;Tambah Zona&quot; untuk membuat.</td></tr>
            )}
          </tbody>
        </table>
      </AdminCard>

      <AdminCard title="Peta Geofencing & Cakupan Notifikasi Wilayah" className="mt-4">
        <AdminMap markers={markers} height={320} zoom={12} />
      </AdminCard>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        wide
        title={modal?.mode === "create" ? "Tambah Zona Geofence" : modal?.mode === "edit" ? "Edit Zona Geofence" : "Detail Zona Geofence"}
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
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><TextInput label="Nama zona" value={form.name} onChange={set("name")} error={errors.name} disabled={readOnly} /></div>
          <TextInput label="Latitude" type="number" step="any" value={form.latitude} onChange={set("latitude")} error={errors.latitude} disabled={readOnly} hint="Contoh: -8.2175" />
          <TextInput label="Longitude" type="number" step="any" value={form.longitude} onChange={set("longitude")} error={errors.longitude} disabled={readOnly} hint="Contoh: 114.3675" />
          <TextInput label="Radius (meter)" type="number" min="1" value={form.radius_meter} onChange={set("radius_meter")} error={errors.radius_meter} disabled={readOnly} />
          <SelectInput label="Koridor terkait" value={form.koridor_id} onChange={set("koridor_id")} error={errors.koridor_id} disabled={readOnly}
            options={[{ value: "", label: "— Tidak ada —" }, ...options.koridors]} />
          <div className="col-span-2">
            <SelectInput label="Audio soundscape" value={form.soundscape_id} onChange={set("soundscape_id")} error={errors.soundscape_id} disabled={readOnly}
              options={[{ value: "", label: "— Tanpa audio (info saja) —" }, ...options.soundscapes]} />
          </div>
          <div className="col-span-2"><TextInput label="Judul sambutan" value={form.welcome_title} onChange={set("welcome_title")} error={errors.welcome_title} disabled={readOnly} /></div>
          <div className="col-span-2"><TextArea label="Deskripsi sambutan" value={form.welcome_desc} onChange={set("welcome_desc")} error={errors.welcome_desc} disabled={readOnly} /></div>
          <div className="col-span-2"><CheckInput label="Zona aktif (notifikasi dikirim ke pengguna)" checked={form.is_active} onChange={set("is_active")} disabled={readOnly} /></div>
        </div>
        {message && <p className="text-sm text-alert-600 mt-4">{message}</p>}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Hapus zona?"
        message={`Zona "${toDelete?.nama}" akan dihapus permanen dan tidak lagi memicu notifikasi di aplikasi pengguna.`}
        busy={busy}
        error={deleteError}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </AdminShell>
  );
}
