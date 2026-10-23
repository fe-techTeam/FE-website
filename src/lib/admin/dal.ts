import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/admin/db";
import {
  SESSION_TOUCH_INTERVAL_MS,
  clearSessionCookie,
  readSessionCookie,
} from "@/lib/admin/session";
import {
  can,
  canAccessArea,
  type AdminArea,
  type Capability,
  type ModuleAccess,
  type SessionUser,
} from "@/lib/admin/permissions";

/**
 * Feature 1 — the authoritative session check. The `proxy.ts` cookie check is
 * only an optimistic pre-filter; this hits the database, so a revoked session
 * or a disabled user is rejected on the very next request.
 *
 * Memoised per render pass with React `cache`.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const payload = await readSessionCookie();
  if (!payload) return null;

  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: { include: { permissions: true } } },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt < new Date() ||
    session.userId !== payload.userId ||
    session.user.status !== "ACTIVE"
  ) {
    return null;
  }

  // Keep "last seen" fresh without writing on every single request.
  if (Date.now() - session.lastSeenAt.getTime() > SESSION_TOUCH_INTERVAL_MS) {
    await prisma.session
      .update({ where: { id: session.id }, data: { lastSeenAt: new Date() } })
      .catch(() => undefined);
  }

  const permissions: SessionUser["permissions"] = {};
  for (const entry of session.user.permissions) {
    permissions[entry.module] = {
      view: entry.canView,
      edit: entry.canEdit,
      publish: entry.canPublish,
      delete: entry.canDelete,
    };
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    title: session.user.title,
    permissions,
  };
});

/** Redirects to the login page when there is no valid session. */
export async function requireUser(returnTo?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    await clearSessionCookie().catch(() => undefined);
    const target = returnTo ? `/admin/login?next=${encodeURIComponent(returnTo)}` : "/admin/login";
    redirect(target);
  }
  return user;
}

export async function requireCapability(
  capability: Capability,
  moduleKey: string,
): Promise<SessionUser> {
  const user = await requireUser();
  if (!can(user, capability, moduleKey)) {
    redirect(`/admin/denied?module=${encodeURIComponent(moduleKey)}&need=${capability}`);
  }
  return user;
}

export async function requireArea(area: AdminArea): Promise<SessionUser> {
  const user = await requireUser();
  if (!canAccessArea(user, area)) {
    redirect(`/admin/denied?area=${area}`);
  }
  return user;
}

/**
 * Server-action guard. Unlike `requireCapability` it throws instead of
 * redirecting, so the calling action can return a form error.
 */
export async function assertCapability(
  capability: Capability,
  moduleKey: string,
): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AdminAuthError("Your session has expired. Sign in again.");
  if (!can(user, capability, moduleKey)) {
    throw new AdminAuthError("You do not have permission to do that.");
  }
  return user;
}

export async function assertArea(area: AdminArea): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AdminAuthError("Your session has expired. Sign in again.");
  if (!canAccessArea(user, area)) {
    throw new AdminAuthError("You do not have permission to do that.");
  }
  return user;
}

export class AdminAuthError extends Error {}

export function accessFor(user: SessionUser, moduleKey: string): ModuleAccess {
  return {
    view: can(user, "view", moduleKey),
    edit: can(user, "edit", moduleKey),
    publish: can(user, "publish", moduleKey),
    delete: can(user, "delete", moduleKey),
  };
}

/** Best-effort client IP + user agent, used for sessions and the audit log. */
export async function requestContext(): Promise<{ ip: string | null; userAgent: string | null }> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || list.get("x-real-ip") || null;
  return { ip, userAgent: list.get("user-agent") };
}
