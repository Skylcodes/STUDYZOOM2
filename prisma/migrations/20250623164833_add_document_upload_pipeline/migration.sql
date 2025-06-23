/*
  Warnings:

  - You are about to drop the column `data` on the `StudyMaterial` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uploadId]` on the table `StudyMaterial` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('pending', 'uploading', 'processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "StudyMaterial" DROP COLUMN "data",
ADD COLUMN     "error" TEXT,
ADD COLUMN     "filePath" VARCHAR(1024),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "status" "UploadStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "uploadId" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "StudyMaterial_uploadId_key" ON "StudyMaterial"("uploadId");

-- CreateIndex
CREATE INDEX "StudyMaterial_status_idx" ON "StudyMaterial"("status");

-- CreateIndex
CREATE INDEX "StudyMaterial_uploadId_idx" ON "StudyMaterial"("uploadId");
