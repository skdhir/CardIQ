/**
 * Auth helpers — JWT sessions via cookies, passwords hashed with bcryptjs.
 * No external service required.
 */

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "cardiq-dev-secret-change-in-production"
);
const COOKIE_NAME = "cardiq_session";
const PORTFOLIO_COOKIE = "cardiq_portfolio";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  userId: string;
  email: string;
}

// ─── Password helpers ─────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── JWT helpers ──────────────────────────────────────────────────────────────

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers (server-side) ────────────────────────────────────────────

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;

// ─── Portfolio cookie (serverless persistence) ──────────────────────────────
// Stores card IDs so any Lambda instance can re-hydrate user data from the cookie.

export function getPortfolioFromCookie(): string[] {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get(PORTFOLIO_COOKIE)?.value;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setPortfolioCookie(cardIds: string[]) {
  const cookieStore = cookies();
  cookieStore.set(PORTFOLIO_COOKIE, JSON.stringify(cardIds), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export function clearPortfolioCookie() {
  const cookieStore = cookies();
  cookieStore.delete(PORTFOLIO_COOKIE);
}
