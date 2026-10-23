import { prisma } from "@/lib/admin/db";
import { writeAudit } from "@/lib/admin/audit";
import { revalidateEntry } from "@/lib/admin/revalidate";
import { toInputJson } from "@/lib/admin/content";

/**
 * Feature 6 — publishes anything whose scheduled time has passed.
 *
 * Call it on a schedule (Vercel Cron, GitHub Actions, or any external cron):
 *   curl -H "Authorization: Bearer $ADMIN_CRON_SECRET" https://…/api/admin/cron/publish
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.ADMIN_CRON_SECRET;

  if (!secret) {
    return Response.json({ error: "ADMIN_CRON_SECRET is not configured." }, { status: 500 });
  }

  const provided = request.headers.get("authorization");
  if (provided !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await prisma.contentEntry.findMany({
    where: { scheduledFor: { not: null, lte: new Date() } },
    include: { updatedBy: { select: { id: true, email: true, name: true } } },
  });

  const published: string[] = [];

  for (const entry of due) {
    try {
      await prisma.$transaction(async (tx) => {
        const latest = await tx.contentVersion.findFirst({
          where: { entryId: entry.id },
          orderBy: { version: "desc" },
          select: { version: true },
        });

        await tx.contentVersion.create({
          data: {
            entryId: entry.id,
            version: (latest?.version ?? 0) + 1,
            data: toInputJson(entry.data),
            status: "PUBLISHED",
            label: "Published on schedule",
            createdById: entry.updatedById,
          },
        });

        await tx.contentEntry.update({
          where: { id: entry.id },
          data: {
            status: "PUBLISHED",
            publishedData: toInputJson(entry.data),
            publishedAt: new Date(),
            publishedById: entry.updatedById,
            hasUnpublishedChanges: false,
            scheduledFor: null,
          },
        });
      });

      await revalidateEntry(entry.module, entry.slug, `Scheduled publish: ${entry.title}`, "cron");

      await writeAudit({
        actor: {
          id: entry.updatedBy?.id ?? null,
          email: entry.updatedBy?.email ?? "cron@firsteconomy.com",
          name: entry.updatedBy?.name ?? "Scheduler",
        },
        action: "PUBLISH",
        entityType: entry.module,
        entityId: entry.id,
        entityLabel: entry.title,
        summary: `Published "${entry.title}" on schedule`,
      });

      published.push(entry.id);
    } catch (error) {
      console.error(`[admin] scheduled publish failed for ${entry.id}`, error);
    }
  }

  return Response.json({
    checked: due.length,
    published: published.length,
    failed: due.length - published.length,
  });
}
