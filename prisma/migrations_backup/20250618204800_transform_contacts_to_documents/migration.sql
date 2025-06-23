/*
  Warnings:

  - The values [contactCreated,contactUpdated,contactDeleted] on the enum `WebhookTrigger` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `contactId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `enabledContactsNotifications` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `secret` on the `Webhook` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1024)` to `VarChar(64)`.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactPageVisit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContactToContactTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,documentId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentId` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Webhook` table without a default value. This is not possible if the table is not empty.
  - Made the column `secret` on table `Webhook` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WebhookTrigger_new" AS ENUM ('documentCreated', 'documentUpdated', 'documentDeleted');
ALTER TABLE "Webhook" ALTER COLUMN "triggers" TYPE "WebhookTrigger_new"[] USING ("triggers"::text::"WebhookTrigger_new"[]);
ALTER TYPE "WebhookTrigger" RENAME TO "WebhookTrigger_old";
ALTER TYPE "WebhookTrigger_new" RENAME TO "WebhookTrigger";
DROP TYPE "WebhookTrigger_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ContactActivity" DROP CONSTRAINT "ContactActivity_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactComment" DROP CONSTRAINT "ContactComment_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactComment" DROP CONSTRAINT "ContactComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContactNote" DROP CONSTRAINT "ContactNote_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactNote" DROP CONSTRAINT "ContactNote_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContactPageVisit" DROP CONSTRAINT "ContactPageVisit_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactPageVisit" DROP CONSTRAINT "ContactPageVisit_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContactTask" DROP CONSTRAINT "ContactTask_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_contactId_fkey";

-- DropForeignKey
ALTER TABLE "_ContactToContactTag" DROP CONSTRAINT "_ContactToContactTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContactToContactTag" DROP CONSTRAINT "_ContactToContactTag_B_fkey";

-- DropIndex
DROP INDEX "IX_Favorite_contactId";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "contactId",
ADD COLUMN     "documentId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "enabledContactsNotifications",
ADD COLUMN     "enabledDocumentNotifications" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Webhook" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastError" VARCHAR(2000),
ADD COLUMN     "lastFiredAt" TIMESTAMP(3),
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ALTER COLUMN "secret" SET NOT NULL,
ALTER COLUMN "secret" SET DATA TYPE VARCHAR(64);

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "ContactActivity";

-- DropTable
DROP TABLE "ContactComment";

-- DropTable
DROP TABLE "ContactImage";

-- DropTable
DROP TABLE "ContactNote";

-- DropTable
DROP TABLE "ContactPageVisit";

-- DropTable
DROP TABLE "ContactTag";

-- DropTable
DROP TABLE "ContactTask";

-- DropTable
DROP TABLE "_ContactToContactTag";

-- DropEnum
DROP TYPE "ContactRecord";

-- DropEnum
DROP TYPE "ContactStage";

-- DropEnum
DROP TYPE "ContactTaskStatus";

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(2000),
    "filePath" VARCHAR(2048) NOT NULL,
    "fileType" VARCHAR(50) NOT NULL,
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "categoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Document" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCategory" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "color" VARCHAR(7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_DocumentCategory" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentNote" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "text" VARCHAR(8000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_DocumentNote" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IX_Document_organizationId" ON "Document"("organizationId");

-- CreateIndex
CREATE INDEX "IX_Document_categoryId" ON "Document"("categoryId");

-- CreateIndex
CREATE INDEX "IX_DocumentCategory_organizationId" ON "DocumentCategory"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_DocumentCategory_organizationId_name" ON "DocumentCategory"("organizationId", "name");

-- CreateIndex
CREATE INDEX "IX_DocumentNote_documentId" ON "DocumentNote"("documentId");

-- CreateIndex
CREATE INDEX "IX_DocumentNote_userId" ON "DocumentNote"("userId");

-- CreateIndex
CREATE INDEX "IX_Favorite_documentId" ON "Favorite"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_Favorite_userId_documentId" ON "Favorite"("userId", "documentId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DocumentCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentCategory" ADD CONSTRAINT "DocumentCategory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentNote" ADD CONSTRAINT "DocumentNote_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentNote" ADD CONSTRAINT "DocumentNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
