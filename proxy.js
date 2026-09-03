// SVARGA Admin — proteksi rute dashboard.
//
// PENTING: sejak Next.js 16, file ini bernama `proxy.js` (bukan lagi
// `middleware.js`) — lihat AGENTS.md & node_modules/next/dist/docs/.
// Fungsinya sama seperti middleware versi sebelumnya.
import { NextResponse } from "next/server";

const COOKIE_NAME = "svarga_admin_session";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/login";
  const hasSession = request.cookies.has(COOKIE_NAME);

  if (!hasSession && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (hasSession && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
