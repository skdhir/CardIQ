import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { upsertBenefitTracking } from "@/lib/db";

// PATCH /api/benefits/[id] — update benefit tracking status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: benefitId } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, amountUsed } = await request.json();

  upsertBenefitTracking(session.userId, benefitId, status, amountUsed ?? 0);

  return NextResponse.json({ success: true });
}
