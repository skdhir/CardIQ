/**
 * File-based data store — replaces Supabase.
 * Data lives in .data/ (gitignored). Each user gets their own JSON file.
 * Runs only on the server (Node.js fs).
 */

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type { BenefitStatus } from "@/types";
import { DEMO_CUSTOMERS } from "@/lib/mock-data/demo-customers";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

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

// ─── Per-user data ───────────────────────────────────────────────────────────

function userDataPath(userId: string) {
  return path.join(DATA_DIR, `user_${userId}.json`);
}

function readUserData(userId: string): UserData {
  ensureDir();
  const p = userDataPath(userId);
  if (!fs.existsSync(p)) {
    return { cards: [], benefits: {} };
  }
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeUserData(userId: string, data: UserData) {
  ensureDir();
  fs.writeFileSync(userDataPath(userId), JSON.stringify(data, null, 2));
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
