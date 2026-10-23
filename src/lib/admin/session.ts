import "server-only";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "fe_admin_session";
export const SESSION_TTL_DAYS = 7;
/** Refresh the DB `lastSeenAt` at most once every 15 minutes. */
export const SESSION_TOUCH_INTERVAL_MS = 15 * 60 * 1000;

export type SessionPayload = {
  sessionId: string;
  userId: string;
};

let cachedKey: Uint8Array | null = null;

function secretKey(): Uint8Array {
  if (cachedKey) return cachedKey;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to at least 32 characters. Generate one with: openssl rand -base64 48",
    );
  }

  cachedKey = new TextEncoder().encode(secret);
  return cachedKey;
}

export async function encryptSession(payload: SessionPayload, expiresAt: Date): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secretKey());
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (!payload.sessionId || !payload.userId) return null;
    return { sessionId: payload.sessionId, userId: payload.userId };
  } catch {
    return null;
  }
}

export function sessionExpiry(from: Date = new Date()): Date {
  return new Date(from.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function readSessionCookie(): Promise<SessionPayload | null> {
  const store = await cookies();
  return decryptSession(store.get(SESSION_COOKIE)?.value);
}
