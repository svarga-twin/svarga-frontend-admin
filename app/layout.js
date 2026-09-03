import "./globals.css";

export const metadata = {
  title: "SVARGA Admin — Dashboard Pemkab Banyuwangi",
  description: "Dashboard Admin untuk memantau kondisi lingkungan, mood masyarakat, sensor IoT, dan geofencing SVARGA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- aturan ini untuk Pages Router;
            menaruh <link> font di root layout App Router adalah pola yang benar & didukung Next.js.
            Dipakai <link> (bukan next/font/google) supaya build tidak butuh akses jaringan ke
            fonts.googleapis.com saat compile-time — lihat catatan di README. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-sand-100">{children}</body>
    </html>
  );
}
