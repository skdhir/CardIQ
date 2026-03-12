/**
 * File-based data store — replaces Supabase.
 * Data lives in .data/ (gitignored). Each user gets their own JSON file.
 * Runs only on the server (Node.js fs).
 *
 * On serverless (AWS Amplify / Lambda), the filesystem is ephemeral — each
 * instance has its own disk. To keep user data consistent across instances,
 * every read/write goes through a cookie fallback automatically:
 *   readUserData  → try file → if empty, try cookie → re-hydrate file
 *   writeUserData → write file + update cookie
 * This means NO endpoint needs to think about cookies or Lambda — the data
 * layer handles it in one place.
 */

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { BenefitStatus } from "@/types";
import { DEMO_CUSTOMERS } from "@/lib/mock-data/demo-customers";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const USERDATA_COOKIE = "cardiq_userdata";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function ensureDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error("Could not create data dir:", e);
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface BenefitTrackingRecord {
  benefitId: string;
  status: BenefitStatus;
  amountUsed: number;
  lastUpdated: string;
}

export interface UserData {
  cards: string[];                            // card IDs
  benefits: Record<string, BenefitTrackingRecord>; // benefitId → record
}

// ─── Auto-seed demo data on cold start ──────────────────────────────────────

let seeded = false;

function ensureDemoData() {
  if (seeded) return;
  seeded = true;
  ensureDir();
  if (fs.existsSync(USERS_FILE)) return; // already have data

  const users: StoredUser[] = [];
  for (const customer of DEMO_CUSTOMERS) {
    const passwordHash = bcrypt.hashSync(customer.password, 12);
    users.push({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    // Seed per-user data (cards + benefits)
    const userData: UserData = { cards: [...customer.cardIds], benefits: {} };
    for (const [benefitId, usage] of Object.entries(customer.benefitUsage)) {
      userData.benefits[benefitId] = {
        benefitId,
        status: usage.status,
        amountUsed: usage.amountUsed,
        lastUpdated: new Date().toISOString(),
      };
    }
    fs.writeFileSync(userDataPath(customer.id), JSON.stringify(userData, null, 2));
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log(`[CardIQ] Auto-seeded ${users.length} demo accounts`);
}

// ─── Users ───────────────────────────────────────────────────────────────────

function readUsers(): StoredUser[] {
  ensureDemoData();
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function writeUsers(users: StoredUser[]) {
  ensureDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function getUserByEmail(email: string): StoredUser | undefined {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): StoredUser | undefined {
  return readUsers().find((u) => u.id === id);
}

export function createUser(user: StoredUser) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

export function updateUser(id: string, updates: Partial<Pick<StoredUser, "name" | "email" | "passwordHash">>) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], ...updates };
  writeUsers(users);
  return true;
}

export function deleteUser(id: string) {
  const users = readUsers();
  const filtered = users.filter((u) => u.id !== id);
  writeUsers(filtered);
  const p = userDataPath(id);
  try {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  } catch { /* ignore */ }
}

// ─── Per-user data ───────────────────────────────────────────────────────────

function userDataPath(userId: string) {
  return path.join(DATA_DIR, `user_${userId}.json`);
}

// ─── Cookie-backed persistence ──────────────────────────────────────────────
// These helpers silently no-op outside a request context (e.g. during demo seeding).

function readUserDataCookie(): UserData | null {
  try {
    const raw = cookies().get(USERDATA_COOKIE)?.value;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.cards)) return parsed as UserData;
    return null;
  } catch {
    return null;
  }
}

function writeUserDataCookie(data: UserData) {
  try {
    cookies().set(USERDATA_COOKIE, JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  } catch {
    // Not in request context (cold-start seeding) — skip silently
  }
}

export function clearUserDataCookie() {
  try {
    cookies().delete(USERDATA_COOKIE);
  } catch {
    // Not in request context — skip
  }
}

// ─── Core read / write ──────────────────────────────────────────────────────

function readUserData(userId: string): UserData {
  ensureDemoData();
  const p = userDataPath(userId);

  // 1. Try the file on this instance
  if (fs.existsSync(p)) {
    const fileData = JSON.parse(fs.readFileSync(p, "utf-8")) as UserData;
    if (fileData.cards.length > 0) return fileData;
  }

  // 2. File empty or missing — try cookie (cross-instance fallback)
  const cookieData = readUserDataCookie();
  if (cookieData && cookieData.cards.length > 0) {
    // Re-hydrate this instance's disk from the cookie
    ensureDir();
    fs.writeFileSync(p, JSON.stringify(cookieData, null, 2));
    return cookieData;
  }

  return { cards: [], benefits: {} };
}

function writeUserData(userId: string, data: UserData) {
  ensureDir();
  fs.writeFileSync(userDataPath(userId), JSON.stringify(data, null, 2));
  // Sync to cookie so the next Lambda instance can read it
  writeUserDataCookie(data);
}

// ─── Card operations ─────────────────────────────────────────────────────────

export function getUserCards(userId: string): string[] {
  return readUserData(userId).cards;
}


export function addUserCard(userId: string, cardId: string) {
  const data = readUserData(userId);
  if (!data.cards.includes(cardId)) data.cards.push(cardId);
  writeUserData(userId, data);
}

export function removeUserCard(userId: string, cardId: string) {
  const data = readUserData(userId);
  data.cards = data.cards.filter((c) => c !== cardId);
  writeUserData(userId, data);
}

// ─── Benefit tracking operations ─────────────────────────────────────────────

export function getBenefitTracking(userId: string): Record<string, BenefitTrackingRecord> {
  return readUserData(userId).benefits;
}

export function upsertBenefitTracking(
  userId: string,
  benefitId: string,
  status: BenefitStatus,
  amountUsed: number
) {
  const data = readUserData(userId);
  data.benefits[benefitId] = {
    benefitId,
    status,
    amountUsed,
    lastUpdated: new Date().toISOString(),
  };
  writeUserData(userId, data);
}
