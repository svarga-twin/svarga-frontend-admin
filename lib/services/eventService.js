import { USE_LARAVEL_API } from "@/lib/config";
import { fetchLaravel } from "@/lib/laravelClient";
import { upcomingFestivals } from "@/lib/data/mockAdminData";

export async function getFestivals() {
  if (USE_LARAVEL_API) {
    // ?all=1 supaya event nonaktif juga terlihat di halaman admin (endpoint
    // publik tanpa ini cuma mengembalikan yang aktif, dipakai svarga-app).
    const events = await fetchLaravel("/festivals?all=1&per_page=100");
    return events.map((e) => ({
      id: e.id,
      name: e.bfest_name,
      date: e.date
        ? new Date(e.date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
        : "-",
      rawDate: e.date, // format YYYY-MM-DD, dipakai <input type="date"> di form edit
      location: e.address ?? e.location_name ?? "-",
      locationName: e.location_name ?? "",
      category: e.category,
      description: e.description ?? "",
      startTime: e.start_time,
      endTime: e.end_time,
      routeInfo: e.address ?? e.location_name ?? "-",
      image: e.image,
      isActive: e.is_active,
      // Metrik keterlibatan (routeCount/notifSent/umkmCount) belum dilacak di
      // svarga-backend — ditampilkan 0 apa adanya, bukan angka karangan,
      // sampai ada fitur yang benar-benar menghitungnya (mis. dari data
      // mood_logs/geofence per festival).
      routeCount: 0,
      notifSent: 0,
      umkmCount: 0,
    }));
  }

  return upcomingFestivals.map((f) => ({
    ...f,
    description:
      "Event kolosal ini akan menampilkan ratusan peraga busana kontemporer berbasis budaya adat yang ramah lingkungan dan terintegrasi dengan sensor kesehatan Smart Green Route.",
    startTime: "08:00", endTime: "15:00",
    routeInfo: "Lorong Taman Blambangan - Kantor Bupati",
    routeCount: 3, notifSent: 8245, umkmCount: 120,
  }));
}
