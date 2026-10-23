"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/admin/db";
import { writeAudit, diffJson } from "@/lib/admin/audit";
import { assertArea, AdminAuthError } from "@/lib/admin/dal";
import { createAuthToken } from "@/lib/admin/password";
import { inviteUserSchema, permissionSchema, updateUserSchema } from "@/lib/admin/schemas";
import { ROLE_LABELS } from "@/lib/admin/permissions";
import { fieldErrorsOf } from "@/lib/admin/actions/types";
import type { ActionState } from "@/lib/admin/actions/types";

/** Feature 2 — user administration. Super Admin only, enforced by `assertArea`. */

const INVITE_TTL_HOURS = 72;

export async function inviteUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("users");

    const parsed = inviteUserSchema.safeParse({
      email: formData.get("email"),
      name: formData.get("name"),
      title: formData.get("title") || undefined,
      role: formData.get("role"),
    });

    if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return { ok: false, fieldErrors: { email: "Someone already uses that email address." } };
    }

    const { token, tokenHash } = createAuthToken();

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        title: parsed.data.title ?? null,
        role: parsed.data.role,
        status: "INVITED",
        tokens: {
          create: {
            tokenHash,
            purpose: "INVITE",
            expiresAt: new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000),
          },
        },
      },
    });

    await writeAudit({
      actor,
      action: "USER_INVITED",
      entityType: "auth",
      entityId: user.id,
      entityLabel: user.email,
      summary: `Invited ${user.name} as ${ROLE_LABELS[user.role]}`,
    });

    revalidatePath("/admin/users");

    const link = `/admin/reset-password?token=${token}`;
    if (process.env.NODE_ENV === "development") {
      console.info(`[admin] invite link for ${user.email}: ${link}`);
      return { ok: true, message: `Invited ${user.name}. Development mode — send them: ${link}` };
    }

    // TODO: send the invite via Resend once the admin email template exists.
    return { ok: true, message: `Invited ${user.name}. They will receive a link to set a password.` };
  } catch (error) {
    return errorState(error);
  }
}

export async function updateUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("users");

    const parsed = updateUserSchema.safeParse({
      userId: formData.get("userId"),
      name: formData.get("name"),
      title: formData.get("title") || undefined,
      role: formData.get("role"),
      status: formData.get("status"),
    });

    if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };

    const before = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
    if (!before) return { ok: false, message: "That user no longer exists." };

    // Guard against removing the last way into the panel.
    if (before.role === "SUPER_ADMIN" && parsed.data.role !== "SUPER_ADMIN") {
      const remaining = await prisma.user.count({
        where: { role: "SUPER_ADMIN", status: "ACTIVE", id: { not: before.id } },
      });
      if (remaining === 0) {
        return { ok: false, message: "This is the last Super Admin — promote someone else first." };
      }
    }
    if (before.id === actor.id && parsed.data.status !== "ACTIVE") {
      return { ok: false, message: "You cannot disable your own account." };
    }

    const after = await prisma.user.update({
      where: { id: before.id },
      data: {
        name: parsed.data.name,
        title: parsed.data.title ?? null,
        role: parsed.data.role,
        status: parsed.data.status,
      },
    });

    // Disabling someone takes effect immediately, not at session expiry.
    if (after.status !== "ACTIVE") {
      await prisma.session.updateMany({
        where: { userId: after.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    await writeAudit({
      actor,
      action: after.status === "DISABLED" ? "USER_DISABLED" : "USER_UPDATED",
      entityType: "auth",
      entityId: after.id,
      entityLabel: after.email,
      summary: `Updated ${after.name}`,
      diff: diffJson(
        { name: before.name, title: before.title, role: before.role, status: before.status },
        { name: after.name, title: after.title, role: after.role, status: after.status },
      ),
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${after.id}`);

    return { ok: true, message: `Saved changes to ${after.name}.` };
  } catch (error) {
    return errorState(error);
  }
}

export async function setPermissionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("users");

    const parsed = permissionSchema.safeParse({
      userId: formData.get("userId"),
      module: formData.get("module"),
      canView: formData.get("canView") === "on",
      canEdit: formData.get("canEdit") === "on",
      canPublish: formData.get("canPublish") === "on",
      canDelete: formData.get("canDelete") === "on",
    });

    if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };

    const { userId, module: moduleKey, ...access } = parsed.data;

    await prisma.modulePermission.upsert({
      where: { userId_module: { userId, module: moduleKey } },
      create: { userId, module: moduleKey, ...access },
      update: access,
    });

    await writeAudit({
      actor,
      action: "PERMISSIONS_UPDATED",
      entityType: "auth",
      entityId: userId,
      summary: `Updated ${moduleKey} permissions`,
      diff: {
        [moduleKey]: {
          before: "role default",
          after: Object.entries(access)
            .filter(([, value]) => value)
            .map(([key]) => key.replace("can", "").toLowerCase())
            .join(", ") || "no access",
        },
      },
    });

    revalidatePath(`/admin/users/${userId}`);
    return { ok: true, message: "Permissions saved." };
  } catch (error) {
    return errorState(error);
  }
}

export async function clearPermissionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("users");
    const userId = String(formData.get("userId") ?? "");
    const moduleKey = String(formData.get("module") ?? "");

    await prisma.modulePermission
      .delete({ where: { userId_module: { userId, module: moduleKey } } })
      .catch(() => undefined);

    await writeAudit({
      actor,
      action: "PERMISSIONS_UPDATED",
      entityType: "auth",
      entityId: userId,
      summary: `Reset ${moduleKey} to the role default`,
    });

    revalidatePath(`/admin/users/${userId}`);
    return { ok: true, message: "Reset to the role default." };
  } catch (error) {
    return errorState(error);
  }
}

/** Force-sign-out one user from every device. */
export async function revokeUserSessionsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("users");
    const userId = String(formData.get("userId") ?? "");

    const result = await prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    await writeAudit({
      actor,
      action: "SESSION_REVOKED",
      entityType: "auth",
      entityId: userId,
      entityLabel: user?.email,
      summary: `Signed ${user?.name ?? "user"} out of ${result.count} device${result.count === 1 ? "" : "s"}`,
    });

    revalidatePath(`/admin/users/${userId}`);
    return { ok: true, message: `Signed out of ${result.count} session${result.count === 1 ? "" : "s"}.` };
  } catch (error) {
    return errorState(error);
  }
}


function errorState(error: unknown): ActionState {
  if (error instanceof AdminAuthError) return { ok: false, message: error.message };
  console.error("[admin] user action failed", error);
  return { ok: false, message: "Something went wrong. Try again." };
}
