// SVARGA Admin — buat/reset akun admin di PostgreSQL asli.
//
// Dipakai SETELAH `npx prisma migrate dev` & `npx prisma db seed` (yang
// mengisi AdminUser dengan password default "svarga123" ter-hash). Script
// ini untuk mengganti password atau menambah admin baru.
//
// Cara pakai:
//   node scripts/createAdminUser.js admin@svarga.id "kata sandi baru" "Nama Admin"

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const [, , email, password, name = "Admin"] = process.argv;

if (!email || !password) {
  console.error("Pemakaian: node scripts/createAdminUser.js <email> <password> [nama]");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("✗ DATABASE_URL belum diisi di .env — script ini butuh PostgreSQL asli, bukan mode mock.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, name },
    create: { email: email.toLowerCase(), passwordHash, name, role: "admin" },
  });
  console.log(`✓ Admin siap: ${admin.email} (${admin.name})`);
}

main()
  .catch((err) => {
    console.error("✗ Gagal:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
