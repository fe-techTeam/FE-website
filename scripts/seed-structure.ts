/**
 * Seeds ContentType and SectionType from src/lib/admin/structure-defaults.ts.
 * Also available from the admin UI: Structure → Load defaults.
 *
 *   npx tsx scripts/seed-structure.ts
 */
import "dotenv/config";
import { config as loadEnv } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import {
  CONTENT_TYPE_SEEDS,
  SECTION_TYPE_SEEDS,
} from "../src/lib/admin/structure-defaults";

loadEnv({ path: ".env.local", override: true, quiet: true });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const [types, sections] = await Promise.all([
      prisma.contentType.findMany({ select: { key: true } }),
      prisma.sectionType.findMany({ select: { key: true } }),
    ]);
    const typeKeys = new Set(types.map((row) => row.key));
    const sectionKeys = new Set(sections.map((row) => row.key));

    let createdSections = 0;
    for (const [index, seed] of SECTION_TYPE_SEEDS.entries()) {
      if (sectionKeys.has(seed.key)) continue;
      await prisma.sectionType.create({
        data: {
          key: seed.key,
          label: seed.label,
          description: seed.description,
          icon: seed.icon,
          group: seed.group,
          fields: seed.fields as unknown as object,
          position: index,
          isSystem: true,
        },
      });
      createdSections += 1;
    }

    let createdTypes = 0;
    for (const [index, seed] of CONTENT_TYPE_SEEDS.entries()) {
      if (typeKeys.has(seed.key)) continue;
      await prisma.contentType.create({
        data: {
          key: seed.key,
          label: seed.label,
          singular: seed.singular,
          kind: seed.kind,
          group: seed.group,
          icon: seed.icon,
          description: seed.description,
          detailPath: seed.detailPath ?? null,
          revalidatePaths: seed.revalidatePaths,
          orderable: seed.orderable ?? false,
          usesSections: seed.usesSections ?? false,
          allowedSectionKeys: seed.allowedSectionKeys ?? [],
          fields: seed.fields as unknown as object,
          position: index,
          isSystem: true,
        },
      });
      createdTypes += 1;
    }

    console.log(`✓ ${createdTypes} content type(s), ${createdSections} section(s) created`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? `✗ ${error.message}` : error);
  process.exit(1);
});
