import "server-only";

import type { SubmissionType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/admin/db";

/**
 * Stores a public form submission so the admin dashboard has a real unread
 * count (feature 4). Before this, submissions existed only as an email — if
 * delivery failed, the enquiry was gone.
 *
 * Never throws: capturing a submission must not break the visitor's form. The
 * email send in the route handler stays the primary delivery path.
 */
export async function captureSubmission(input: {
  type: SubmissionType;
  email: string;
  name?: string | null;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message?: string | null;
  payload?: Record<string, unknown> | null;
  deliveryError?: string | null;
  ip?: string | null;
}): Promise<void> {
  try {
    await prisma.formSubmission.create({
      data: {
        type: input.type,
        email: input.email,
        name: input.name ?? null,
        phone: input.phone ?? null,
        company: input.company ?? null,
        subject: input.subject ?? null,
        message: input.message ?? null,
        payload: input.payload ? (input.payload as object) : undefined,
        deliveryError: input.deliveryError ?? null,
        ip: input.ip ?? null,
      },
    });
  } catch (error) {
    console.error("[admin] failed to store form submission", error);
  }
}

/** Best-effort client IP from the request headers. */
export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
}
