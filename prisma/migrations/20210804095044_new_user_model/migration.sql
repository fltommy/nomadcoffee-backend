-- DropIndex
DROP INDEX "User.githubUsername_unique";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarURL" DROP NOT NULL,
ALTER COLUMN "githubUsername" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;
