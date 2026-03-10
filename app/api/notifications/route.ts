import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data/notifications";

// GET /api/notifications
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ notifications: MOCK_NOTIFICATIONS });
}

// PATCH /api/notifications — mark notification as read (client manages read state)
export async function PATCH(request: Request) {
  const { id } = await request.json();
  return NextResponse.json({ success: true, id });
}
