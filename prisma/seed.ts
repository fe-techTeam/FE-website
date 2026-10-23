/**
 * Creates the first Super Admin so someone can sign in.
 *
 *   npm run admin:seed
 *
 * Reads ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD / ADMIN_SEED_NAME from .env.local.
 * Safe to re-run: an existing account is left alone unless --reset-password is passed.
 */

import "dotenv/config";
import { config as loadEnv } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

loadEnv({ path: ".env.local", override: true, quiet: true });

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME?.trim() || "Super Admin";
  const resetPassword = process.argv.includes("--reset-password");

  if (!email || !password) {
    throw new Error(
      "Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env.local before running the seed.",
    );
  }
  if (password.length < 10) {
    throw new Error("ADMIN_SEED_PASSWORD must be at least 10 characters.");
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Start Postgres with `docker-compose up -d`.");
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing && !resetPassword) {
      console.log(`✓ ${email} already exists (${existing.role}). Nothing to do.`);
      console.log("  Re-run with --reset-password to set a new password.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      create: { email, name, passwordHash, role: "SUPER_ADMIN", status: "ACTIVE" },
      update: { passwordHash, status: "ACTIVE", role: "SUPER_ADMIN" },
    });

    if (existing) {
      // A password change should end every existing session.
      await prisma.session.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      console.log(`✓ Reset the password for ${email} and signed out all sessions.`);
    } else {
      console.log(`✓ Created Super Admin ${email}`);
    }

    console.log("  Sign in at http://localhost:3000/admin/login");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? `✗ ${error.message}` : error);
  process.exit(1);
});
