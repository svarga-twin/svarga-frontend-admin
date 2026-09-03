import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { USE_MOCK } from "@/lib/config";
import { createSession } from "@/lib/auth";

// Kredensial demo untuk mode mock (DATABASE_URL kosong) — dokumentasikan di README.
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

  if (USE_MOCK) {
    if (email.toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
      return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
    }
    await createSession(DEMO_ADMIN);
    return NextResponse.json({ ok: true });
  }

  // Mode real (PostgreSQL via Prisma) — lihat lib/prisma.js.
  const { getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin) {
    return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
  }
  await createSession(admin);
  return NextResponse.json({ ok: true });
}
