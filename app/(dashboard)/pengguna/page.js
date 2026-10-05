import { getUsers } from "@/lib/services/userService";
import PenggunaClient from "./PenggunaClient";

export const dynamic = "force-dynamic";

export default async function PenggunaPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q ?? "";
  const status = sp?.status ?? "";
  const page = Number(sp?.page ?? 1);
  const perPage = 5;

  const data = await getUsers({ q, status, page, perPage });

  return <PenggunaClient data={data} query={{ q, status, page, perPage }} />;
}
