import { NextResponse } from "next/server";
import { getSession, hashPassword, verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { getUserById, updateUser, deleteUser } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = getUserById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ name: user.name, email: user.email, createdAt: user.createdAt });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = getUserById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await request.json();
  const updates: Parameters<typeof updateUser>[1] = {};

  if (body.name !== undefined) {
    const name = body.name.trim();
    if (!name) return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    updates.name = name;
  }

  if (body.email !== undefined) {
    const email = body.email.trim().toLowerCase();
    if (!email) return NextResponse.json({ error: "Email cannot be empty" }, { status: 400 });
    updates.email = email;
  }

  if (body.newPassword !== undefined) {
    if (!body.currentPassword) {
      return NextResponse.json({ error: "Current password required" }, { status: 400 });
    }
    const valid = await verifyPassword(body.currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }
    updates.passwordHash = await hashPassword(body.newPassword);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  updateUser(session.userId, updates);

  // Refresh session cookie if email changed
  if (updates.email) {
    const token = await createSessionToken({ userId: session.userId, email: updates.email });
    await setSessionCookie(token);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  deleteUser(session.userId);

  return NextResponse.json({ success: true });
}
