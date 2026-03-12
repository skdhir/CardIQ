import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { clearUserDataCookie } from "@/lib/db";

export async function POST() {
  await clearSessionCookie();
  clearUserDataCookie();
  return NextResponse.json({ success: true });
}
