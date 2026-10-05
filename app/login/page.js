"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "@/components/ui/AppIcon";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Gagal masuk.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-canopy-700 px-6">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="flex items-center gap-2.5">
          <span className="h-11 w-11 rounded-2xl bg-white text-canopy-700 flex items-center justify-center">
            <Leaf size={22} />
          </span>
          <span className="font-display font-bold text-2xl text-sand-50 tracking-wide">SVARGA</span>
        </div>
        <p className="text-sand-100/85 mt-2 text-sm">Sehat. Nyaman. Terhubung.</p>

        <form onSubmit={handleSubmit} className="w-full mt-10 flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email/Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-sand-50/40 rounded-full px-5 py-3.5 text-sand-50 placeholder:text-sand-100/70 outline-none focus:border-sand-50"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-sand-50/40 rounded-full px-5 py-3.5 text-sand-50 placeholder:text-sand-100/70 outline-none focus:border-sand-50"
          />

          {error && (
            <p className="text-sm text-white bg-alert-600/40 border border-alert-600/60 rounded-xl px-4 py-2.5" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sand-100 text-canopy-700 rounded-full py-3.5 font-medium mt-2 hover:bg-white transition-colors disabled:opacity-60"
          >
            {loading ? "Memproses…" : "Login"}
          </button>
        </form>

        <p className="text-xs text-sand-100/60 mt-8 text-center leading-relaxed">
          Mode demo: admin@svarga.id / svarga123
          <br />
          Khusus untuk Admin Pemkab Banyuwangi.
        </p>
      </div>
    </div>
  );
}
