/*
  Warnings:

  - You are about to drop the column `type` on the `TeamMember` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "coverImage" TEXT,
    "facilities" TEXT,
    "sports" TEXT,
    "capacity" INTEGER,
    "establishedYear" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'FREE',
    "features" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SportsProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sportsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "sport" TEXT,
    "profession" TEXT,
    "location" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EmployerVerification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "companyRegistrationUrl" TEXT,
    "gstCertificateUrl" TEXT,
    "idProofUrl" TEXT,
    "organizationEmail" TEXT,
    "contactNumber" TEXT,
    "companyName" TEXT,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminRemarks" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmployerVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "data" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "iconName" TEXT DEFAULT 'Trophy',
    "link" TEXT,
    "cta" TEXT DEFAULT 'Explore',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT,
    "referenceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "description" TEXT,
    "requirements" TEXT,
    "benefits" TEXT,
    "department" TEXT,
    "organization" TEXT,
    "salary" TEXT,
    "category" TEXT NOT NULL DEFAULT 'JOIN_SOCIO_SPORTS',
    "applyUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "postedById" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("createdAt", "department", "description", "id", "isActive", "location", "postedById", "requirements", "title", "type", "updatedAt") SELECT "createdAt", "department", "description", "id", "isActive", "location", "postedById", "requirements", "title", "type", "updatedAt" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE TABLE "new_OtpVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "phone" TEXT,
    "otp" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_OtpVerification" ("createdAt", "email", "expiresAt", "id", "otp", "purpose", "verified") SELECT "createdAt", "email", "expiresAt", "id", "otp", "purpose", "verified" FROM "OtpVerification";
DROP TABLE "OtpVerification";
ALTER TABLE "new_OtpVerification" RENAME TO "OtpVerification";
CREATE TABLE "new_TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "image" TEXT,
    "linkedin" TEXT,
    "quote" TEXT,
    "category" TEXT NOT NULL DEFAULT 'LEADERSHIP',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TeamMember" ("bio", "createdAt", "id", "image", "linkedin", "name", "role", "updatedAt") SELECT "bio", "createdAt", "id", "image", "linkedin", "name", "role", "updatedAt" FROM "TeamMember";
DROP TABLE "TeamMember";
ALTER TABLE "new_TeamMember" RENAME TO "TeamMember";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ATHLETE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationStatus" TEXT DEFAULT 'PENDING'
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "phone", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "phone", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SportsProfile_sportsId_key" ON "SportsProfile"("sportsId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerVerification_userId_key" ON "EmployerVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerVerification_token_key" ON "EmployerVerification"("token");
