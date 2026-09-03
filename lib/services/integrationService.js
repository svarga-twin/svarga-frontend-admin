import { USE_MOCK, delay } from "@/lib/config";
import { integrationSettings } from "@/lib/data/mockAdminData";

export async function getIntegrations() {
  if (USE_MOCK) {
    await delay();
    return integrationSettings;
  }
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  const rows = await prisma.integrationSetting.findMany();
  return integrationSettings.map((base) => {
    const row = rows.find((r) => r.key === base.key);
    return { ...base, connected: row?.isConnected ?? base.connected };
  });
}
