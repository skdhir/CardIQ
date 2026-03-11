import { NextResponse } from "next/server";
import { clearSessionCookie, clearPortfolioCookie } from "@/lib/auth";

export async function POST() {
  await clearSessionCookie();
  clearPortfolioCookie();
  return NextResponse.json({ success: true });
}
