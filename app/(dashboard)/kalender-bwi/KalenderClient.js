"use client";

import { useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";

const days = ["S", "S", "R", "K", "J", "S", "M"];

export default function KalenderClient({ festivals }) {
  const [selected, setSelected] = useState(festivals[0]);
  const highlightDates = festivals.map((f) => Number(f.date.match(/^(\d+)/)?.[1] ?? 0));

  return (
    <AdminShell
      title="Kalender Festival BWI"
      badge="Kalender Event"
      description="Pusat informasi agenda festival budaya dan pariwisata Banyuwangi."
      actions={<span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Banyuwangi Mandiri</span>}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Kategori: Semua Kategori</span>
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
              {festivals.map((f) => (
                <button key={f.id} onClick={() => setSelected(f)} className={`flex items-center gap-3 text-left rounded-xl p-1.5 -mx-1.5 ${selected.id === f.id ? "bg-canopy-100" : ""}`}>
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

        <AdminCard title={selected.name} className="col-span-2">
          <div className="w-full h-56 rounded-xl bg-gradient-to-br from-canopy-200 via-ochre-100 to-canopy-100 flex items-center justify-center">
            <Calendar size={40} className="text-canopy-700/40" />
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-700 mt-4">
            <Calendar size={15} className="text-canopy-700" />
            {selected.date}{selected.startTime ? `, ${selected.startTime} - ${selected.endTime} WIB` : ""}
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-700 mt-1.5">
            <MapPin size={15} className="text-canopy-700" />
            {selected.routeInfo ?? selected.location}
          </div>

          <p className="text-sm text-ink-500 leading-relaxed mt-4">{selected.description}</p>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-sand-100 rounded-xl p-3">
              <p className="text-xs text-ink-500">Rute Terkait</p>
              <p className="font-semibold text-ink-900 mt-1">{selected.routeCount ?? "-"} Rute Hijau</p>
            </div>
            <div className="bg-sand-100 rounded-xl p-3">
              <p className="text-xs text-ink-500">Notifikasi Terkirim</p>
              <p className="font-semibold text-ink-900 mt-1">{selected.notifSent?.toLocaleString("id-ID") ?? "-"} Warga</p>
            </div>
            <div className="bg-sand-100 rounded-xl p-3">
              <p className="text-xs text-ink-500">UMKM Terlibat</p>
              <p className="font-semibold text-ink-900 mt-1">{selected.umkmCount ?? "-"} Usaha</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button className="bg-canopy-700 text-sand-50 rounded-full px-5 py-2.5 text-sm font-medium">Kelola Event</button>
            <button className="bg-sand-100 text-ink-700 rounded-full px-5 py-2.5 text-sm font-medium">Lihat Semua Event</button>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
