import { USE_MOCK, delay } from "@/lib/config";
import { moodTrend7Days, moodDistribution, moodTotalCatatan } from "@/lib/data/mockAdminData";

export async function getMoodWellbeing() {
  if (USE_MOCK) {
    await delay();
    return { moodTrend7Days, moodDistribution, moodTotalCatatan, rataRata: "3.7/5", moodTerbanyak: "Baik" };
  }

  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  const logs = await prisma.moodLog.findMany();

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const m of logs) {
    const seedCount = m.note?.match(/agregat_seed_count:(\d+)/)?.[1];
    counts[m.moodScore] += seedCount ? Number(seedCount) : 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const labels = { 5: "Sangat Baik", 4: "Baik", 3: "Biasa Saja", 2: "Buruk", 1: "Sangat Buruk" };
  const colors = { 5: "#2c4a30", 4: "#4b7750", 3: "#3e6e8e", 2: "#d4a039", 1: "#b3492d" };
  const distribusi = [5, 4, 3, 2, 1].map((s) => ({ name: labels[s], value: Math.round((counts[s] / total) * 100), count: counts[s], color: colors[s] }));
  const rataRata = (Object.entries(counts).reduce((sum, [score, count]) => sum + Number(score) * count, 0) / total).toFixed(1);

  return {
    // Tren harian butuh bucket per tanggal (date_trunc) — belum ada volume data
    // cukup untuk itu, masih pakai ilustrasi 9 hari terakhir.
    moodTrend7Days,
    moodDistribution: distribusi,
    moodTotalCatatan: total,
    rataRata: `${rataRata}/5`,
    moodTerbanyak: distribusi.reduce((a, b) => (b.count > a.count ? b : a)).name,
  };
}
