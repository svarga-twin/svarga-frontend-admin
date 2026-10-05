import { USE_MOCK, USE_LARAVEL_API } from "@/lib/config";
import { fetchLaravelAdmin } from "@/lib/laravelClient";
import { adminNotifications } from "@/lib/data/mockAdminData";

export async function getNotifications() {
  if (USE_LARAVEL_API) {
    const json = await fetchLaravelAdmin("/admin/notifications?per_page=20");
    return {
      notifications: json.data.map((n) => ({ ...n, time: new Date(n.time).toLocaleString("id-ID") })),
      total: json.total,
      belumDibaca: json.belum_dibaca,
      hariIni: json.hari_ini,
    };
  }

  if (USE_MOCK) {
    return { notifications: adminNotifications, total: 1245, belumDibaca: 28, hariIni: 12 };
  }

  return { notifications: adminNotifications, total: adminNotifications.length, belumDibaca: 0, hariIni: 0 };
}

export async function markAllAsRead() {
  if (USE_LARAVEL_API) {
    await fetchLaravelAdmin("/admin/notifications/mark-read", { method: "POST" });
    return { ok: true };
  }

  return { ok: true };
}
