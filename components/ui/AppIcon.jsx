"use client";

// Wrapper di sekeliling lucide-react, supaya ikon bisa diganti pakai
// gambar sendiri (lewat lib/customIcons.js) tanpa perlu ubah import di
// setiap halaman yang pakai ikon. Semua import dari "lucide-react" di
// project ini diarahkan ke file ini.
//
// Mendukung 2 pola pemakaian yang sudah ada di codebase:
//   import { Plus, Eye } from "@/components/ui/AppIcon"        (named)
//   import Icons from "@/components/ui/AppIcon"; Icons["Cpu"]  (dinamis,
//                                                   mis. StatCard.jsx,
//                                                   NotifikasiClient.js,
//                                                   PengaturanClient.js)
//
// CATATAN SAAT MENAMBAH IKON BARU: kalau nanti ada halaman baru yang
// mengimpor ikon lucide-react yang belum ada di daftar "export const" di
// bawah, tambahkan baris exportnya di sini juga (format sama persis) --
// named export di JS harus statis, tidak bisa otomatis.

import * as Lucide from "lucide-react";
import { customIcons } from "@/lib/customIcons";

function wrap(name, LucideCmp) {
  function AppIconComponent({ size = 20, className = "", ...rest }) {
    const src = customIcons[name];
    if (src) {
      return (
        <img
          src={src}
          width={size}
          height={size}
          className={className}
          style={{ objectFit: "contain", display: "inline-block" }}
          alt=""
        />
      );
    }
    if (!LucideCmp) return null;
    return <LucideCmp size={size} className={className} {...rest} />;
  }
  AppIconComponent.displayName = `AppIcon(${name})`;
  return AppIconComponent;
}

// Proxy: ikon apa pun yang diakses (baik lewat named export di bawah,
// maupun lewat Icons["NamaDinamis"]) otomatis kena cek customIcons dulu.
//
// Disalin dulu ke object biasa (bukan di-Proxy langsung di atas `Lucide`):
// property pada namespace object hasil `import * as X` itu non-configurable
// menurut spec ES module, sedangkan Proxy WAJIB mengembalikan nilai yang
// sama persis dengan target untuk property non-configurable -- Proxy di
// atas object biasa tidak kena batasan itu.
const LucideCopy = { ...Lucide };
const cache = {};
const proxy = new Proxy(LucideCopy, {
  get(target, prop) {
    if (!cache[prop]) cache[prop] = wrap(prop, target[prop]);
    return cache[prop];
  },
});

export default proxy;

// Named export eksplisit untuk setiap ikon yang dipakai lewat
// `import { X } from "lucide-react"` di seluruh project.
export const Activity = proxy.Activity;
export const BarChart3 = proxy.BarChart3;
export const Bell = proxy.Bell;
export const Bike = proxy.Bike;
export const Calendar = proxy.Calendar;
export const Car = proxy.Car;
export const CheckCheck = proxy.CheckCheck;
export const CheckCircle2 = proxy.CheckCircle2;
export const ChevronLeft = proxy.ChevronLeft;
export const ChevronRight = proxy.ChevronRight;
export const Clock = proxy.Clock;
export const Cpu = proxy.Cpu;
export const Download = proxy.Download;
export const Eye = proxy.Eye;
export const Footprints = proxy.Footprints;
export const LayoutDashboard = proxy.LayoutDashboard;
export const Leaf = proxy.Leaf;
export const LogOut = proxy.LogOut;
export const Map = proxy.Map;
export const MapIcon = proxy.MapIcon;
export const MapPin = proxy.MapPin;
export const Navigation = proxy.Navigation;
export const Pencil = proxy.Pencil;
export const Plus = proxy.Plus;
export const Search = proxy.Search;
export const Settings = proxy.Settings;
export const Share2 = proxy.Share2;
export const Smile = proxy.Smile;
export const Sun = proxy.Sun;
export const Trash2 = proxy.Trash2;
export const Users = proxy.Users;
export const Volume2 = proxy.Volume2;
export const X = proxy.X;
