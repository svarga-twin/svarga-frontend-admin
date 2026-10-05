import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatCard from "@/components/ui/StatCard";
import LineTrendChart from "@/components/charts/LineTrendChart";
import DonutStatChart from "@/components/charts/DonutStatChart";
import { getMoodWellbeing } from "@/lib/services/moodService";
import { Plus } from "@/components/ui/AppIcon";

export const dynamic = "force-dynamic";

export default async function MoodWellbeingPage() {
  const d = await getMoodWellbeing();

  return (
    <AdminShell
      title="Mood & Wellbeing"
      badge="Real-time Analitik"
      description="Laporan emosi, indeks kebahagiaan, dan analisis korelasi kesejahteraan warga terhadap iklim lingkungan."
      actions={
        <>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Banyuwangi Mandiri</span>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Periode: 7 Hari Terakhir</span>
          <button className="text-sm bg-info-600 text-white rounded-full px-4 py-2 flex items-center gap-1.5">
            <Plus size={14} /> Daftar Laporan
          </button>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        <AdminCard
          title="Tren Kondisi Mood Masyarakat"
          className="col-span-2"
          badge={
            <span className="flex items-center gap-3 text-xs text-ink-500 ml-2 flex-wrap">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-canopy-800" />Sangat Baik</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-canopy-600" />Baik</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-info-600" />Biasa Saja</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-ochre-500" />Buruk</span>
            </span>
          }
        >
          <LineTrendChart
            labels={d.moodTrend7Days.map((r) => r.hari)}
            series={[
              { name: "Sangat Baik", data: d.moodTrend7Days.map((r) => r.sangatBaik), color: "#2c4a30", showDots: true },
              { name: "Baik", data: d.moodTrend7Days.map((r) => r.baik), color: "#4b7750", showDots: true },
              { name: "Biasa Saja", data: d.moodTrend7Days.map((r) => r.biasa), color: "#3e6e8e", showDots: true },
              { name: "Buruk", data: d.moodTrend7Days.map((r) => r.buruk), color: "#d4a039", showDots: true },
            ]}
          />
        </AdminCard>

        <AdminCard title="Distribusi Mood">
          <div className="flex flex-col items-center">
            <DonutStatChart segments={d.moodDistribution} centerValue={d.moodTotalCatatan.toLocaleString("id-ID")} centerLabel="Catatan" />
            <div className="w-full mt-3 flex flex-col gap-1.5">
              {d.moodDistribution.map((m) => (
                <div key={m.name} className="flex items-center justify-between text-xs">
                  <span className="text-ink-700">{m.name} ({m.value}%)</span>
                  <span className="font-medium" style={{ color: m.color }}>{m.count.toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        <StatCard icon="Smile" label="Rata-rata Mood Harian" value={d.rataRata} badge="Baik" note="Kondisi psikologis kolektif" />
        <StatCard icon="BookOpen" label="Total Catatan Mood" value={d.moodTotalCatatan.toLocaleString("id-ID")} badge="+18.4%" badgeTone="info" note="Sumbangan data dari masyarakat" />
        <StatCard icon="Activity" label="Pengguna Mencatat IoT" value="2.145" badge="+15.7%" badgeTone="info" note="Konsistensi perekaman harian" />
        <StatCard icon="TrendingUp" label="Mood Terbanyak" value={d.moodTerbanyak} badge="36%" note="Didominasi emosi stabil & positif" />
      </div>
    </AdminShell>
  );
}
