import { NextResponse } from "next/server";
import { ADMIN_RESOURCES } from "@/lib/adminResources";
import { proxyAdminMutation } from "@/lib/laravelClient";

// POST /api/admin/proxy/{users|geofences|festivals} -> buat data baru di Laravel
export async function POST(request, { params }) {
  const { resource } = await params;
  const path = ADMIN_RESOURCES[resource];
  if (!path) return NextResponse.json({ message: "Resource tidak dikenal." }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const { status, json } = await proxyAdminMutation("POST", path, body);
  return NextResponse.json(json, { status });
}
