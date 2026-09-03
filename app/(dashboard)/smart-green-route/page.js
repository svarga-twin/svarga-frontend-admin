import SmartRouteClient from "./SmartRouteClient";
import { getSmartRouteChoices } from "@/lib/services/routeService";

export const dynamic = "force-dynamic";

export default async function SmartGreenRoutePage() {
  const choices = await getSmartRouteChoices();
  return <SmartRouteClient choices={choices} />;
}
