import { USE_LARAVEL_API, LARAVEL_API_BASE } from "@/lib/config";
import { sensorListAdmin } from "@/lib/data/mockAdminData";

const SENSOR_TYPE_LABEL = { temperature: "Suhu", air_quality: "Kualitas Udara" };

/**
 * Sesuai uji coba sensor di svarga-backend (lihat SensorReadingController),
 * baru 2 jenis sensor yang benar-benar tersambung ke alur sensor -> BE -> DB
 * sungguhan: suhu & kualitas udara. Mode Laravel di bawah ini SENGAJA hanya
 * menampilkan 2 baris itu (bukan mengarang jaringan 126 sensor seperti data
 * contoh) — begitu ESP32 tambahan didaftarkan dengan sensor_type baru,
 * tinggal ditambah ke SENSOR_TYPES di sini.
 */
const SENSOR_TYPES = ["temperature", "air_quality"];

export async function getSensorList() {
  if (USE_LARAVEL_API) {
    const rows = await Promise.all(
      SENSOR_TYPES.map(async (type) => {
        // Dipanggil manual (bukan lewat fetchLaravel) karena butuh field
        // `is_stale` yang ada satu level di atas `data` pada envelope respons.
        const res = await fetch(`${LARAVEL_API_BASE}/sensors/latest?sensor_type=${type}`, { cache: "no-store" });
        const json = await res.json();
        return { type, reading: json.data, isStale: json.is_stale };
      })
    );
    return rows.map(({ type, reading, isStale }) => ({
      id: type,
      nama: `${SENSOR_TYPE_LABEL[type]} - ${reading?.device_code ?? "Belum ada data"}`,
      lokasi: reading?.koridor_id ? `Koridor ${reading.koridor_id}` : "-",
      jenis: SENSOR_TYPE_LABEL[type],
      status: !reading ? "Belum Pernah Kirim" : isStale ? "Offline" : "Aktif",
      update: reading?.recorded_at ? new Date(reading.recorded_at).toLocaleString("id-ID") : "-",
    }));
  }

  return sensorListAdmin;
}

export async function getSensorStats() {
  const list = await getSensorList();
  const total = list.length;
  const aktif = list.filter((s) => s.status === "Aktif").length;
  const offline = total - aktif;
  return { total, aktif, offline };
}
