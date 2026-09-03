"use client";

import { useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import * as Icons from "lucide-react";

const tabs = ["Profil", "Aplikasi", "Sensor IoT", "Geofencing", "Notifikasi", "Integrasi"];

export default function PengaturanClient({ integrations }) {
  const [tab, setTab] = useState("Integrasi");

  return (
    <AdminShell
      title="Pengaturan"
      badge="10 Mei 2026"
      description="Kelola preferensi sistem, data sensor, integrasi modul eksternal, dan konfigurasi data backup."
      actions={<span className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700">Banyuwangi Mandiri</span>}
    >
      <div className="flex items-center gap-5 border-b border-canopy-800/10 mb-5 flex-wrap">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`text-sm pb-3 -mb-px border-b-2 transition-colors ${tab === t ? "border-canopy-700 text-canopy-700 font-medium" : "border-transparent text-ink-500"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-3.5">
          {integrations.map((i) => {
            const IIcon = Icons[i.icon] ?? Icons.Settings;
            return (
              <AdminCard key={i.key}>
                <div className="flex items-center gap-3.5 flex-wrap">
                  <span className="h-11 w-11 rounded-xl bg-canopy-100 text-canopy-700 flex items-center justify-center shrink-0">
                    <IIcon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink-900">{i.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{i.desc}</p>
                  </div>
                  <span className={`text-xs font-medium rounded-full px-2.5 py-1 shrink-0 ${i.connected ? "bg-canopy-100 text-canopy-700" : "bg-alert-100 text-alert-600"}`}>
                    {i.connected ? "Terhubung" : "Terputus"}
                  </span>
                  <button className="text-xs font-medium border border-canopy-800/15 rounded-full px-3.5 py-1.5 shrink-0">Kelola</button>
                </div>
              </AdminCard>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <AdminCard title="Informasi Sistem">
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-ink-500">Versi Aplikasi</span><span className="font-medium text-ink-900">v1.0.0</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-500">Terakhir Update</span><span className="font-medium text-ink-900">10 Mei 2026 09:30</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-500">Bahasa Utama</span><span className="font-medium text-ink-900">Bahasa Indonesia</span></div>
              <div className="flex items-center justify-between"><span className="text-ink-500">Zona Waktu</span><span className="font-medium text-ink-900">WIB (UTC+7)</span></div>
            </div>
          </AdminCard>

          <AdminCard title="Backup & Data">
            <p className="text-sm text-ink-500">Backup Terakhir</p>
            <p className="font-semibold text-ink-900 mt-1">10 Mei 2026, 01:00 WIB</p>
            <button className="w-full mt-4 bg-alert-600 text-white rounded-xl py-3 font-medium">Backup Sekarang</button>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
