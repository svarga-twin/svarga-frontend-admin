import { NextResponse } from "next/server";
import { getSession, destroySession } from "@/lib/auth";
import { USE_LARAVEL_API, LARAVEL_API_BASE } from "@/lib/config";

export async function POST() {
  // Cabut juga token Sanctum di Laravel (kalau ada), bukan cuma hapus cookie
  // sesi lokal — supaya token itu benar-benar tidak bisa dipakai lagi.
  if (USE_LARAVEL_API) {
    const session = await getSession();
    if (session?.laravelToken) {
      try {
        await fetch(`${LARAVEL_API_BASE}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.laravelToken}` },
        });
      } catch {
        // Tetap lanjut hapus sesi lokal walau request ke Laravel gagal (mis. server sedang mati).
      }
    }
  }

  await destroySession();
  return NextResponse.json({ ok: true });
}
