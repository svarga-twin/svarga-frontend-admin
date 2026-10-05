import { delay } from "@/lib/config";
import { smartRouteChoices } from "@/lib/data/mockAdminData";

// Algoritma pemilihan rute (skoring gabungan AQI + keteduhan + jarak) belum
// diimplementasikan — ini murni data ilustratif mengikuti mockup, sama
// seperti SmartGreenRoutePage di Web-App Pengguna.
export async function getSmartRouteChoices() {
  await delay();
  return smartRouteChoices;
}
