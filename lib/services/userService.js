import { USE_MOCK, delay } from "@/lib/config";
import { userListAdmin } from "@/lib/data/mockAdminData";

export async function getUsers() {
  if (USE_MOCK) {
    await delay();
    return { users: userListAdmin, total: 8245, aktif: 2145, baru7Hari: 324, nonaktif: 125 };
  }
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  const [users, total, aktif, nonaktif] = await Promise.all([
    prisma.appUser.findMany({ orderBy: { id: "desc" }, take: 20 }),
    prisma.appUser.count(),
    prisma.appUser.count({ where: { status: "aktif" } }),
    prisma.appUser.count({ where: { status: "nonaktif" } }),
  ]);
  return {
    users: users.map((u) => ({ id: u.id, nama: u.name, email: u.email, peran: u.role === "admin" ? "Admin" : "User", status: u.status === "aktif" ? "Aktif" : "NonAktif", bergabung: u.joinedAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) })),
    total, aktif, nonaktif,
    baru7Hari: users.filter((u) => Date.now() - u.joinedAt.getTime() < 7 * 24 * 60 * 60 * 1000).length,
  };
}
