import NotifikasiClient from "./NotifikasiClient";
import { getNotifications } from "@/lib/services/notificationService";

export const dynamic = "force-dynamic";

export default async function NotifikasiPage() {
  const data = await getNotifications();
  return <NotifikasiClient data={data} />;
}
