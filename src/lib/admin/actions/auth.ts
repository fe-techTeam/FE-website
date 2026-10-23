"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/admin/db";
import { writeAudit } from "@/lib/admin/audit";
import { getSessionUser, requestContext } from "@/lib/admin/dal";
import {
  createAuthToken,
  hashAuthToken,
  hashPassword,
  verifyPassword,
} from "@/lib/admin/password";
import {
  clearSessionCookie,
  encryptSession,
  readSessionCookie,
  sessionExpiry,
  setSessionCookie,
} from "@/lib/admin/session";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/lib/admin/schemas";
import { fieldErrorsOf } from "@/lib/admin/actions/types";
import type { ActionState } from "@/lib/admin/actions/types";


/** Only allow same-origin relative paths as a post-login redirect. */
function safeNext(value: string | undefined | null): string {
  if (!value) return "/admin";
  if (!value.startsWith("/admin") || value.startsWith("//")) return "/admin";
  return value;
}

// ---------------------------------------------------------------------------
// Sign in / sign out
// ---------------------------------------------------------------------------

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Run the hash comparison even when the user is missing so the response time
  // does not reveal whether an account exists.
  const passwordOk = await verifyPassword(password, user?.passwordHash ?? null);

  if (!user || !passwordOk || user.status !== "ACTIVE") {
    await writeAudit({
      actor: { email, name: "Unknown" },
      action: "LOGIN_FAILED",
      entityType: "auth",
      summary:
        user && user.status !== "ACTIVE"
          ? `Sign-in blocked — account is ${user.status.toLowerCase()}`
          : "Sign-in failed — wrong email or password",
    });

    return {
      ok: false,
      message:
        user && user.status === "DISABLED"
          ? "This account has been disabled. Ask a Super Admin to re-enable it."
          : "Email or password is incorrect.",
    };
  }

  const { ip, userAgent } = await requestContext();
  const expiresAt = sessionExpiry();

  const session = await prisma.session.create({
    data: { userId: user.id, expiresAt, ip, userAgent },
  });

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const token = await encryptSession({ sessionId: session.id, userId: user.id }, expiresAt);
  await setSessionCookie(token, expiresAt);

  await writeAudit({
    actor: user,
    action: "LOGIN",
    entityType: "auth",
    summary: "Signed in",
  });

  redirect(safeNext(parsed.data.next));
}

export async function logoutAction(): Promise<void> {
  const payload = await readSessionCookie();
  const user = await getSessionUser();

  if (payload) {
    await prisma.session
      .update({ where: { id: payload.sessionId }, data: { revokedAt: new Date() } })
      .catch(() => undefined);
  }

  if (user) {
    await writeAudit({ actor: user, action: "LOGOUT", entityType: "auth", summary: "Signed out" });
  }

  await clearSessionCookie();
  redirect("/admin/login");
}

/** Feature 1 — forced logout: kill every other session for this account. */
export async function revokeOtherSessionsAction(
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) return { ok: false, message: "Your session has expired." };

  const current = await readSessionCookie();

  const result = await prisma.session.updateMany({
    where: {
      userId: user.id,
      revokedAt: null,
      id: current ? { not: current.sessionId } : undefined,
    },
    data: { revokedAt: new Date() },
  });

  await writeAudit({
    actor: user,
    action: "SESSION_REVOKED",
    entityType: "auth",
    summary: `Signed out of ${result.count} other device${result.count === 1 ? "" : "s"}`,
  });

  return {
    ok: true,
    message:
      result.count === 0
        ? "No other active sessions."
        : `Signed out of ${result.count} other device${result.count === 1 ? "" : "s"}.`,
  };
}

// ---------------------------------------------------------------------------
// Password reset
// ---------------------------------------------------------------------------

const RESET_TTL_MINUTES = 60;

/**
 * Always reports success so the form cannot be used to discover which email
 * addresses have accounts. The link is returned only in development, where
 * there is no transactional email provider wired up yet.
 */
export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const genericMessage =
    "If that email has an account, a reset link is on its way. The link expires in an hour.";

  if (!user || user.status === "DISABLED") {
    return { ok: true, message: genericMessage };
  }

  const { token, tokenHash } = createAuthToken();

  await prisma.$transaction([
    prisma.authToken.updateMany({
      where: { userId: user.id, purpose: "PASSWORD_RESET", usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.authToken.create({
      data: {
        userId: user.id,
        tokenHash,
        purpose: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000),
      },
    }),
  ]);

  const link = `/admin/reset-password?token=${token}`;

  if (process.env.NODE_ENV === "development") {
    console.info(`[admin] password reset link for ${user.email}: ${link}`);
    return {
      ok: true,
      message: `Development mode — no email is sent. Reset link: ${link}`,
    };
  }

  // TODO: send `link` via Resend once the admin email template is added.
  console.info(`[admin] password reset requested for ${user.email}`);
  return { ok: true, message: genericMessage };
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  }

  const record = await prisma.authToken.findUnique({
    where: { tokenHash: hashAuthToken(parsed.data.token) },
    include: { user: true },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { ok: false, message: "This link has expired or already been used. Request a new one." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        passwordHash,
        // An invited user becomes active once they set their password.
        status: record.user.status === "INVITED" ? "ACTIVE" : record.user.status,
      },
    }),
    prisma.authToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    // Any existing session is invalidated by a password change.
    prisma.session.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  await writeAudit({
    actor: record.user,
    action: "PASSWORD_RESET",
    entityType: "auth",
    entityId: record.userId,
    summary: "Password reset — all sessions signed out",
  });

  return { ok: true, message: "Password updated. Sign in with your new password." };
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return { ok: false, message: "Your session has expired." };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  }

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  const currentOk = await verifyPassword(parsed.data.currentPassword, user?.passwordHash ?? null);

  if (!user || !currentOk) {
    return { ok: false, fieldErrors: { currentPassword: "That is not your current password." } };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });

  await writeAudit({
    actor: sessionUser,
    action: "PASSWORD_RESET",
    entityType: "auth",
    entityId: user.id,
    summary: "Changed their own password",
  });

  return { ok: true, message: "Password updated." };
}
