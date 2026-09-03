import { USE_MOCK, delay } from "@/lib/config";
import { adminNotifications } from "@/lib/data/mockAdminData";

export async function getNotifications() {
  if (USE_MOCK) {
    await delay();
    return { notifications: adminNotifications, total: 1245, belumDibaca: 28, hariIni: 12 };
  }
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  const [logs, total, belumDibaca] = await Promise.all([
    prisma.notificationLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.notificationLog.count(),
    prisma.notificationLog.count({ where: { isRead: false } }),
  ]);
  const iconMap = { lingkungan: "Activity", sensor: "Cpu", festival: "Calendar", pengguna: "Users" };
  return {
    notifications: logs.map((n) => ({
      id: n.id, kategori: n.category, icon: iconMap[n.category] ?? "Bell",
      tone: n.category === "lingkungan" ? "danger" : n.category === "sensor" ? "warn" : "neutral",
      title: n.title, desc: n.description ?? "", time: n.createdAt.toLocaleString("id-ID"), unread: !n.isRead,
    })),
    total, belumDibaca,
    hariIni: logs.filter((n) => n.createdAt.toDateString() === new Date().toDateString()).length,
  };
}

export async function markAllAsRead() {
  if (USE_MOCK) {
    await delay();
    return { ok: true };
  }
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  await prisma.notificationLog.updateMany({ where: { isRead: false }, data: { isRead: true } });
  return { ok: true };
}
