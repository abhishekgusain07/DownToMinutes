-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('NOT_STARTED', 'STARTED', 'IN_PROGRESS', 'NOT_DONE');

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "description" TEXT,
    "from_time" TEXT NOT NULL,
    "to_time" TEXT NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "effectiveness" INTEGER NOT NULL DEFAULT 5,
    "distractions" INTEGER NOT NULL DEFAULT 5,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "day_id" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanFeedback" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "day_id" TEXT NOT NULL,
    "overall_summary" TEXT NOT NULL,
    "achievements" TEXT[],
    "improvement_areas" TEXT[],
    "recommendations" TEXT[],
    "productivity_score" INTEGER NOT NULL,
    "goal_alignment" TEXT,
    "time_management" TEXT,
    "pattern_insights" TEXT,

    CONSTRAINT "PlanFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanFeedback_day_id_idx" ON "PlanFeedback"("day_id");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeedback" ADD CONSTRAINT "PlanFeedback_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
