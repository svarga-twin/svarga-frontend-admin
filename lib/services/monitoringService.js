import { USE_MOCK, USE_LARAVEL_API } from "@/lib/config";
import { fetchLaravel } from "@/lib/laravelClient";
import { envSummary, aqiTrend7Days, airQualityDistribution, locationAirQuality } from "@/lib/data/mockAdminData";

const PM25_STATUS_COLOR = { Sehat: "#3f6e45", Sedang: "#d4a039", "Tidak Sehat": "#b3492d" };

export async function getMonitoringData() {
  if (USE_LARAVEL_API) {
    const [trend, koridors, liveAqi] = await Promise.all([
      fetchLaravel("/sensors/history?sensor_type=air_quality&days=7"),
      fetchLaravel("/koridors"),
      fetchLaravel("/sensors/latest?sensor_type=air_quality").catch(() => null),
    ]);

    // Laravel baru punya SATU aliran sensor kualitas udara agregat (bukan
    // per-kecamatan seperti data contoh), jadi grafik tren cuma 1 garis —
    // lebih jujur daripada mengarang 4 lokasi fiktif.
    const aqiTrend7DaysLive = trend.daily.map((d) => ({
      hari: new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      banyuwangi: d.average_value,
    }));

    // locationAirQuality: dipetakan dari snapshot sensor per-koridor (data
    // sungguhan yang di-seed, bukan kecamatan fiktif) — lihat KoridorSeeder.
    const locationAirQualityLive = koridors.map((k) => ({
      lokasi: k.short_name,
      aqi: k.sensor?.pm25 ?? "-",
      status: k.sensor?.pm25_status ?? "-",
      suhu: k.sensor?.suhu ? `${k.sensor.suhu}°C` : "-",
      update: k.sensor?.recorded_at ? new Date(k.sensor.recorded_at).toLocaleString("id-ID") : "-",
    }));

    const statusCounts = koridors.reduce((acc, k) => {
      const s = k.sensor?.pm25_status ?? "Sehat";
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});
    const totalKoridor = koridors.length || 1;
    const airQualityDistributionLive = Object.entries(statusCounts).map(([name, count]) => ({
      name: name === "Sehat" ? "Baik" : name,
      value: Math.round((count / totalKoridor) * 100),
      count,
      color: PM25_STATUS_COLOR[name] ?? "#3f6e45",
    }));

    // envSummary: overlay bacaan live (kalau ada & segar) di atas snapshot koridor 1
    // sebagai baseline — pola yang sama dengan HomePage.jsx di svarga-app.
    const baseline = koridors[0]?.sensor ?? {};
    const aqiValue = liveAqi?.data && !liveAqi.is_stale ? Math.round(liveAqi.data.value) : baseline.pm25;
    const envSummaryLive = [
      { key: "aqi", icon: "Activity", label: "Kualitas Udara (AQI)", value: String(aqiValue ?? "-"), badge: baseline.pm25_status ?? "-", tone: "neutral", note: liveAqi?.data && !liveAqi.is_stale ? "Live dari sensor" : "Data terakhir tersimpan" },
      { key: "uv", icon: "Sun", label: "Indeks UV", value: String(baseline.uv_index ?? "-"), badge: baseline.uv_status ?? "-", tone: "neutral", note: `Koridor ${koridors[0]?.short_name ?? "-"}` },
      { key: "suhu", icon: "Thermometer", label: "Suhu Rata-rata", value: baseline.suhu ? `${baseline.suhu}°C` : "-", badge: baseline.suhu_status ?? "-", tone: "info", note: `Koridor ${koridors[0]?.short_name ?? "-"}` },
      { key: "bising", icon: "Volume2", label: "Kebisingan", value: baseline.kebisingan ? `${baseline.kebisingan} dB` : "-", badge: baseline.kebisingan_status ?? "-", tone: "warn", note: `Koridor ${koridors[0]?.short_name ?? "-"}` },
      { key: "lembab", icon: "Droplets", label: "Kelembapan", value: baseline.kelembaban ? `${baseline.kelembaban}%` : "-", badge: baseline.kelembaban_status ?? "-", tone: "info", note: `Koridor ${koridors[0]?.short_name ?? "-"}` },
    ];

    return {
      envSummary: envSummaryLive,
      aqiTrend7Days: aqiTrend7DaysLive,
      airQualityDistribution: airQualityDistributionLive.length ? airQualityDistributionLive : airQualityDistribution,
      locationAirQuality: locationAirQualityLive,
    };
  }

  if (USE_MOCK) {
    return { envSummary, aqiTrend7Days, airQualityDistribution, locationAirQuality };
  }

  // Fallback terakhir kalau Laravel & mock sama-sama tidak aktif.
  return { envSummary, aqiTrend7Days, airQualityDistribution, locationAirQuality };
}
