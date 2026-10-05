# SVARGA Admin Dashboard

Dashboard internal untuk Pemkab Banyuwangi / pengelola ruang publik — bagian
dari proyek **SVARGA: Digital Twin & Wellness Corridor** (SMK Negeri 1
Banyuwangi, tim Happy Fun Angkasa).

Menyajikan data agregat dari sensor IoT, pola kunjungan, Sociotope Mood
Mapping, serta pengelolaan konten (RTH, zona geofencing, UMKM, kalender
BWI-Fest) untuk mendukung evaluasi tata ruang berbasis data (lihat proposal,
bagian 7.4 Sistem — "Dashboard Admin").

## Tech stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- Prisma + PostgreSQL (+ ekstensi PostGIS untuk Sociotope Mood Map)
- Chart.js, @react-google-maps/api

## Menjalankan

```bash
npm install
cp .env.example .env      # isi DATABASE_URL, ADMIN_SESSION_SECRET, dst.
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js        # atau: npm run create-admin untuk buat 1 user admin
npm run dev                 # http://localhost:3000
```

Selama `DATABASE_URL` belum diisi/valid, sebagian besar halaman tetap bisa
dibuka karena `lib/services/*.js` jatuh balik ke data mock di
`lib/data/mockAdminData.js` — pola fallback yang sama seperti di
`svarga-app`, supaya UI bisa dikembangkan/didemokan tanpa perlu database
sungguhan menyala duluan.

## Halaman yang tersedia

| Route | Fungsi |
|---|---|
| `/` | Ringkasan/overview |
| `/monitoring` | Monitoring lingkungan real-time |
| `/sensor-iot` | Manajemen & status sensor IoT (ESP32) |
| `/smart-green-route` | Statistik pemakaian Smart Green Route |
| `/mood-wellbeing` | Agregat Mood Tracker & Sociotope Mood Map |
| `/geofencing` | Kelola zona geofencing |
| `/kalender-bwi` | Kelola agenda Banyuwangi Festival |
| `/pengguna` | Manajemen pengguna |
| `/notifikasi` | Notifikasi sistem |
| `/laporan` | Ekspor laporan/insight untuk perencanaan kota |
| `/pengaturan` | Konfigurasi integrasi & preferensi admin |
| `/login` | Autentikasi admin |

## Struktur relevan

```
app/(dashboard)/...     Satu folder per halaman (page.js + *Client.js untuk
                        bagian interaktif/client component)
app/api/                Route handler Next.js (auth login/logout, notifikasi)
components/             layout/ (AdminShell, sidebar), ui/ (AdminCard,
                        StatCard, StatusPill), charts/, maps/
lib/services/           Satu file per domain, membungkus Prisma query +
                        fallback ke lib/data/mockAdminData.js
prisma/schema.prisma    Skema PostgreSQL — superset dari src/db/schema.sql
                        milik svarga-app, supaya kedua aplikasi pada
                        akhirnya bisa membaca database yang sama
```

## Autentikasi Admin

Login admin sekarang lewat **Laravel Sanctum** (tabel `users` yang sama
dengan `svarga-app`), bukan lagi Prisma/Supabase. Alurnya: `app/login/page.js`
→ `app/api/auth/login/route.js` memanggil `POST {LARAVEL_API_URL}/auth/login`,
lalu memeriksa field `is_admin` pada user yang dikembalikan — kalau `true`,
sesi browser dibuat lewat cookie HMAC ringan (`lib/auth.js`, tidak butuh
database sendiri untuk verifikasi sesi).

Kredensial admin default (di-seed lewat `AdminUserSeeder` di
`svarga-backend`): `admin@svarga.id` / `svarga123` — **ganti di produksi**.

Mode mock (kalau `LARAVEL_API_URL` maupun `DATABASE_URL` kosong) tetap
memakai kredensial demo yang sama, tanpa perlu backend apa pun.

`scripts/createAdminUser.js` dan `prisma/seed.js` adalah peninggalan alur
lama (Prisma/Supabase) — tidak lagi dipakai untuk login, dibiarkan ada
kalau-kalau masih dibutuhkan untuk domain lain yang belum dipindah
(Pengguna, Laporan, dst).

## Relasi dengan uji coba sensor di `svarga-backend`

**Update:** Sensor IoT, Kalender BWI, Geofencing, dan Mood & Wellbeing
sekarang bisa disambungkan ke `svarga-backend` (Laravel) yang sama dengan
`svarga-app` — isi `LARAVEL_API_URL` di `.env` (lihat `.env.example`).
Begitu diisi, keempat halaman itu otomatis memakai data Laravel (menang
di atas Prisma/mock), jadi admin, app pengguna, dan backend benar-benar
berbagi satu sumber data yang sama — data yang dikirim sensor lewat
`svarga-app`/ESP32 langsung terlihat di dashboard ini tanpa proses
tambahan.

Domain yang **belum** tersambung ke Laravel (masih Prisma/mock apa
adanya): Laporan & Analitik, Pengguna (butuh endpoint admin khusus di
Laravel untuk daftar user terdaftar — belum dibuat), Notifikasi, dan
Pengaturan.

Catatan keterbatasan data saat memakai mode Laravel:
- **Sensor IoT** hanya menampilkan 2 baris (suhu & kualitas udara) —
  sesuai jumlah sensor yang benar-benar diuji coba di `svarga-backend`,
  bukan jaringan 126 sensor seperti pada data contoh.
- **Geofencing**: kolom "Luas Wilayah" selalu "-" karena Laravel belum
  menyimpan `area_hectare` (field ini cuma ada di skema Prisma lama).
- **Kalender BWI**: kolom "Rute Terkait", "Notifikasi Terkirim", "UMKM
  Terlibat" selalu 0 — metrik ini belum ada penghitungnya di Laravel,
  jadi ditampilkan apa adanya (bukan angka karangan) sampai fiturnya dibuat.
