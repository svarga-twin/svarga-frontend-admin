import { USE_LARAVEL_API } from "@/lib/config";
import { fetchLaravel } from "@/lib/laravelClient";
import { moodTrend7Days, moodDistribution, moodTotalCatatan } from "@/lib/data/mockAdminData";

const SCORE_LABEL = { 5: "Sangat Baik", 4: "Baik", 3: "Biasa Saja", 2: "Buruk", 1: "Sangat Buruk" };
const SCORE_COLOR = { 5: "#2c4a30", 4: "#4b7750", 3: "#3e6e8e", 2: "#d4a039", 1: "#b3492d" };

function formatDayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" }).replace(".", "");
}

export async function getMoodWellbeing() {
  if (USE_LARAVEL_API) {
    // Tanpa green_space_id -> agregat se-kota (lihat MoodLogController@summary),
    // beda dengan svarga-app yang selalu mengirim satu green_space_id spesifik.
    const summary = await fetchLaravel("/mood-logs/summary?days=7");

    const moodTrend7DaysLive = summary.daily.map((d) => ({
      hari: formatDayLabel(d.date),
      sangatBaik: d.per_score["5"],
      baik: d.per_score["4"],
      biasa: d.per_score["3"],
      buruk: d.per_score["2"] + d.per_score["1"], // "Sangat Buruk" digabung ke garis Buruk di grafik tren (konsisten dgn 4 garis di legenda desain)
    }));

    const total = summary.total_entries || 1;
    const distribusi = [5, 4, 3, 2, 1].map((s) => ({
      name: SCORE_LABEL[s],
      value: Math.round((summary.distribution[s] / total) * 100),
      count: summary.distribution[s],
      color: SCORE_COLOR[s],
    }));

    return {
      moodTrend7Days: moodTrend7DaysLive,
      moodDistribution: distribusi,
      moodTotalCatatan: summary.total_entries,
      rataRata: summary.average_score != null ? `${summary.average_score}/5` : "-",
      moodTerbanyak: distribusi.reduce((a, b) => (b.count > a.count ? b : a), distribusi[0]).name,
    };
  }

  return { moodTrend7Days, moodDistribution, moodTotalCatatan, rataRata: "3.7/5", moodTerbanyak: "Baik" };
}
