import { USE_MOCK, delay } from "@/lib/config";
import {
  envSummary,
  userActivityWeekly,
  moodDistribution,
  moodTotalCatatan,
  upcomingFestivals,
  geofenceZonesActive,
  sensorSummaryDonut,
  sensorTotal,
} from "@/lib/data/mockAdminData";

export async function getDashboardSummary() {
  if (USE_MOCK) {
    await delay();
    return { envSummary, userActivityWeekly, moodDistribution, moodTotalCatatan, upcomingFestivals, geofenceZonesActive, sensorSummaryDonut, sensorTotal };
  }

  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();

  const [latestReadings, moodLogs, festivals, geofences, sensorAgg] = await Promise.all([
    prisma.sensorReading.findMany({ orderBy: { recordedAt: "desc" }, take: 5, include: { device: true } }),
    prisma.moodLog.findMany(),
    prisma.event.findMany({ where: { eventDate: { gte: new Date() } }, orderBy: { eventDate: "asc" }, take: 4 }),
    prisma.geofence.findMany({ where: { isActive: true }, take: 3 }),
    prisma.sensorDevice.groupBy({ by: ["isActive", "needsRepair"], _count: true }),
  ]);

  // Agregasi mood dari baris mentah (lihat catatan di prisma/seed.js soal
  // baris agregat sementara — di produksi ini idealnya materialized view).
  const moodCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const m of moodLogs) {
    const noteCount = m.note?.match(/agregat_seed_count:(\d+)/)?.[1];
    moodCounts[m.moodScore] += noteCount ? Number(noteCount) : 1;
  }
  const totalMood = Object.values(moodCounts).reduce((a, b) => a + b, 0) || 1;
  const moodLabels = { 5: "Sangat Baik", 4: "Baik", 3: "Biasa Saja", 2: "Buruk", 1: "Sangat Buruk" };
  const moodColors = { 5: "#2c4a30", 4: "#4b7750", 3: "#3e6e8e", 2: "#d4a039", 1: "#b3492d" };
  const moodDist = [5, 4, 3, 2, 1].map((score) => ({
    name: moodLabels[score],
    value: Math.round((moodCounts[score] / totalMood) * 100),
    count: moodCounts[score],
    color: moodColors[score],
  }));

  return {
    envSummary, // ringkasan lingkungan real-time idealnya dari view agregat terpisah (lihat monitoringService)
    userActivityWeekly, // butuh tabel log aktivitas harian — belum ada di schema, masih mock
    moodDistribution: moodDist,
    moodTotalCatatan: totalMood,
    upcomingFestivals: festivals.map((f) => ({ id: f.id, name: f.title, date: f.eventDate.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }), location: f.routeInfo ?? "-" })),
    geofenceZonesActive: geofences.map((g) => ({ id: g.id, name: g.name, note: `${g.broadcastType ?? "-"}`, status: g.isActive ? "Aktif" : "NonAktif" })),
    sensorSummaryDonut,
    sensorTotal: sensorAgg.reduce((sum, g) => sum + g._count, 0),
  };
}
