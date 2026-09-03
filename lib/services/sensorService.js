import { USE_MOCK, delay } from "@/lib/config";
import { sensorListAdmin } from "@/lib/data/mockAdminData";

export async function getSensorList() {
  if (USE_MOCK) {
    await delay();
    return sensorListAdmin;
  }
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  const devices = await prisma.sensorDevice.findMany({
    include: { readings: { orderBy: { recordedAt: "desc" }, take: 1 } },
    orderBy: { id: "asc" },
  });
  return devices.map((d) => ({
    id: d.id,
    nama: `${d.deviceType ?? "Sensor"} - ${d.locationName ?? d.deviceCode}`,
    lokasi: d.locationName ?? "-",
    jenis: d.deviceType ?? "-",
    status: d.isActive ? "Aktif" : "Offline",
    update: d.readings[0]?.recordedAt?.toLocaleString("id-ID") ?? d.lastSeenAt?.toLocaleString("id-ID") ?? "-",
  }));
}

export async function getSensorStats() {
  const list = await getSensorList();
  const total = list.length;
  const aktif = list.filter((s) => s.status === "Aktif").length;
  const offline = total - aktif;
  return { total, aktif, offline };
}
