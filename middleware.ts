import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "cardiq-dev-secret-change-in-production"
);
const COOKIE_NAME = "cardiq_session";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isOnboarding = pathname.startsWith("/onboarding");
  const isApi = pathname.startsWith("/api/");

  // API routes handle their own auth checks internally
  if (isApi) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isAuthed = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthed = true;
    } catch {
      isAuthed = false;
    }
  }

  // Unauthenticated users can't access app or onboarding pages
  if (!isAuthed && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated users shouldn't see login/signup
  if (isAuthed && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Authenticated users can freely access onboarding
  if (isAuthed && isOnboarding) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
