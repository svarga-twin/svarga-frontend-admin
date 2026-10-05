import { USE_LARAVEL_API } from "@/lib/config";
import { fetchLaravel, fetchLaravelAdmin } from "@/lib/laravelClient";
import { geofenceZonesAdmin } from "@/lib/data/mockAdminData";

/** Luas lingkaran geofence dalam hektar, dihitung dari radius (π·r²). */
function luasHektar(radiusMeter) {
  const ha = (Math.PI * radiusMeter * radiusMeter) / 10000;
  return `${ha.toLocaleString("id-ID", { maximumFractionDigits: 2 })} ha`;
}

export async function getGeofenceZones() {
  if (USE_LARAVEL_API) {
    // ?all=1 supaya zona nonaktif juga ikut tampil di tabel manajemen admin
    // (endpoint publik /geofences tanpa ini hanya mengembalikan yang aktif).
    const zones = await fetchLaravel("/geofences?all=1");
    return zones.map((z) => ({
      id: z.id,
      nama: z.name,
      lokasi: z.koridor_id ? `Koridor ${z.koridor_id}` : "-",
      luas: luasHektar(z.radius_meter),
      status: z.is_active ? "Aktif" : "NonAktif",
      konten: z.soundscape_id ? "Audio & Info" : "Info",
      lat: z.latitude,
      lng: z.longitude,
      // Field mentah untuk form edit:
      radiusMeter: z.radius_meter,
      isActive: z.is_active,
      soundscapeId: z.soundscape_id,
      koridorId: z.koridor_id,
      welcomeTitle: z.welcome_title,
      welcomeDesc: z.welcome_desc,
    }));
  }

  return geofenceZonesAdmin;
}

/** Opsi dropdown form zona: daftar koridor & soundscape dari Laravel. */
export async function getGeofenceFormOptions() {
  if (!USE_LARAVEL_API) return { koridors: [], soundscapes: [] };
  const [koridors, soundscapes] = await Promise.all([
    fetchLaravel("/koridors").catch(() => []),
    fetchLaravel("/soundscapes").catch(() => []),
  ]);
  return {
    koridors: koridors.map((k) => ({ value: String(k.id), label: k.formal_name })),
    soundscapes: soundscapes.map((s) => ({ value: String(s.id), label: `${s.title} (${s.duration})` })),
  };
}

export async function createGeofenceZone(data) {
  if (USE_LARAVEL_API) {
    const json = await fetchLaravelAdmin("/geofences", { method: "POST", body: JSON.stringify(data) });
    return json.data;
  }

  return { id: Date.now(), ...data };
}
