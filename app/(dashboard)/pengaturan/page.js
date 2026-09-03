import PengaturanClient from "./PengaturanClient";
import { getIntegrations } from "@/lib/services/integrationService";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const integrations = await getIntegrations();
  return <PengaturanClient integrations={integrations} />;
}
