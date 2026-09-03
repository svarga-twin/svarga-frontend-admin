import { USE_MOCK, delay } from "@/lib/config";
import { upcomingFestivals } from "@/lib/data/mockAdminData";

export async function getFestivals() {
  if (USE_MOCK) {
    await delay();
    return upcomingFestivals.map((f) => ({
      ...f,
      description:
        "Event kolosal ini akan menampilkan ratusan peraga busana kontemporer berbasis budaya adat yang ramah lingkungan dan terintegrasi dengan sensor kesehatan Smart Green Route.",
      startTime: "08:00", endTime: "15:00",
      routeInfo: "Lorong Taman Blambangan - Kantor Bupati",
      routeCount: 3, notifSent: 8245, umkmCount: 120,
    }));
  }
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  const events = await prisma.event.findMany({ orderBy: { eventDate: "asc" } });
  return events.map((e) => ({
    id: e.id,
    name: e.title,
    date: e.eventDate.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
    location: e.routeInfo ?? "-",
    description: e.description ?? "",
    startTime: e.startTime, endTime: e.endTime, routeInfo: e.routeInfo,
    routeCount: e.routeCount, notifSent: e.notifSent, umkmCount: e.umkmCount,
  }));
}
