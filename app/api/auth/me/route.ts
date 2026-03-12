import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Try file-based user record first; fall back to JWT session data.
  // On serverless, the user file may not exist on this Lambda instance —
  // the JWT carries name + email so the sidebar always shows "Hi, Name".
  const user = getUserById(session.userId);
  const name = user?.name ?? session.name ?? null;
  const email = user?.email ?? session.email;

  return NextResponse.json({ name, email });
}
