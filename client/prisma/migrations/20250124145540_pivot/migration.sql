-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ProgressType" AS ENUM ('TASK_BASED', 'TIME_BASED');

-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('COMPLETION_PERCENTAGE', 'TIME_BASED', 'TASK_COUNT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "NotificationUrgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "AccountabilityReport" ADD COLUMN     "energy_level" INTEGER,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "mood" "Mood",
ADD COLUMN     "rating" INTEGER;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "action_taken" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "urgency" "NotificationUrgency" NOT NULL DEFAULT 'LOW';

-- AlterTable
ALTER TABLE "goal" ADD COLUMN     "current_progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "last_activity" TIMESTAMP(3),
ADD COLUMN     "progress_type" "ProgressType" NOT NULL DEFAULT 'TASK_BASED',
ADD COLUMN     "reflection" TEXT,
ADD COLUMN     "streak_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "subgoal" ADD COLUMN     "current_progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "last_activity" TIMESTAMP(3),
ADD COLUMN     "reflection" TEXT,
ADD COLUMN     "streak_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "estimated_hours" DOUBLE PRECISION NOT NULL,
    "actual_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "subgoal_id" TEXT NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "MilestoneType" NOT NULL,
    "target_value" DOUBLE PRECISION NOT NULL,
    "achieved" BOOLEAN NOT NULL DEFAULT false,
    "achieved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goal_id" TEXT NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountabilityGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creator_id" INTEGER NOT NULL,

    CONSTRAINT "AccountabilityGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountabilityGroupMember" (
    "id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "group_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "AccountabilityGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "goal_updates" BOOLEAN NOT NULL DEFAULT true,
    "milestones" BOOLEAN NOT NULL DEFAULT true,
    "accountability" BOOLEAN NOT NULL DEFAULT true,
    "reminders" BOOLEAN NOT NULL DEFAULT true,
    "quiet_hours_start" TIMESTAMP(3),
    "quiet_hours_end" TIMESTAMP(3),

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_subgoal_id_idx" ON "task"("subgoal_id");

-- CreateIndex
CREATE INDEX "Milestone_goal_id_idx" ON "Milestone"("goal_id");

-- CreateIndex
CREATE INDEX "AccountabilityGroup_creator_id_idx" ON "AccountabilityGroup"("creator_id");

-- CreateIndex
CREATE UNIQUE INDEX "AccountabilityGroupMember_group_id_user_id_key" ON "AccountabilityGroupMember"("group_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_user_id_key" ON "NotificationPreference"("user_id");

-- CreateIndex
CREATE INDEX "goal_user_id_idx" ON "goal"("user_id");

-- CreateIndex
CREATE INDEX "subgoal_goal_id_idx" ON "subgoal"("goal_id");

-- CreateIndex
CREATE INDEX "subgoal_user_id_idx" ON "subgoal"("user_id");

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_subgoal_id_fkey" FOREIGN KEY ("subgoal_id") REFERENCES "subgoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountabilityGroup" ADD CONSTRAINT "AccountabilityGroup_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountabilityGroupMember" ADD CONSTRAINT "AccountabilityGroupMember_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "AccountabilityGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountabilityGroupMember" ADD CONSTRAINT "AccountabilityGroupMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
