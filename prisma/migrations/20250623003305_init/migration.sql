-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('suggestion', 'problem', 'question');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'instructor', 'member', 'admin');

-- CreateEnum
CREATE TYPE "ActionItemStatus" AS ENUM ('todo', 'in_progress', 'completed', 'review');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('pending', 'accepted', 'declined', 'revoked', 'expired');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('note', 'slides', 'assignment', 'flashcard', 'quiz');

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Account" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthenticatorApp" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "accountName" VARCHAR(255) NOT NULL,
    "issuer" VARCHAR(255) NOT NULL,
    "secret" VARCHAR(255) NOT NULL,
    "recoveryCodes" VARCHAR(1024) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_AuthenticatorApp" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeEmailRequest" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_ChangeEmailRequest" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "category" "FeedbackCategory" NOT NULL DEFAULT 'suggestion',
    "message" VARCHAR(4000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Feedback" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" VARCHAR(4000) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Notification" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetPasswordRequest" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_ResetPasswordRequest" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_Session" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "image" VARCHAR(2048),
    "name" VARCHAR(64) NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "password" VARCHAR(60),
    "lastLogin" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'student',
    "phone" VARCHAR(32),
    "locale" VARCHAR(8) NOT NULL DEFAULT 'en-US',
    "completedOnboarding" BOOLEAN NOT NULL DEFAULT false,
    "enabledWeeklySummary" BOOLEAN NOT NULL DEFAULT false,
    "enabledNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "enabledProductUpdates" BOOLEAN NOT NULL DEFAULT false,
    "studyGroupId" UUID,
    "organizationId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_User" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserImage" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "data" BYTEA,
    "contentType" VARCHAR(255),
    "hash" VARCHAR(64),

    CONSTRAINT "PK_UserImage" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userData" TEXT
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySet" (
    "Document" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "filePath" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "content" JSONB,
    "notes" TEXT,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "categoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flashcards" JSONB,
    "quiz" JSONB,
    "summary" TEXT,
    "podcast" TEXT,
    "generatedAt" TIMESTAMP(3),

    CONSTRAINT "StudySet_pkey" PRIMARY KEY ("Document")
);

-- CreateTable
CREATE TABLE "TopicTag" (
    "ContactTag" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicTag_pkey" PRIMARY KEY ("ContactTag")
);

-- CreateTable
CREATE TABLE "ActionItem" (
    "ContactTask" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "ActionItemStatus" NOT NULL DEFAULT 'todo',
    "userId" UUID NOT NULL,
    "studySetId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionItem_pkey" PRIMARY KEY ("ContactTask")
);

-- CreateTable
CREATE TABLE "StudyGroup" (
    "Organization" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyGroup_pkey" PRIMARY KEY ("Organization")
);

-- CreateTable
CREATE TABLE "StudyGroupInvite" (
    "Invitation" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "token" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'pending',
    "role" "Role" NOT NULL DEFAULT 'student',
    "expires" TIMESTAMP(3) NOT NULL,
    "studyGroupId" UUID NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyGroupInvite_pkey" PRIMARY KEY ("Invitation")
);

-- CreateTable
CREATE TABLE "SecurityAuditLog" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(32),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactImage" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "data" BYTEA,
    "contentType" VARCHAR(255),
    "hash" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyMaterial" (
    "id" UUID NOT NULL,
    "studySetId" UUID NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "contentType" VARCHAR(255) NOT NULL,
    "data" BYTEA NOT NULL,
    "hash" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudySetToTopicTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_StudySetToTopicTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "IX_Account_userId" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticatorApp_userId_key" ON "AuthenticatorApp"("userId");

-- CreateIndex
CREATE INDEX "IX_AuthenticatorApp_userId" ON "AuthenticatorApp"("userId");

-- CreateIndex
CREATE INDEX "IX_ChangeEmailRequest_userId" ON "ChangeEmailRequest"("userId");

-- CreateIndex
CREATE INDEX "IX_Feedback_userId" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "IX_Notification_userId" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "IX_ResetPasswordRequest_email" ON "ResetPasswordRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "IX_Session_userId" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "IX_UserImage_userId" ON "UserImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_key" ON "Category"("userId", "name");

-- CreateIndex
CREATE INDEX "StudySet_userId_idx" ON "StudySet"("userId");

-- CreateIndex
CREATE INDEX "StudySet_categoryId_idx" ON "StudySet"("categoryId");

-- CreateIndex
CREATE INDEX "TopicTag_userId_idx" ON "TopicTag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TopicTag_userId_name_key" ON "TopicTag"("userId", "name");

-- CreateIndex
CREATE INDEX "ActionItem_userId_idx" ON "ActionItem"("userId");

-- CreateIndex
CREATE INDEX "ActionItem_studySetId_idx" ON "ActionItem"("studySetId");

-- CreateIndex
CREATE INDEX "StudyGroup_name_idx" ON "StudyGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StudyGroupInvite_token_key" ON "StudyGroupInvite"("token");

-- CreateIndex
CREATE INDEX "StudyGroupInvite_studyGroupId_idx" ON "StudyGroupInvite"("studyGroupId");

-- CreateIndex
CREATE INDEX "StudyGroupInvite_userId_idx" ON "StudyGroupInvite"("userId");

-- CreateIndex
CREATE INDEX "StudyGroupInvite_email_idx" ON "StudyGroupInvite"("email");

-- CreateIndex
CREATE INDEX "StudyGroupInvite_token_idx" ON "StudyGroupInvite"("token");

-- CreateIndex
CREATE INDEX "security_audit_user_idx" ON "SecurityAuditLog"("userId");

-- CreateIndex
CREATE INDEX "security_audit_resource_idx" ON "SecurityAuditLog"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "security_audit_timestamp_idx" ON "SecurityAuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "security_audit_success_idx" ON "SecurityAuditLog"("success");

-- CreateIndex
CREATE INDEX "Contact_userId_idx" ON "Contact"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactImage_contactId_key" ON "ContactImage"("contactId");

-- CreateIndex
CREATE INDEX "StudyMaterial_studySetId_idx" ON "StudyMaterial"("studySetId");

-- CreateIndex
CREATE INDEX "StudyMaterial_hash_idx" ON "StudyMaterial"("hash");

-- CreateIndex
CREATE INDEX "_StudySetToTopicTag_B_index" ON "_StudySetToTopicTag"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthenticatorApp" ADD CONSTRAINT "AuthenticatorApp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeEmailRequest" ADD CONSTRAINT "ChangeEmailRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studyGroupId_fkey" FOREIGN KEY ("studyGroupId") REFERENCES "StudyGroup"("Organization") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySet" ADD CONSTRAINT "StudySet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySet" ADD CONSTRAINT "StudySet_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("Document") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyGroupInvite" ADD CONSTRAINT "StudyGroupInvite_studyGroupId_fkey" FOREIGN KEY ("studyGroupId") REFERENCES "StudyGroup"("Organization") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyGroupInvite" ADD CONSTRAINT "StudyGroupInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityAuditLog" ADD CONSTRAINT "SecurityAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactImage" ADD CONSTRAINT "ContactImage_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyMaterial" ADD CONSTRAINT "StudyMaterial_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("Document") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudySetToTopicTag" ADD CONSTRAINT "_StudySetToTopicTag_A_fkey" FOREIGN KEY ("A") REFERENCES "StudySet"("Document") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudySetToTopicTag" ADD CONSTRAINT "_StudySetToTopicTag_B_fkey" FOREIGN KEY ("B") REFERENCES "TopicTag"("ContactTag") ON DELETE CASCADE ON UPDATE CASCADE;
