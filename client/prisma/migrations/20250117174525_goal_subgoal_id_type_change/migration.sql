/*
  Warnings:

  - The primary key for the `goal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subgoal` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "subgoal" DROP CONSTRAINT "subgoal_goal_id_fkey";

-- AlterTable
ALTER TABLE "goal" DROP CONSTRAINT "goal_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "goal_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "goal_id_seq";

-- AlterTable
ALTER TABLE "subgoal" DROP CONSTRAINT "subgoal_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "goal_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subgoal_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subgoal_id_seq";

-- AddForeignKey
ALTER TABLE "subgoal" ADD CONSTRAINT "subgoal_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
