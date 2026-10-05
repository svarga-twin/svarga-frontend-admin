"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Activity, Navigation, Calendar, Cpu, Smile, MapPin,
  BarChart3, Users, Bell, Settings, Leaf, LogOut,
} from "@/components/ui/AppIcon";

const menu = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/monitoring", icon: Activity, label: "Monitoring Lingkungan" },
  { href: "/smart-green-route", icon: Navigation, label: "Smart Green Route" },
  { href: "/kalender-bwi", icon: Calendar, label: "Kalender Festival BWI" },
  { href: "/sensor-iot", icon: Cpu, label: "Sensor IoT" },
  { href: "/mood-wellbeing", icon: Smile, label: "Mood & Wellbeing" },
  { href: "/geofencing", icon: MapPin, label: "Geofencing" },
  { href: "/laporan", icon: BarChart3, label: "Laporan & Analitik" },
  { href: "/pengguna", icon: Users, label: "Pengguna" },
  { href: "/notifikasi", icon: Bell, label: "Notifikasi" },
  { href: "/pengaturan", icon: Settings, label: "Pengaturan" },
];

export default function Sidebar({ adminName, adminRole }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 bg-canopy-700 text-sand-50 flex flex-col h-dvh sticky top-0">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <span className="h-9 w-9 rounded-2xl bg-white text-canopy-700 flex items-center justify-center shrink-0">
          <Leaf size={19} />
        </span>
        <div className="leading-tight">
          <p className="font-display font-bold text-lg tracking-wide">SVARGA</p>
          <p className="text-[0.6rem] text-sand-100/70 tracking-widest">BANYUWANGI</p>
        </div>
      </div>
      <div className="h-px bg-white/10 mx-5" />

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {menu.map((m) => {
          const isActive = pathname === m.href;
          const ItemIcon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive ? "bg-white text-canopy-800 font-medium" : "text-sand-100/85 hover:bg-white/10"
              }`}
            >
              <ItemIcon size={17} />
              {m.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mx-3 mb-5 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-left"
      >
        <span className="leading-tight">
          <span className="block text-sm font-medium">{adminName}</span>
          <span className="block text-[0.65rem] text-sand-100/70">{adminRole}</span>
        </span>
        <LogOut size={16} />
      </button>
    </aside>
  );
}
