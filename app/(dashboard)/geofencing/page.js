import { getGeofenceZones, getGeofenceFormOptions } from "@/lib/services/geofenceService";
import GeofencingClient from "./GeofencingClient";

export const dynamic = "force-dynamic";

export default async function GeofencingPage() {
  const [zones, options] = await Promise.all([getGeofenceZones(), getGeofenceFormOptions()]);
  return <GeofencingClient zones={zones} options={options} />;
}
