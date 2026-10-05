import { NextResponse } from "next/server";
import { ADMIN_RESOURCES } from "@/lib/adminResources";
import { proxyAdminMutation } from "@/lib/laravelClient";

async function resolve(params) {
  const { resource, id } = await params;
  const base = ADMIN_RESOURCES[resource];
  if (!base || !/^\d+$/.test(id)) return null;
  return `${base}/${id}`;
}

// PUT /api/admin/proxy/{resource}/{id} -> ubah data
export async function PUT(request, { params }) {
  const path = await resolve(params);
  if (!path) return NextResponse.json({ message: "Resource tidak dikenal." }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const { status, json } = await proxyAdminMutation("PUT", path, body);
  return NextResponse.json(json, { status });
}

// DELETE /api/admin/proxy/{resource}/{id} -> hapus data
export async function DELETE(_request, { params }) {
  const path = await resolve(params);
  if (!path) return NextResponse.json({ message: "Resource tidak dikenal." }, { status: 404 });

  const { status, json } = await proxyAdminMutation("DELETE", path);
  return NextResponse.json(json, { status });
}
