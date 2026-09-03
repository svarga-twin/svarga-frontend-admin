import { NextResponse } from "next/server";
import { markAllAsRead } from "@/lib/services/notificationService";

export async function POST() {
  await markAllAsRead();
  return NextResponse.json({ ok: true });
}
