// SVARGA Admin — Seed data awal ke PostgreSQL, mengikuti angka-angka yang
// tampil di seluruh mockup dashboard (Dashboard, Monitoring Lingkungan,
// Sensor IoT, Pengguna, Mood & Wellbeing, Geofencing, Kalender Festival BWI).
//
// Jalankan: npx prisma db seed  (setelah migrate)

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function seedContent() {
  // Seed ini sengaja BUKAN upsert satu-satu (data contoh tidak butuh key
  // alami yang stabil) — supaya `npx prisma db seed` selalu aman dijalankan
  // ulang kapan saja (misalnya setelah percobaan sebelumnya gagal di
  // tengah jalan), semua data contoh dibersihkan dulu di sini, urut dari
  // tabel "anak" ke tabel "induk" supaya tidak melanggar foreign key.
  await prisma.sensorReading.deleteMany();
  await prisma.moodLog.deleteMany();
  await prisma.geofence.deleteMany();
  await prisma.umkm.deleteMany();
  await prisma.event.deleteMany();
  await prisma.appUser.deleteMany();
  await prisma.notificationLog.deleteMany();
  await prisma.integrationSetting.deleteMany();
  await prisma.sensorDevice.deleteMany();
  await prisma.koridor.deleteMany();
  await prisma.greenSpace.deleteMany();

  const sritanjung = await prisma.greenSpace.create({
    data: {
      name: "Taman Sritanjung",
      locationType: "taman",
      latitude: -8.21944,
      longitude: 114.36972,
      address: "Jl. Jaksa Agung Suprapto, Banyuwangi",
      shadeScore: 62,
    },
  });

  const blambangan = await prisma.greenSpace.create({
    data: {
      name: "Taman Blambangan",
      locationType: "taman",
      latitude: -8.2175,
      longitude: 114.3675,
      address: "Jl. Ahmad Yani, Banyuwangi",
      shadeScore: 58,
    },
  });

  const koridorBlambangan = await prisma.koridor.create({
    data: {
      greenSpaceId: blambangan.id,
      koridorName: "Koridor 4: Blambangan",
      shortName: "Koridor 3 Blambangan",
      hijauLevel: "paling_hijau",
      hijauScore: 5,
      distanceMeter: 350,
      estimateMinutes: 5,
      shadeScore: 79,
      airQualityScore: 74,
      status: "rencana",
    },
  });

  // --- Sensor IoT (Sensor IoT page: 126 total, 120 aktif, 6 offline, 3 perlu perbaikan) ---
  const deviceSeeds = [
    { deviceCode: "AQI-BLAMBANGAN", deviceType: "Kualitas Udara", locationName: "Banyuwangi Kota", isActive: true },
    { deviceCode: "AQI-PANTAI-BOOM", deviceType: "Kualitas Udara", locationName: "Banyuwangi Kota", isActive: true },
    { deviceCode: "SUHU-ALUN-ALUN", deviceType: "Suhu", locationName: "Rogojampi", isActive: true },
    { deviceCode: "BISING-LATENG", deviceType: "Kebisingan", locationName: "Kabat", isActive: true },
    { deviceCode: "UV-SITUBONDO", deviceType: "UV Index", locationName: "Giri", isActive: true },
    { deviceCode: "LEMBAB-IJEN", deviceType: "Kelembapan", locationName: "Kawasan Ijen", isActive: false, needsRepair: true },
  ];
  const devices = [];
  for (const d of deviceSeeds) {
    devices.push(await prisma.sensorDevice.create({ data: { ...d, greenSpaceId: blambangan.id } }));
  }

  await prisma.sensorReading.createMany({
    data: [
      { deviceId: devices[0].id, metricType: "aqi", value: 56, status: "Sedang" },
      { deviceId: devices[1].id, metricType: "aqi", value: 38, status: "Baik" },
      { deviceId: devices[2].id, metricType: "suhu", value: 28, status: "Nyaman" },
      { deviceId: devices[3].id, metricType: "kebisingan", value: 56, status: "Sedang" },
      { deviceId: devices[4].id, metricType: "uv", value: 44, status: "Baik" },
      { deviceId: devices[5].id, metricType: "kelembaban", value: 48, status: "Baik" },
    ],
  });

  // --- Mood logs (Mood & Wellbeing: 4.890 catatan, 24% Sangat Baik, dst.) ---
  const moodDistribution = [
    { score: 5, count: 1173 }, // Sangat Baik 24%
    { score: 4, count: 1662 }, // Baik 34%
    { score: 3, count: 1124 }, // Biasa Saja 23%
    { score: 2, count: 538 },  // Buruk 11%
    { score: 1, count: 193 },  // Sangat Buruk 4%
  ];
  for (const m of moodDistribution) {
    // Disimpan sebagai 1 baris agregat + count, bukan 4.890 baris individual,
    // supaya seed cepat. Skema aslinya tetap 1 baris = 1 catatan (lihat schema.prisma).
    await prisma.moodLog.create({
      data: { greenSpaceId: sritanjung.id, moodScore: m.score, note: `agregat_seed_count:${m.count}` },
    });
  }

  // --- Geofencing zones (Geofencing page) ---
  await prisma.geofence.createMany({
    data: [
      { greenSpaceId: blambangan.id, name: "Taman Blambangan", location: "Banyuwangi Kota", areaHectare: 12.5, latitude: -8.2175, longitude: 114.3675, broadcastType: "Audio & Info", isActive: true, welcomeTitle: "Selamat datang di Taman Blambangan!", welcomeDesc: "Nikmati suasana hijau dan musik relaksasi untuk membantu fokusmu." },
      { greenSpaceId: blambangan.id, name: "Pantai Boom", location: "Banyuwangi Kota", areaHectare: 8.3, latitude: -8.2298, longitude: 114.3822, broadcastType: "Audio & Musik", isActive: true },
      { name: "Alun-Alun Banyuwangi", location: "Banyuwangi Kota", areaHectare: 5.2, latitude: -8.2145, longitude: 114.3691, broadcastType: "Info & Edukasi", isActive: true },
      { name: "Kantor Situbondo", location: "Giri", areaHectare: 3.1, latitude: -8.19, longitude: 114.32, broadcastType: "Musik Relaksasi", isActive: true },
      { name: "Kawasan Ijen", location: "Kawasan Ijen", areaHectare: 10.7, latitude: -8.0585, longitude: 114.2415, broadcastType: "Audio & Info", isActive: false },
    ],
  });

  // --- UMKM ---
  await prisma.umkm.createMany({
    data: [
      { koridorId: koridorBlambangan.id, greenSpaceId: blambangan.id, businessName: "Warung Bu Sari", businessType: "Makanan", distanceM: 120, rating: 4.8 },
      { koridorId: koridorBlambangan.id, greenSpaceId: blambangan.id, businessName: "Es Dawet Mbak Tini", businessType: "Minuman Tradisional", distanceM: 200, rating: 4.6 },
    ],
  });

  // --- Event festival (Kalender Festival BWI) ---
  await prisma.event.createMany({
    data: [
      {
        greenSpaceId: blambangan.id,
        title: "Banyuwangi Ethno Carnival 2026",
        description:
          "Banyuwangi Ethno Carnival (BEC) tahun ini mengangkat tema keagungan warisan budaya lokal Banyuwangi. Event kolosal ini akan menampilkan ratusan peraga busana kontemporer berbasis budaya adat yang ramah lingkungan dan terintegrasi dengan sensor kesehatan Smart Green Route.",
        eventDate: new Date("2026-05-15"),
        startTime: "08:00",
        endTime: "15:00",
        routeInfo: "Lorong Taman Blambangan - Kantor Bupati",
        routeCount: 3,
        notifSent: 8245,
        umkmCount: 120,
      },
      { title: "Festival Gandrung Sewu", eventDate: new Date("2026-05-24"), routeInfo: "Pantai Boom" },
      { title: "Festival Sulur Kembang", eventDate: new Date("2026-06-02"), routeInfo: "Taman Blambangan" },
      { title: "Carnaval Kebangsaan", eventDate: new Date("2026-06-02"), routeInfo: "Taman Blambangan" },
    ],
  });

  // --- App users (Pengguna page) ---
  await prisma.appUser.createMany({
    data: [
      { name: "Andi Setiawan", email: "andi@email.com", status: "aktif" },
      { name: "Siti Aisyah", email: "siti@email.com", status: "aktif" },
      { name: "Budi Santoso", email: "budi@email.com", status: "aktif" },
      { name: "Dewi Lestari", email: "dewi@email.com", status: "aktif" },
      { name: "Rizky Pratama", email: "rizky@email.com", status: "nonaktif" },
    ],
  });

  // --- Notifikasi log ---
  await prisma.notificationLog.createMany({
    data: [
      { category: "lingkungan", title: "Peringatan Kualitas Udara Rogojampi", description: "Indeks AQI meningkat di atas 105 (Tidak Sehat untuk Kelompok Sensitif) karena polusi kendaraan malam hari.", isRead: false },
      { category: "sensor", title: "Sensor IoT #048 Offline - Pantai Boom", description: "Konektivitas dengan modul pemantau kelembapan udara terputus sejak pukul 14:15 WIB. Butuh pengecekan perangkat.", isRead: false },
      { category: "festival", title: "Event Festival Baru Ditambahkan", description: "Pemerintah Kabupaten menyetujui jadwal baru 'Banyuwangi Ethno Carnival' pada 15 Mei 2026.", isRead: true },
      { category: "pengguna", title: "Registrasi Pengguna Baru Meningkat", description: "Terdeteksi lonjakan 120 pendaftaran akun baru dalam 24 jam terakhir didominasi wilayah Kabat.", isRead: true },
      { category: "lingkungan", title: "Geofencing Terlewati - Kawasan Industri Ketapang", description: "Sebanyak 840 pengguna aktif terdeteksi memasuki zona pemantauan kualitas udara khusus di Ketapang.", isRead: true },
      { category: "pengguna", title: "Laporan Mood Mingguan Selesai", description: "Statistik mingguan menunjukkan tingkat wellbeing masyarakat Banyuwangi stabil dengan 58% mencatat emosi positif.", isRead: true },
    ],
  });

  // --- Integrasi ---
  await prisma.integrationSetting.createMany({
    data: [
      { key: "kalender_bwi", label: "Integrasi Kalender Festival BWI", description: "Sinkronisasi event festival dan sistem BWI agar jadwal pariwisata terupdate real-time.", isConnected: true },
      { key: "sensor_iot", label: "Integrasi Sensor IoT", description: "Kelola koneksi, transmisi, dan telemetri informasi sensor di seluruh wilayah Rogojampi.", isConnected: true },
      { key: "geofencing", label: "Integrasi Geofencing", description: "Konfigurasi konten audio otomatis, trigger notifikasi zonasi, dan log presensi pengunjung.", isConnected: true },
      { key: "email", label: "Integrasi Email", description: "Pengiriman otomatis laporan analisis mingguan dan notifikasi peringatan polusi via email.", isConnected: true },
    ],
  });

  console.log("✓ Seed selesai.");
}

async function main() {
  // Akun admin default — kredensial ini yang didokumentasikan di README &
  // ditampilkan sebagai hint di halaman login (mode mock memakai kredensial
  // yang sama persis supaya tidak membingungkan saat berpindah mode).
  const passwordHash = await bcrypt.hash("svarga123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@svarga.id" },
    update: {},
    create: { name: "Ahmad Fauzi", email: "admin@svarga.id", passwordHash, role: "super_admin" },
  });
  console.log("✓ Admin default: admin@svarga.id / svarga123");

  await seedContent();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
