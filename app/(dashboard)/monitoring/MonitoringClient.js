"use client";

import { useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import LineTrendChart from "@/components/charts/LineTrendChart";
import DonutStatChart from "@/components/charts/DonutStatChart";

const tabs = ["Ringkasan", "Kualitas Udara (AQI)", "Suhu", "Kelembapan", "UV Index", "Kebisingan"];

export default function MonitoringClient({ data }) {
  const [tab, setTab] = useState("Ringkasan");

  return (
    <AdminShell
      title="Monitoring Lingkungan"
      badge="Real-time"
      description="Pantauan menyeluruh kondisi lingkungan Banyuwangi dari jaringan sensor IoT."
      actions={
        <>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Banyuwangi Mandiri</span>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Periode: 7 Hari Terakhir</span>
          <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Lokasi: Semua Lokasi</span>
        </>
      }
    >
      <div className="flex items-center gap-1.5 mb-5 bg-white w-fit rounded-full p-1 border border-canopy-800/10 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm px-4 py-2 rounded-full transition-colors ${tab === t ? "bg-canopy-700 text-sand-50" : "text-ink-700 hover:bg-sand-100"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {data.envSummary.map((s) => (
          <StatCard key={s.key} icon={s.icon} label={s.label} value={s.value} badge={s.badge} badgeTone={s.tone} note={s.note} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <AdminCard title="Grafik Kualitas Udara (AQI) - 7 Hari Terakhir" className="col-span-2">
          <LineTrendChart
            labels={data.aqiTrend7Days.map((r) => r.hari)}
            series={[
              { name: "Banyuwangi Kota", data: data.aqiTrend7Days.map((r) => r.banyuwangi), color: "#3e6e8e" },
              { name: "Kalipuro", data: data.aqiTrend7Days.map((r) => r.kalipuro), color: "#2c4a30" },
              { name: "Rogojampi", data: data.aqiTrend7Days.map((r) => r.rogojampi), color: "#d4a039" },
              { name: "Giri", data: data.aqiTrend7Days.map((r) => r.giri), color: "#8b5fbf" },
            ]}
          />
        </AdminCard>

        <AdminCard title="Distribusi Kualitas Udara">
          <div className="flex flex-col items-center">
            <DonutStatChart segments={data.airQualityDistribution} centerValue="25" centerLabel="Titik Sensor" />
            <div className="w-full mt-3 flex flex-col gap-1.5">
              {data.airQualityDistribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="text-ink-700">{d.name} ({d.count} Titik)</span>
                  <span className="font-medium" style={{ color: d.color }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Data Kualitas Udara per Lokasi" className="mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink-500 uppercase border-b border-canopy-800/10">
              <th className="pb-2.5 font-medium">Lokasi</th>
              <th className="pb-2.5 font-medium">AQI</th>
              <th className="pb-2.5 font-medium">Status</th>
              <th className="pb-2.5 font-medium">Suhu</th>
              <th className="pb-2.5 font-medium">Update Terakhir</th>
              <th className="pb-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.locationAirQuality.map((l) => (
              <tr key={l.lokasi} className="border-b border-canopy-800/5 last:border-0">
                <td className="py-3 font-medium text-ink-900">{l.lokasi}</td>
                <td className="py-3 text-ink-700">{l.aqi}</td>
                <td className="py-3"><StatusPill>{l.status}</StatusPill></td>
                <td className="py-3 text-ink-700">{l.suhu}</td>
                <td className="py-3 text-ink-500">{l.update}</td>
                <td className="py-3"><button className="text-canopy-700 font-medium">Detail</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </AdminShell>
  );
}
