import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";

// Lapis kedua proteksi rute (selain proxy.js) — proxy.js hanya cek
// KEBERADAAN cookie (Edge runtime tidak punya modul Node `crypto` untuk
// verifikasi HMAC), sedangkan di sini (Node runtime penuh) tanda tangan
// sesi benar-benar diverifikasi lewat getSession().
export default async function DashboardLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-dvh flex bg-sand-100">
      <Sidebar adminName={session.name} adminRole={session.role === "super_admin" ? "Super Admin" : "Admin"} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
