// SVARGA Admin — Prisma client singleton.
//
// PENTING: file ini HANYA dipanggil dari cabang "real" (non-mock) di tiap
// services/*.js. Selama DATABASE_URL kosong (USE_MOCK=true), fungsi
// getPrisma() tidak pernah dipanggil sama sekali, sehingga project tetap
// bisa di-build/dijalankan meski `npx prisma generate` belum pernah
// dijalankan (mis. di lingkungan tanpa akses jaringan ke binary Prisma).

let prismaInstance;

export function getPrisma() {
  if (!prismaInstance) {
    // require() dinamis (bukan import statis) supaya modul ini tidak perlu
    // di-resolve sampai benar-benar dipanggil di runtime.
    const { PrismaClient } = require("@prisma/client");
    prismaInstance = global.__svargaPrisma ?? new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
      global.__svargaPrisma = prismaInstance;
    }
  }
  return prismaInstance;
}
