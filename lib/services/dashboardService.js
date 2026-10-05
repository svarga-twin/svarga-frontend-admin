import { USE_LARAVEL_API } from "@/lib/config";
import { fetchLaravelAdmin } from "@/lib/laravelClient";
import { userActivityWeekly } from "@/lib/data/mockAdminData";

/**
 * Cuma dipakai app/(dashboard)/laporan/page.js untuk grafik "Aktivitas
 * Pengguna vs Catatan Mood" (field `userActivityWeekly`, walau namanya
 * "weekly" isinya sebenarnya bulanan — penamaan lama, dibiarkan supaya
 * konsumennya tidak perlu berubah). Dashboard utama (app/(dashboard)/page.js)
 * TIDAK lagi memakai service ini — lihat komentar di file itu.
 */
export async function getDashboardSummary() {
  if (USE_LARAVEL_API) {
    const json = await fetchLaravelAdmin("/admin/activity-monthly?months=5");
    return { userActivityWeekly: json.data.map((m) => ({ bulan: m.bulan, aktif: m.aktif, catatanMood: m.catatan_mood })) };
  }

  return { userActivityWeekly };
}
