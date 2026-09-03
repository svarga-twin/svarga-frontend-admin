import MonitoringClient from "./MonitoringClient";
import { getMonitoringData } from "@/lib/services/monitoringService";

export const dynamic = "force-dynamic";

export default async function MonitoringPage() {
  const data = await getMonitoringData();
  return <MonitoringClient data={data} />;
}
