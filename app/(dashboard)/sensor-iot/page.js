import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import { getSensorList, getSensorStats } from "@/lib/services/sensorService";
import { Eye, Pencil, Plus, Map } from "@/components/ui/AppIcon";

export const dynamic = "force-dynamic";

export default async function SensorIotPage() {
  const [list, stats] = await Promise.all([getSensorList(), getSensorStats()]);

  return (
    <AdminShell
      title="Sensor IoT"
      badge="Live Network"
      description="Manajemen dan monitoring status sensor IoT Svarga di seluruh wilayah Banyuwangi."
      actions={
        <>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Lokasi: Semua Lokasi</span>
          <button className="text-sm bg-canopy-700 text-sand-50 rounded-full px-4 py-2 flex items-center gap-1.5">
            <Plus size={14} /> Tambah Sensor
          </button>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="Settings2" label="Total Sensor" value={stats.total} badge="Sistem" badgeTone="info" note="Terdistribusi di 5 Kecamatan" />
        <StatCard icon="CheckCircle2" label="Sensor Aktif" value={stats.aktif} badge={`${((stats.aktif / stats.total) * 100).toFixed(1)}%`} note="Berjalan dengan optimal" />
        <StatCard icon="WifiOff" label="Sensor Offline" value={stats.offline} badge="Siaga" badgeTone="warn" note="Butuh re-koneksi segera" />
        <StatCard icon="Wrench" label="Perlu Perbaikan" value="3" badge="Urgent" badgeTone="danger" note="Penjadwalan teknisi hari ini" />
      </div>

      <AdminCard title="Daftar Sensor Aktif & Offline" className="mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink-500 uppercase border-b border-canopy-800/10">
              <th className="pb-2.5 font-medium">Nama Sensor</th>
              <th className="pb-2.5 font-medium">Lokasi</th>
              <th className="pb-2.5 font-medium">Jenis Sensor</th>
              <th className="pb-2.5 font-medium">Status</th>
              <th className="pb-2.5 font-medium">Update Terakhir</th>
              <th className="pb-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-b border-canopy-800/5 last:border-0">
                <td className="py-3 font-medium text-canopy-700">{s.nama}</td>
                <td className="py-3 text-ink-700">{s.lokasi}</td>
                <td className="py-3 text-ink-700">{s.jenis}</td>
                <td className="py-3"><StatusPill>{s.status}</StatusPill></td>
                <td className="py-3 text-ink-500">{s.update}</td>
                <td className="py-3 flex items-center gap-2.5 text-canopy-700">
                  <Eye size={15} /><Pencil size={14} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>

      <div className="text-center mt-5">
        <button className="text-sm text-canopy-700 font-medium flex items-center gap-1.5 mx-auto">
          <Map size={15} /> Lihat Peta Sensor Geografis
        </button>
      </div>
    </AdminShell>
  );
}
