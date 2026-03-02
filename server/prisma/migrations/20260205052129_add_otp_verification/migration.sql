/*
  Warnings:

  - You are about to drop the column `location` on the `AthleteProfile` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "OtpVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AthleteProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "sports" TEXT,
    "level" TEXT,
    "achievements" TEXT,
    "stats" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AthleteProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AthleteProfile" ("achievements", "bio", "createdAt", "id", "isVerified", "level", "sports", "stats", "updatedAt", "userId") SELECT "achievements", "bio", "createdAt", "id", "isVerified", "level", "sports", "stats", "updatedAt", "userId" FROM "AthleteProfile";
DROP TABLE "AthleteProfile";
ALTER TABLE "new_AthleteProfile" RENAME TO "AthleteProfile";
CREATE UNIQUE INDEX "AthleteProfile_userId_key" ON "AthleteProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
