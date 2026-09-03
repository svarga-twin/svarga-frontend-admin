import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatCard from "@/components/ui/StatCard";
import LineTrendChart from "@/components/charts/LineTrendChart";
import BarCompareChart from "@/components/charts/BarCompareChart";
import { getMonitoringData } from "@/lib/services/monitoringService";
import { getDashboardSummary } from "@/lib/services/dashboardService";
import { Download, Share2 } from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * Belum ada mockup UI khusus untuk halaman ini dari desainer — dibangun
 * mengikuti gaya visual & pola komponen yang sama dengan halaman admin
 * lainnya supaya tetap konsisten satu sistem.
 */
export default async function LaporanPage() {
  const [monitoring, dashboard] = await Promise.all([getMonitoringData(), getDashboardSummary()]);

  const reports = [
    { name: "Laporan Kualitas Lingkungan — April 2026", size: "2.4 MB" },
    { name: "Laporan Wellbeing Masyarakat — April 2026", size: "1.8 MB" },
    { name: "Laporan Aktivitas Sensor IoT — April 2026", size: "3.1 MB" },
  ];

  return (
    <AdminShell
      title="Laporan & Analitik"
      badge="Ringkasan Bulanan"
      description="Ekspor dan analisis data gabungan lingkungan, wellbeing, dan aktivitas pengguna Svarga."
      actions={
        <button className="text-sm bg-canopy-700 text-sand-50 rounded-full px-4 py-2 flex items-center gap-1.5">
          <Share2 size={14} /> Ekspor Laporan
        </button>
      }
    >
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="Activity" label="Rata-rata AQI Bulanan" value="41" badge="Baik" note="Membaik 6% dari bulan lalu" />
        <StatCard icon="Smile" label="Indeks Wellbeing" value="3.7/5" badge="Stabil" badgeTone="info" note="Konsisten 4 minggu terakhir" />
        <StatCard icon="Users" label="Pengguna Aktif Bulanan" value="6.512" badge="+12%" badgeTone="info" note="Pertumbuhan dari bulan lalu" />
        <StatCard icon="MapPin" label="Kunjungan Zona Hijau" value="18.240" badge="+8%" badgeTone="info" note="Total check-in geofencing" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <AdminCard title="Tren Kualitas Udara — Gabungan Wilayah">
          <LineTrendChart labels={monitoring.aqiTrend7Days.map((r) => r.hari)} series={[{ name: "Banyuwangi", data: monitoring.aqiTrend7Days.map((r) => r.banyuwangi), color: "#3f6e45", showDots: true }]} height={230} />
        </AdminCard>
        <AdminCard title="Aktivitas Pengguna vs Catatan Mood">
          <BarCompareChart
            labels={dashboard.userActivityWeekly.map((r) => r.bulan)}
            series={[
              { name: "Aktif", data: dashboard.userActivityWeekly.map((r) => r.aktif), color: "#3f6e45" },
              { name: "Catatan Mood", data: dashboard.userActivityWeekly.map((r) => r.catatanMood), color: "#d4a039" },
            ]}
            height={230}
          />
        </AdminCard>
      </div>

      <AdminCard title="Laporan Tersedia" className="mt-4">
        <div className="flex flex-col divide-y divide-canopy-800/5">
          {reports.map((r) => (
            <div key={r.name} className="flex items-center justify-between py-3">
              <span className="text-sm text-ink-900">{r.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-500">{r.size}</span>
                <button className="text-xs font-medium text-canopy-700 flex items-center gap-1"><Download size={12} /> Unduh PDF</button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </AdminShell>
  );
}
