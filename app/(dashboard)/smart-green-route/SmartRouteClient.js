"use client";

import { useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import AdminMap from "@/components/maps/AdminMap";
import { Navigation, CheckCircle2, MapIcon, Clock, Activity, Volume2, Sun, Footprints, Bike, Car } from "@/components/ui/AppIcon";

const modes = [
  { id: "jalan", icon: Footprints },
  { id: "sepeda", icon: Bike },
  { id: "mobil", icon: Car },
];

export default function SmartRouteClient({ choices }) {
  const [selected, setSelected] = useState(choices[0]?.id);
  const [mode, setMode] = useState("jalan");

  const start = { id: "start", label: "Alun-Alun Banyuwangi", note: "Titik awal", lat: -8.2145, lng: 114.3691 };
  const end = { id: "end", label: "Pantai Boom Banyuwangi", note: "Titik tujuan", lat: -8.2298, lng: 114.3822 };

  return (
    <AdminShell
      title="Smart Green Route"
      badge="Smart Navigation"
      description="Navigasi ramah lingkungan berdasarkan kualitas udara, tingkat keteduhan, dan tingkat kebisingan kota."
    >
      <div className="grid grid-cols-3 gap-4">
        <AdminCard title="Cari Rute Hijau">
          <label className="text-xs font-medium text-ink-700">Titik Awal</label>
          <input defaultValue={start.label} className="w-full mt-1.5 mb-3 bg-sand-100 rounded-xl px-3.5 py-2.5 text-sm outline-none" />
          <label className="text-xs font-medium text-ink-700">Titik Tujuan</label>
          <input defaultValue={end.label} className="w-full mt-1.5 mb-3 bg-sand-100 rounded-xl px-3.5 py-2.5 text-sm outline-none" />
          <label className="text-xs font-medium text-ink-700">Mode Transportasi</label>
          <div className="grid grid-cols-3 gap-2 mt-1.5 mb-3">
            {modes.map((m) => {
              const MIcon = m.icon;
              return (
                <button key={m.id} onClick={() => setMode(m.id)} className={`py-2.5 rounded-xl border flex items-center justify-center ${mode === m.id ? "border-canopy-700 bg-canopy-100 text-canopy-700" : "border-canopy-800/10 text-ink-500"}`}>
                  <MIcon size={16} />
                </button>
              );
            })}
          </div>
          <label className="text-xs font-medium text-ink-700">Prioritas Rute</label>
          <select className="w-full mt-1.5 mb-4 bg-sand-100 rounded-xl px-3.5 py-2.5 text-sm outline-none">
            <option>Prioritas: Rute Terbersih</option>
          </select>
          <button className="w-full bg-canopy-700 text-sand-50 rounded-xl py-3 font-medium flex items-center justify-center gap-2">
            <Navigation size={15} /> Cari Rute
          </button>
        </AdminCard>

        <div className="rounded-2xl overflow-hidden border border-canopy-800/10 h-[420px]">
          <AdminMap markers={[start, end]} height={420} zoom={13} center={{ lat: -8.222, lng: 114.375 }} />
        </div>

        <AdminCard title="Pilihan Rute Tersedia">
          <div className="flex flex-col gap-2.5">
            {choices.map((r) => (
              <button key={r.id} onClick={() => setSelected(r.id)} className={`text-left rounded-xl border p-3 ${selected === r.id ? "border-canopy-700 bg-canopy-100" : "border-canopy-800/10"}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink-900">{r.label}</p>
                  {r.recommended && <CheckCircle2 size={16} className="text-canopy-700" />}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-ink-500">
                  <span>{r.km} • Estimasi {r.menit} mnt</span>
                  <span className="text-canopy-700 font-medium">AQI {r.aqi}</span>
                </div>
              </button>
            ))}
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Detail Parameter Rute Terbersih (Rekomendasi)" className="mt-4">
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-sand-100 rounded-xl p-3"><p className="text-xs text-ink-500 flex items-center gap-1.5"><MapIcon size={13} />Jarak Tempuh</p><p className="font-semibold text-ink-900 mt-1">2.4 km</p></div>
          <div className="bg-sand-100 rounded-xl p-3"><p className="text-xs text-ink-500 flex items-center gap-1.5"><Clock size={13} />Estimasi Waktu</p><p className="font-semibold text-ink-900 mt-1">35 menit</p></div>
          <div className="bg-sand-100 rounded-xl p-3"><p className="text-xs text-ink-500 flex items-center gap-1.5"><Activity size={13} />Kualitas Udara</p><p className="font-semibold text-ink-900 mt-1">AQI 38 (Baik)</p></div>
          <div className="bg-sand-100 rounded-xl p-3"><p className="text-xs text-ink-500 flex items-center gap-1.5"><Volume2 size={13} />Tingkat Kebisingan</p><p className="font-semibold text-ink-900 mt-1">48 dB (Tenang)</p></div>
          <div className="bg-sand-100 rounded-xl p-3"><p className="text-xs text-ink-500 flex items-center gap-1.5"><Sun size={13} />Tingkat Keteduhan</p><p className="font-semibold text-ink-900 mt-1">76% (Sangat Rindang)</p></div>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
