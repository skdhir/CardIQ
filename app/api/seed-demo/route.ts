/**
 * POST /api/seed-demo
 * Seeds the 3 demo customer accounts into the file-based database.
 * Safe to call multiple times — skips existing accounts.
 */

import { NextResponse } from "next/server";
import { DEMO_CUSTOMERS } from "@/lib/mock-data/demo-customers";
import { getUserByEmail, createUser, addUserCard, upsertBenefitTracking } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  const results: string[] = [];

  for (const customer of DEMO_CUSTOMERS) {
    // Skip if already exists
    const existing = getUserByEmail(customer.email);
    if (existing) {
      results.push(`⏭ Skipped ${customer.email} (already exists)`);
      continue;
    }

    // Create user
    const passwordHash = await hashPassword(customer.password);
    const user = {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    createUser(user);

    // Add cards
    for (const cardId of customer.cardIds) {
      addUserCard(customer.id, cardId);
    }

    // Seed benefit usage
    for (const [benefitId, usage] of Object.entries(customer.benefitUsage)) {
      upsertBenefitTracking(customer.id, benefitId, usage.status, usage.amountUsed);
    }

    results.push(`✅ Created ${customer.email} (${customer.name}) — ${customer.cardIds.length} cards, ${Object.keys(customer.benefitUsage).length} benefits`);
  }

  return NextResponse.json({ success: true, results });
}
