/*
  Warnings:

  - A unique constraint covering the columns `[friendship_id,user_id]` on the table `AccountabilitySettings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `AccountabilitySettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AccountabilitySettings_friendship_id_key";

-- AlterTable
ALTER TABLE "AccountabilitySettings" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AccountabilitySettings_friendship_id_user_id_key" ON "AccountabilitySettings"("friendship_id", "user_id");

-- AddForeignKey
ALTER TABLE "AccountabilitySettings" ADD CONSTRAINT "AccountabilitySettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
