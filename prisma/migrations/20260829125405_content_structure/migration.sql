-- CreateEnum
CREATE TYPE "ContentKind" AS ENUM ('COLLECTION', 'SINGLETON');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'STRUCTURE_CREATED';
ALTER TYPE "AuditAction" ADD VALUE 'STRUCTURE_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'STRUCTURE_DELETED';
ALTER TYPE "AuditAction" ADD VALUE 'SECTION_ADDED';
ALTER TYPE "AuditAction" ADD VALUE 'SECTION_REMOVED';
ALTER TYPE "AuditAction" ADD VALUE 'SECTION_REORDERED';

-- CreateTable
CREATE TABLE "ContentType" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "singular" TEXT NOT NULL,
    "kind" "ContentKind" NOT NULL DEFAULT 'COLLECTION',
    "group" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'FileText',
    "description" TEXT NOT NULL DEFAULT '',
    "detailPath" TEXT,
    "revalidatePaths" TEXT[],
    "orderable" BOOLEAN NOT NULL DEFAULT false,
    "usesSections" BOOLEAN NOT NULL DEFAULT false,
    "allowedSectionKeys" TEXT[],
    "fields" JSONB NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionType" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'LayoutTemplate',
    "group" TEXT NOT NULL DEFAULT 'Content',
    "fields" JSONB NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_key_key" ON "ContentType"("key");

-- CreateIndex
CREATE INDEX "ContentType_position_idx" ON "ContentType"("position");

-- CreateIndex
CREATE UNIQUE INDEX "SectionType_key_key" ON "SectionType"("key");

-- CreateIndex
CREATE INDEX "SectionType_position_idx" ON "SectionType"("position");
