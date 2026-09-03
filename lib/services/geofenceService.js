import { USE_MOCK, delay } from "@/lib/config";
import { geofenceZonesAdmin } from "@/lib/data/mockAdminData";

export async function getGeofenceZones() {
  if (USE_MOCK) {
    await delay();
    return geofenceZonesAdmin;
  }
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  const zones = await prisma.geofence.findMany({ orderBy: { id: "asc" } });
  return zones.map((z) => ({
    id: z.id,
    nama: z.name,
    lokasi: z.location ?? "-",
    luas: z.areaHectare ? `${z.areaHectare} ha` : "-",
    status: z.isActive ? "Aktif" : "NonAktif",
    konten: z.broadcastType ?? "-",
    lat: Number(z.latitude),
    lng: Number(z.longitude),
  }));
}

export async function createGeofenceZone(data) {
  if (USE_MOCK) {
    await delay();
    return { id: Date.now(), ...data };
  }
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  return prisma.geofence.create({ data });
}
