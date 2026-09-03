// Data contoh (mock) — angka-angka disamakan persis dengan prisma/seed.js
// supaya tampilan tidak berubah saat berpindah dari mode mock ke PostgreSQL asli.

export const envSummary = [
  { key: "aqi", icon: "Activity", label: "Kualitas Udara (AQI)", value: "42", badge: "Baik", tone: "neutral", note: "Terbaik di Rogojampi" },
  { key: "uv", icon: "Sun", label: "Indeks UV", value: "3", badge: "Rendah", tone: "neutral", note: "Aman beraktivitas" },
  { key: "suhu", icon: "Thermometer", label: "Suhu Rata-rata", value: "28°C", badge: "Nyaman", tone: "info", note: "Stabil sejak pagi" },
  { key: "bising", icon: "Volume2", label: "Kebisingan", value: "56 dB", badge: "Sedang", tone: "warn", note: "Fokus area kota" },
  { key: "lembab", icon: "Droplets", label: "Kelembapan", value: "65%", badge: "Nyaman", tone: "info", note: "Sirkulasi udara ideal" },
];

export const userActivityWeekly = [
  { bulan: "Jan", aktif: 62, catatanMood: 38 },
  { bulan: "Feb", aktif: 58, catatanMood: 42 },
  { bulan: "Mar", aktif: 74, catatanMood: 55 },
  { bulan: "Apr", aktif: 88, catatanMood: 70 },
  { bulan: "Mei", aktif: 95, catatanMood: 78 },
];

export const moodDistribution = [
  { name: "Sangat Baik", value: 24, count: 1173, color: "#2c4a30" },
  { name: "Baik", value: 34, count: 1662, color: "#4b7750" },
  { name: "Biasa Saja", value: 23, count: 1124, color: "#3e6e8e" },
  { name: "Buruk", value: 11, count: 538, color: "#d4a039" },
  { name: "Sangat Buruk", value: 4, count: 193, color: "#b3492d" },
];
export const moodTotalCatatan = 4890;

export const upcomingFestivals = [
  { id: 1, name: "Banyuwangi Ethno Carnival", date: "15 Mei 2026", location: "Taman Blambangan" },
  { id: 2, name: "Festival Gandrung Sewu", date: "24 Mei 2026", location: "Pantai Boom" },
  { id: 3, name: "Festival Sulur Kembang", date: "02 Juni 2026", location: "Kawasan Ijen" },
  { id: 4, name: "Carnaval Kebangsaan", date: "02 Juni 2026", location: "Taman Blambangan" },
];

export const geofenceZonesActive = [
  { id: 1, name: "Hutan Kota Blambangan", note: "Zona Hijau Utama • 1.245 orang", status: "Aktif" },
  { id: 2, name: "Semenanjung Kalipuro", note: "Buffer Kebisingan • 340 orang", status: "Aktif" },
  { id: 3, name: "Kawasan Industri Ketapang", note: "Monitoring Khusus • 780 orang", status: "Siaga" },
];

export const sensorSummaryDonut = [
  { name: "Aktif", value: 112, color: "#3f6e45" },
  { name: "Maintenance", value: 8, color: "#d4a039" },
  { name: "Offline", value: 6, color: "#b3492d" },
];
export const sensorTotal = 126;

export const aqiTrend7Days = [
  { hari: "4 Mei", banyuwangi: 60, kalipuro: 40, rogojampi: 46, giri: 30 },
  { hari: "5 Mei", banyuwangi: 58, kalipuro: 39, rogojampi: 44, giri: 29 },
  { hari: "6 Mei", banyuwangi: 61, kalipuro: 38, rogojampi: 41, giri: 28 },
  { hari: "7 Mei", banyuwangi: 55, kalipuro: 37, rogojampi: 39, giri: 27 },
  { hari: "8 Mei", banyuwangi: 57, kalipuro: 38, rogojampi: 36, giri: 26 },
  { hari: "9 Mei", banyuwangi: 54, kalipuro: 39, rogojampi: 34, giri: 25 },
  { hari: "10 Mei", banyuwangi: 56, kalipuro: 38, rogojampi: 32, giri: 24 },
];

export const airQualityDistribution = [
  { name: "Baik", value: 60, count: 15, color: "#3f6e45" },
  { name: "Sedang", value: 32, count: 8, color: "#d4a039" },
  { name: "Tidak Sehat", value: 8, count: 2, color: "#b3492d" },
];

export const locationAirQuality = [
  { lokasi: "Banyuwangi Kota", aqi: 56, status: "Sedang", suhu: "29°C", update: "10 Menit Lalu", lat: -8.2192, lng: 114.3691 },
  { lokasi: "Kalipuro", aqi: 38, status: "Baik", suhu: "27°C", update: "5 Menit Lalu", lat: -8.15, lng: 114.35 },
  { lokasi: "Rogojampi", aqi: 32, status: "Baik", suhu: "28°C", update: "1 Jam Lalu", lat: -8.31, lng: 114.32 },
  { lokasi: "Giri", aqi: 44, status: "Baik", suhu: "26°C", update: "20 Menit Lalu", lat: -8.19, lng: 114.32 },
  { lokasi: "Kabat", aqi: 48, status: "Baik", suhu: "28°C", update: "15 Menit Lalu", lat: -8.27, lng: 114.34 },
];

export const sensorListAdmin = [
  { id: 1, nama: "AQI - Taman Blambangan", lokasi: "Banyuwangi Kota", jenis: "Kualitas Udara", status: "Aktif", update: "5 Menit Lalu" },
  { id: 2, nama: "AQI - Pantai Boom", lokasi: "Banyuwangi Kota", jenis: "Kualitas Udara", status: "Aktif", update: "12 Menit Lalu" },
  { id: 3, nama: "Suhu - Alun-Alun", lokasi: "Rogojampi", jenis: "Suhu", status: "Aktif", update: "8 Menit Lalu" },
  { id: 4, nama: "Kebisingan - Lateng", lokasi: "Kabat", jenis: "Kebisingan", status: "Aktif", update: "20 Menit Lalu" },
  { id: 5, nama: "UV - Situbondo", lokasi: "Giri", jenis: "UV Index", status: "Aktif", update: "1 Jam Lalu" },
  { id: 6, nama: "Kelembapan - Ijen", lokasi: "Kawasan Ijen", jenis: "Kelembapan", status: "Offline", update: "Yesterday" },
];

export const geofenceZonesAdmin = [
  { id: 1, nama: "Taman Blambangan", lokasi: "Banyuwangi Kota", luas: "12.5 ha", status: "Aktif", konten: "Audio & Info", lat: -8.2175, lng: 114.3675 },
  { id: 2, nama: "Pantai Boom", lokasi: "Banyuwangi Kota", luas: "8.3 ha", status: "Aktif", konten: "Audio & Musik", lat: -8.2298, lng: 114.3822 },
  { id: 3, nama: "Alun-Alun Banyuwangi", lokasi: "Banyuwangi Kota", luas: "5.2 ha", status: "Aktif", konten: "Info & Edukasi", lat: -8.2145, lng: 114.3691 },
  { id: 4, nama: "Kantor Situbondo", lokasi: "Giri", luas: "3.1 ha", status: "Aktif", konten: "Musik Relaksasi", lat: -8.19, lng: 114.32 },
  { id: 5, nama: "Kawasan Ijen", lokasi: "Kawasan Ijen", luas: "10.7 ha", status: "NonAktif", konten: "Audio & Info", lat: -8.0585, lng: 114.2415 },
];

export const userListAdmin = [
  { id: 1, nama: "Andi Setiawan", email: "andi@email.com", peran: "User", status: "Aktif", bergabung: "3 Mei 2026" },
  { id: 2, nama: "Siti Aisyah", email: "siti@email.com", peran: "User", status: "Aktif", bergabung: "3 Mei 2026" },
  { id: 3, nama: "Budi Santoso", email: "budi@email.com", peran: "User", status: "Aktif", bergabung: "3 Mei 2026" },
  { id: 4, nama: "Dewi Lestari", email: "dewi@email.com", peran: "User", status: "Aktif", bergabung: "4 Mei 2026" },
  { id: 5, nama: "Rizky Pratama", email: "rizky@email.com", peran: "User", status: "NonAktif", bergabung: "5 Mei 2026" },
];

export const moodTrend7Days = [
  { hari: "2 Mar", sangatBaik: 60, baik: 45, biasa: 25, buruk: 10 },
  { hari: "3 Mar", sangatBaik: 58, baik: 44, biasa: 24, buruk: 12 },
  { hari: "4 Mar", sangatBaik: 62, baik: 46, biasa: 27, buruk: 9 },
  { hari: "5 Mar", sangatBaik: 55, baik: 43, biasa: 22, buruk: 13 },
  { hari: "6 Mar", sangatBaik: 59, baik: 45, biasa: 25, buruk: 11 },
  { hari: "7 Mar", sangatBaik: 61, baik: 44, biasa: 24, buruk: 10 },
  { hari: "8 Mar", sangatBaik: 63, baik: 46, biasa: 26, buruk: 9 },
  { hari: "9 Mar", sangatBaik: 60, baik: 45, biasa: 25, buruk: 11 },
  { hari: "10 Mar", sangatBaik: 64, baik: 47, biasa: 24, buruk: 8 },
];

export const adminNotifications = [
  { id: 1, kategori: "lingkungan", icon: "Activity", tone: "danger", title: "Peringatan Kualitas Udara Rogojampi", desc: "Indeks AQI meningkat di atas 105 (Tidak Sehat untuk Kelompok Sensitif) karena polusi kendaraan malam hari.", time: "10 Menit yang lalu", unread: true },
  { id: 2, kategori: "sensor", icon: "Cpu", tone: "warn", title: "Sensor IoT #048 Offline - Pantai Boom", desc: "Konektivitas dengan modul pemantau kelembapan udara terputus sejak pukul 14:15 WIB. Butuh pengecekan perangkat.", time: "1 Jam yang lalu", unread: true },
  { id: 3, kategori: "festival", icon: "Calendar", tone: "neutral", title: "Event Festival Baru Ditambahkan", desc: "Pemerintah Kabupaten menyetujui jadwal baru 'Banyuwangi Ethno Carnival' pada 15 Mei 2026.", time: "3 Jam yang lalu", unread: false },
  { id: 4, kategori: "pengguna", icon: "Users", tone: "info", title: "Registrasi Pengguna Baru Meningkat", desc: "Terdeteksi lonjakan 120 pendaftaran akun baru dalam 24 jam terakhir didominasi wilayah Kabat.", time: "5 Jam yang lalu", unread: false },
  { id: 5, kategori: "lingkungan", icon: "MapPin", tone: "danger", title: "Geofencing Terlewati - Kawasan Industri Ketapang", desc: "Sebanyak 840 pengguna aktif terdeteksi memasuki zona pemantauan kualitas udara khusus di Ketapang.", time: "1 Hari yang lalu", unread: false },
  { id: 6, kategori: "pengguna", icon: "Smile", tone: "neutral", title: "Laporan Mood Mingguan Selesai", desc: "Statistik mingguan menunjukkan tingkat wellbeing masyarakat Banyuwangi stabil dengan 58% mencatat emosi positif.", time: "2 Hari yang lalu", unread: false },
];

export const integrationSettings = [
  { key: "kalender_bwi", icon: "Calendar", title: "Integrasi Kalender Festival BWI", desc: "Sinkronisasi event festival dan sistem BWI agar jadwal pariwisata terupdate real-time.", connected: true },
  { key: "sensor_iot", icon: "Cpu", title: "Integrasi Sensor IoT", desc: "Kelola koneksi, transmisi, dan telemetri informasi sensor di seluruh wilayah Rogojampi.", connected: true },
  { key: "geofencing", icon: "MapPin", title: "Integrasi Geofencing", desc: "Konfigurasi konten audio otomatis, trigger notifikasi zonasi, dan log presensi pengunjung.", connected: true },
  { key: "email", icon: "Mail", title: "Integrasi Email", desc: "Pengiriman otomatis laporan analisis mingguan dan notifikasi peringatan polusi via email.", connected: true },
];

export const smartRouteChoices = [
  { id: "terbersih", label: "Rute Terbersih (Rekomendasi)", km: "2.4 km", menit: 35, aqi: "38 (Baik)", recommended: true },
  { id: "tercepat", label: "Rute Tercepat", km: "1.8 km", menit: 25, aqi: "56 (Sedang)" },
  { id: "teduh", label: "Rute Paling Teduh", km: "3.1 km", menit: 45, aqi: "35 (Baik)" },
  { id: "alt", label: "Rute Alternatif Giri", km: "2.8 km", menit: 38, aqi: "40 (Baik)" },
];
