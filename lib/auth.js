// SVARGA Admin — sesi login sederhana (cookie ber-signature HMAC).
//
// CATATAN: ini BUKAN pengganti NextAuth/Auth.js produksi — dibuat ringan
// supaya tidak menambah dependency besar untuk prototipe ini. Untuk
// produksi sungguhan, migrasikan ke NextAuth atau Firebase Admin SDK verify
// ID token (lihat README bagian "Autentikasi Admin").
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "svarga_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-secret-tidak-aman-ganti-di-env";
const MAX_AGE = 60 * 60 * 8; // 8 jam

function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verify(token) {
  if (!token || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString());
  } catch {
    return null;
  }
}

/** Dipanggil dari Route Handler (app/api/auth/login) setelah kredensial valid. */
export async function createSession(user) {
  const token = sign({ id: user.id, name: user.name, email: user.email, role: user.role, iat: Date.now() });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Dipanggil dari Server Component (layout dashboard) untuk cek status login. */
export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verify(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
