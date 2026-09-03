// SVARGA Admin — konfigurasi mode mock, mengikuti pola yang sama seperti
// Web-App Pengguna: selama DATABASE_URL kosong, seluruh services/* otomatis
// memakai data contoh (lib/data/*.js) supaya dashboard tidak pernah kosong,
// bahkan sebelum PostgreSQL asli disiapkan.

export const USE_MOCK = !process.env.DATABASE_URL;

export const HAS_GOOGLE_MAPS_KEY = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

export function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
