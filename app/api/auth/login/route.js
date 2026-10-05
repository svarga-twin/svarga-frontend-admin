import { NextResponse } from "next/server";
import { USE_MOCK, USE_LARAVEL_API, LARAVEL_API_BASE } from "@/lib/config";
import { createSession } from "@/lib/auth";

// Kredensial demo untuk mode mock (Laravel & DATABASE_URL sama-sama kosong)
// — dokumentasikan di README. Sama seperti admin default yang di-seed di
// svarga-backend (AdminUserSeeder), supaya konsisten dua mode ini.
const DEMO_ADMIN = {
  id: 0,
  name: "Ahmad Fauzi",
  email: "admin@svarga.id",
  password: "svarga123",
  role: "super_admin",
};

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan kata sandi wajib diisi." }, { status: 400 });
  }

  // Login admin sekarang lewat Laravel Sanctum (tabel `users` yang sama
  // dengan svarga-app) — menggantikan Prisma/Supabase sepenuhnya. Sesi
  // browser tetap cookie HMAC ringan seperti sebelumnya (lib/auth.js);
  // token Sanctum dari Laravel tidak perlu disimpan di sini karena setiap
  // request admin selanjutnya lewat services/*.js server-side, bukan
  // memakai token ini langsung dari browser.
  if (USE_LARAVEL_API) {
    let laravelRes;
    try {
      laravelRes = await fetch(`${LARAVEL_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      return NextResponse.json({ error: "Tidak bisa terhubung ke backend Laravel." }, { status: 502 });
    }

    if (!laravelRes.ok) {
      return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
    }

    const { user, token: laravelToken } = await laravelRes.json();
    if (!user.is_admin) {
      return NextResponse.json({ error: "Akun ini tidak memiliki akses admin." }, { status: 403 });
    }

    await createSession({ id: user.id, name: user.name, email: user.email, role: "super_admin", laravelToken });
    return NextResponse.json({ ok: true });
  }

  if (USE_MOCK) {
    if (email.toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
      return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
    }
    await createSession(DEMO_ADMIN);
    return NextResponse.json({ ok: true });
  }

  // Tidak ada LARAVEL_API_URL maupun mode mock aktif (mis. DATABASE_URL
  // terisi tapi LARAVEL_API_URL kosong) — daripada diam-diam mencoba Prisma
  // lagi, kasih pesan yang jelas supaya gampang didiagnosis.
  return NextResponse.json(
    { error: "LARAVEL_API_URL belum dikonfigurasi di .env — lihat README untuk cara setup." },
    { status: 500 }
  );
}
