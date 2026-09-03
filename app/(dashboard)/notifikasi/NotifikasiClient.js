"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/layout/AdminShell";
import AdminCard from "@/components/ui/AdminCard";
import StatCard from "@/components/ui/StatCard";
import * as Icons from "lucide-react";
import { CheckCheck } from "lucide-react";

const filters = ["Semua", "lingkungan", "festival", "sensor", "pengguna"];
const filterLabel = { Semua: "Semua", lingkungan: "Lingkungan", festival: "Festival", sensor: "Sensor", pengguna: "Pengguna" };

const toneBg = {
  danger: "bg-alert-100 text-alert-600",
  warn: "bg-ochre-100 text-ochre-600",
  info: "bg-info-100 text-info-600",
  neutral: "bg-canopy-100 text-canopy-700",
};

const channelToggles = [
  { key: "push", label: "Notifikasi Push", desc: "Terima instan di browser/web panel", on: true },
  { key: "email", label: "Email Berita", desc: "Ringkasan harian kualitas lingkungan", on: true },
  { key: "sms", label: "Pesan SMS (Alert)", desc: "Hanya untuk peringatan kritis Rogojampi", on: false },
];
const categoryToggles = [
  { key: "udara", label: "Kualitas Udara & Lingkungan", desc: "AQI kritis, indeks UV tinggi", on: true },
  { key: "iot", label: "Pemantauan Perangkat IoT", desc: "Sensor mati, butuh kalibrasi perangkat", on: true },
  { key: "user", label: "Pendaftaran Pengguna Baru", desc: "Pemberitahuan pendaftaran massal", on: false },
  { key: "geo", label: "Geofencing Wisata", desc: "Update kepadatan area Taman Blambangan", on: true },
];

function Toggle({ on }) {
  return (
    <span className={`inline-flex h-6 w-11 rounded-full p-0.5 transition-colors ${on ? "bg-canopy-700" : "bg-sand-200"}`}>
      <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </span>
  );
}

export default function NotifikasiClient({ data }) {
  const router = useRouter();
  const [filter, setFilter] = useState("Semua");
  const filtered = filter === "Semua" ? data.notifications : data.notifications.filter((n) => n.kategori === filter);

  async function handleMarkAllRead() {
    await fetch("/api/notifications/mark-read", { method: "POST" });
    router.refresh();
  }

  return (
    <AdminShell
      title="Notifikasi"
      badge="10 Mei 2026"
      description="Pantau peringatan sistem, status sensor IoT, laporan geofencing, dan aktivitas warga secara real-time."
      actions={
        <button onClick={handleMarkAllRead} className="text-sm bg-white border border-canopy-800/10 rounded-full px-4 py-2 text-ink-700 flex items-center gap-1.5">
          <CheckCheck size={14} /> Tandai Semua Dibaca
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="Bell" label="Total Notifikasi" value={data.total.toLocaleString("id-ID")} note="Akumulasi seluruh log notifikasi" />
        <StatCard icon="AlertCircle" label="Belum Dibaca" value={data.belumDibaca} note="Butuh perhatian segera" badge="Baru" badgeTone="danger" />
        <StatCard icon="Clock" label="Notifikasi Hari Ini" value={data.hariIni} note="Pembaruan masuk sejak pukul 00:00" />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`text-sm px-4 py-1.5 rounded-full border ${filter === f ? "bg-canopy-700 text-sand-50 border-canopy-700" : "border-canopy-800/10 text-ink-700"}`}>
                {filterLabel[f]}
              </button>
            ))}
          </div>

          <AdminCard>
            <div className="flex flex-col divide-y divide-canopy-800/5">
              {filtered.map((n) => {
                const NIcon = Icons[n.icon] ?? Icons.Bell;
                return (
                  <div key={n.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                    <span className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${toneBg[n.tone]}`}>
                      <NIcon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-canopy-700">{n.title}</p>
                        <span className="text-xs text-ink-500 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-ink-500 mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                    {n.unread && <span className="h-2 w-2 rounded-full bg-canopy-700 mt-1.5 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </AdminCard>
        </div>

        <AdminCard title="Pengaturan Notifikasi">
          <p className="text-xs text-ink-500 -mt-2 mb-4">Kelola bagaimana dan di mana Anda menerima pesan alert sistem.</p>
          <p className="text-[0.65rem] font-medium text-ink-500 uppercase tracking-wide mb-2">Saluran Notifikasi</p>
          <div className="flex flex-col gap-3.5 mb-5">
            {channelToggles.map((t) => (
              <div key={t.key} className="flex items-center justify-between gap-2">
                <div><p className="text-sm font-medium text-ink-900">{t.label}</p><p className="text-xs text-ink-500">{t.desc}</p></div>
                <Toggle on={t.on} />
              </div>
            ))}
          </div>
          <p className="text-[0.65rem] font-medium text-ink-500 uppercase tracking-wide mb-2">Kategori Berlangganan</p>
          <div className="flex flex-col gap-3.5">
            {categoryToggles.map((t) => (
              <div key={t.key} className="flex items-center justify-between gap-2">
                <div><p className="text-sm font-medium text-ink-900">{t.label}</p><p className="text-xs text-ink-500">{t.desc}</p></div>
                <Toggle on={t.on} />
              </div>
            ))}
          </div>
          <button className="w-full mt-5 bg-canopy-700 text-sand-50 rounded-xl py-3 font-medium">Simpan Konfigurasi</button>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
