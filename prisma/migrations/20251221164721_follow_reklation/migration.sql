/*
  Warnings:

  - You are about to drop the column `followedId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `followerId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `albumId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedPassword` on the `temp_users_import` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[follower_id,followed_id]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `followed_id` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `follower_id` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "notifications_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "ratings_userId_fkey";

-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "followedId",
DROP COLUMN "followerId",
ADD COLUMN     "followed_id" UUID NOT NULL,
ADD COLUMN     "follower_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "senderId",
DROP COLUMN "userId",
ADD COLUMN     "sender_id" UUID,
ADD COLUMN     "user_id" UUID;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "avatarUrl",
ADD COLUMN     "avatar_url" TEXT DEFAULT 'b62ffbe8-65b6-4c0f-85c3-8ddb41c1c1b2-0.9841619793258353.jpg';

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "albumId",
DROP COLUMN "userId",
ADD COLUMN     "album_id" VARCHAR,
ADD COLUMN     "user_id" UUID DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "User" DROP COLUMN "encryptedPassword",
ADD COLUMN     "encrypted_password" VARCHAR(255);

-- AlterTable
ALTER TABLE "temp_users_import" DROP COLUMN "encryptedPassword",
ADD COLUMN     "encrypted_password" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_follower_id_followed_id_key" ON "Follow"("follower_id", "followed_id");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "notifications_senderId_fkey" FOREIGN KEY ("sender_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
