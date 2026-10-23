import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Next.js 16 renamed Middleware to Proxy. This is an *optimistic* check only:
 * it reads the session cookie to bounce obviously-signed-out visitors away
 * from `/admin` without a database round trip on every prefetch.
 *
 * The authoritative check lives in `src/lib/admin/dal.ts`, which verifies the
 * session against the database on each request.
 */

const SESSION_COOKIE = "fe_admin_session";
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const hasSession = await looksSignedIn(token);

  if (isPublicAdminPath) {
    // Already signed in? Skip the login screen.
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Login/reset screens are public, so they need the noindex header too (the layout meta alone is not enough for non-HTML fetchers).
    const publicResponse = NextResponse.next();
    publicResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    return publicResponse;
  }

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    const target = `${pathname}${search}`;
    if (target !== "/admin") loginUrl.searchParams.set("next", target);
    return NextResponse.redirect(loginUrl);
  }

  // Admin pages must never be cached by a CDN or the browser's bfcache.
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

async function looksSignedIn(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
