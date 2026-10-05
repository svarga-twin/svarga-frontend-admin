// SVARGA Admin — konfigurasi sumber data. Prisma/PostgreSQL sudah tidak
// dipakai sama sekali lagi (lihat CHANGES.md) — satu-satunya backend
// sungguhan sekarang svarga-backend (Laravel), sama seperti svarga-app.
// Selama LARAVEL_API_URL kosong, seluruh services/* otomatis memakai data
// contoh (lib/data/*.js) supaya dashboard tidak pernah kosong saat development.

// Backend Laravel bersama (svarga-backend) — sumber data yang sama dengan
// svarga-app.
export const LARAVEL_API_BASE = process.env.LARAVEL_API_URL ?? "";
export const USE_LARAVEL_API = Boolean(LARAVEL_API_BASE);

export const USE_MOCK = !USE_LARAVEL_API;

export const HAS_GOOGLE_MAPS_KEY = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

export function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
