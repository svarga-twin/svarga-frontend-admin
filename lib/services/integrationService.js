import { USE_LARAVEL_API } from "@/lib/config";
import { integrationSettings } from "@/lib/data/mockAdminData";

/**
 * Status "Terhubung" untuk kartu integrasi di halaman Pengaturan. Empat
 * integrasi ini (Kalender Festival BWI, Sensor IoT, Geofencing) SECARA
 * HARFIAH adalah Laravel yang sama dipakai svarga-app — jadi statusnya
 * literal `USE_LARAVEL_API`, bukan baris konfigurasi terpisah di database.
 * Integrasi Email belum ada di Laravel sama sekali, jadi selalu
 * ditampilkan belum terhubung sampai fitur itu dibuat.
 */
export async function getIntegrations() {
  return integrationSettings.map((setting) => ({
    ...setting,
    connected: setting.key === "email" ? false : USE_LARAVEL_API,
  }));
}
