/*
  Warnings:

  - The `status` column on the `FriendRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "status",
ADD COLUMN     "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING';
