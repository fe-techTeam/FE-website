import "server-only";

import bcrypt from "bcryptjs";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string | null): Promise<boolean> {
  // Always run a comparison so a missing hash costs the same as a wrong password.
  const target = hash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
  const ok = await bcrypt.compare(plain, target);
  return hash ? ok : false;
}

// Rules live in a client-safe module so login/account forms can show them.
export { PASSWORD_RULES, passwordIssues } from "@/lib/admin/password-rules";

/** Raw token goes in the emailed link; only the SHA-256 hash is stored. */
export function createAuthToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashAuthToken(token) };
}

export function hashAuthToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
