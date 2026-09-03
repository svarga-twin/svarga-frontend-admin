import KalenderClient from "./KalenderClient";
import { getFestivals } from "@/lib/services/eventService";

export const dynamic = "force-dynamic";

export default async function KalenderBwiPage() {
  const festivals = await getFestivals();
  return <KalenderClient festivals={festivals} />;
}
