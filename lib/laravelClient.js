import { LARAVEL_API_BASE } from "./config";
import { getSession } from "./auth";

/**
 * Helper tipis untuk memanggil svarga-backend (Laravel) dari admin
 * dashboard — sengaja hanya dipakai di Server Component / server-side
 * (lib/services/*.js), tidak pernah langsung dari client component, jadi
 * tidak perlu prefix NEXT_PUBLIC_ untuk LARAVEL_API_URL.
 */
export async function fetchLaravel(path) {
  const res = await fetch(`${LARAVEL_API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Laravel API ${path} merespons ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

/**
 * Sama seperti fetchLaravel, tapi menyertakan token Sanctum admin yang
 * sedang login (lihat createSession di lib/auth.js) — dipakai untuk
 * endpoint khusus admin (/api/admin/*, POST /api/geofences). Mengembalikan
 * body JSON APA ADANYA (tidak otomatis unwrap `.data`) karena beberapa
 * endpoint admin punya field lain di level atas (mis. `total`, `belum_dibaca`).
 */
export async function fetchLaravelAdmin(path, options = {}) {
  const session = await getSession();
  if (!session?.laravelToken) {
    throw new Error("Sesi admin tidak punya token Laravel — coba login ulang.");
  }

  const res = await fetch(`${LARAVEL_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${session.laravelToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? `Laravel API ${path} merespons ${res.status}`);
  return json;
}

/**
 * Untuk Route Handler (app/api/admin/proxy/...) yang meneruskan mutasi
 * (POST/PUT/DELETE) dari browser ke Laravel atas nama admin yang login.
 * Beda dari fetchLaravelAdmin: TIDAK melempar error saat Laravel membalas
 * 4xx — status & body (mis. error validasi 422) diteruskan apa adanya ke
 * browser supaya form bisa menampilkan pesan per-field.
 */
export async function proxyAdminMutation(method, path, body) {
  const session = await getSession();
  if (!session?.laravelToken) {
    return { status: 401, json: { message: "Sesi berakhir, silakan login ulang." } };
  }

  let res;
  try {
    res = await fetch(`${LARAVEL_API_BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${session.laravelToken}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    return { status: 502, json: { message: "Tidak bisa terhubung ke backend Laravel." } };
  }

  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}
