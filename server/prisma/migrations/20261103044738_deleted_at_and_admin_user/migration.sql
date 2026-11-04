-- AlterTable
ALTER TABLE "Advice" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Crop" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "CropCalendar" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Region" ADD COLUMN "deletedAt" DATETIME;

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'AGRONOME',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
