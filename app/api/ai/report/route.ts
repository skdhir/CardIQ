import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

const REPORTS_PATH = path.join(process.cwd(), ".data", "reports.json");

interface Report {
  id: string;
  userId: string;
  context: string;
  feedback: string;
  timestamp: string;
}

function readReports(): Report[] {
  try {
    if (fs.existsSync(REPORTS_PATH)) {
      return JSON.parse(fs.readFileSync(REPORTS_PATH, "utf-8"));
    }
  } catch {
    // Corrupted file — start fresh
  }
  return [];
}

function writeReports(reports: Report[]) {
  const dir = path.dirname(REPORTS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REPORTS_PATH, JSON.stringify(reports, null, 2));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { context, feedback } = body;

  if (!context || !feedback || typeof feedback !== "string") {
    return NextResponse.json({ error: "Context and feedback required" }, { status: 400 });
  }

  const reports = readReports();
  reports.push({
    id: crypto.randomUUID(),
    userId: session.userId,
    context,
    feedback: feedback.slice(0, 1000), // Limit length
    timestamp: new Date().toISOString(),
  });
  writeReports(reports);

  return NextResponse.json({ success: true });
}
