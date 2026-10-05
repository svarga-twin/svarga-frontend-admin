import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import { getSensorStats } from "@/lib/services/sensorService";
import { getMoodWellbeing } from "@/lib/services/moodService";
import { getFestivals } from "@/lib/services/eventService";
import { getGeofenceZones } from "@/lib/services/geofenceService";

export const dynamic = "force-dynamic";

// Halaman ini sebelumnya salah — file page.js di root (dashboard)/ ternyata
// meng-import "./NotifikasiClient" (tidak ada di folder ini, hanya ada di
// notifikasi/NotifikasiClient.js) sehingga build Next.js gagal total.
// Ditulis ulang sebagai overview sungguhan: menarik ringkasan dari 4 domain
// yang sudah tersambung ke svarga-backend (Sensor IoT, Mood & Wellbeing,
// Kalender BWI, Geofencing) supaya halaman pertama yang dibuka admin benar-
// benar mencerminkan data yang sama dengan svarga-app.
export default async function DashboardPage() {
  const [sensorStats, mood, festivals, zones] = await Promise.all([
    getSensorStats(),
    getMoodWellbeing(),
    getFestivals(),
    getGeofenceZones(),
  ]);

  const activeZones = zones.filter((z) => z.status === "Aktif");
  const upcomingFestivals = festivals.slice(0, 3);

  return (
    <AdminShell
      title="Dashboard"
      badge="Ringkasan"
      description="Ringkasan kondisi terkini SVARGA: sensor lingkungan, wellbeing warga, festival, dan zona geofencing — semuanya dari sumber data yang sama dengan aplikasi pengguna."
    >
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon="Cpu"
          label="Sensor Aktif"
          value={`${sensorStats.aktif}/${sensorStats.total}`}
          badge={sensorStats.offline > 0 ? `${sensorStats.offline} offline` : "Semua online"}
          badgeTone={sensorStats.offline > 0 ? "warn" : "neutral"}
          note="Suhu & kualitas udara"
        />
        <StatCard
          icon="Smile"
          label="Mood Rata-rata (7 Hari)"
          value={mood.rataRata}
          badge={mood.moodTerbanyak}
          note={`${mood.moodTotalCatatan.toLocaleString("id-ID")} catatan warga`}
        />
        <StatCard
          icon="Calendar"
          label="Event Mendatang"
          value={festivals.length}
          note="Kalender BWI Fest"
        />
        <StatCard
          icon="MapPin"
          label="Zona Geofencing Aktif"
          value={`${activeZones.length}/${zones.length}`}
          note="Audio & info otomatis"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <AdminCard title="Event Terdekat">
          <div className="flex flex-col gap-3">
            {upcomingFestivals.length === 0 && <p className="text-sm text-ink-500">Belum ada event terjadwal.</p>}
            {upcomingFestivals.map((f) => (
              <div key={f.id} className="flex items-center justify-between border-b border-canopy-800/5 last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink-900">{f.name}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{f.date} · {f.location}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Zona Geofencing">
          <div className="flex flex-col gap-3">
            {zones.slice(0, 4).map((z) => (
              <div key={z.id} className="flex items-center justify-between border-b border-canopy-800/5 last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink-900">{z.nama}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{z.lokasi}</p>
                </div>
                <StatusPill>{z.status}</StatusPill>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
