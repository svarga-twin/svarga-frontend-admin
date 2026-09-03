import { USE_MOCK, delay } from "@/lib/config";
import { envSummary, aqiTrend7Days, airQualityDistribution, locationAirQuality } from "@/lib/data/mockAdminData";

export async function getMonitoringData() {
  if (USE_MOCK) {
    await delay();
    return { envSummary, aqiTrend7Days, airQualityDistribution, locationAirQuality };
  }

  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();

  const devices = await prisma.sensorDevice.findMany({
    include: { readings: { orderBy: { recordedAt: "desc" }, take: 1 }, greenSpace: true },
  });

  const locationAirQualityReal = devices
    .filter((d) => d.deviceType === "Kualitas Udara" || !d.deviceType)
    .map((d) => ({
      lokasi: d.locationName ?? d.greenSpace?.name ?? d.deviceCode,
      aqi: d.readings[0]?.value ?? "-",
      status: d.readings[0]?.status ?? "-",
      suhu: "-",
      update: d.readings[0]?.recordedAt?.toLocaleString("id-ID") ?? "-",
    }));

  // TODO: tren 7 hari & distribusi butuh query time-series ter-bucket per
  // hari (mis. Prisma $queryRaw dengan date_trunc) — belum diimplementasikan,
  // masih pakai data ilustratif sampai volume data sensor asli cukup banyak.
  return { envSummary, aqiTrend7Days, airQualityDistribution, locationAirQuality: locationAirQualityReal.length ? locationAirQualityReal : locationAirQuality };
}
