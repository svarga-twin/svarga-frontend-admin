import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatusPill from "@/components/ui/StatusPill";
import AdminMap from "@/components/maps/AdminMap";
import { getGeofenceZones } from "@/lib/services/geofenceService";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GeofencingPage() {
  const zones = await getGeofenceZones();
  const markers = zones.map((z) => ({ id: z.id, label: z.nama, note: `${z.status} • ${z.konten}`, lat: z.lat, lng: z.lng }));

  return (
    <AdminShell
      title="Geofencing"
      badge="Spatial Zones"
      description="Pemetaan wilayah geofence aktif untuk pengiriman notifikasi berbasis lokasi (mood, audio, and festival info)."
      actions={
        <>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Periode: 10 Maret 2026</span>
          <button className="text-sm bg-canopy-700 text-sand-50 rounded-full px-4 py-2 flex items-center gap-1.5">
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
                <td className="py-3 flex items-center gap-2.5 text-canopy-700">
                  <Eye size={15} /><Pencil size={14} /><Trash2 size={14} className="text-alert-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>

      <AdminCard title="Peta Geofencing & Cakupan Notifikasi Wilayah" className="mt-4">
        <AdminMap markers={markers} height={320} zoom={12} />
      </AdminCard>
    </AdminShell>
  );
}
