-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('WORK', 'STUDY', 'EXERCISE', 'MEAL', 'REST', 'LEISURE', 'MEETING', 'COMMUTE', 'SOCIAL', 'SELF_CARE', 'CHORES', 'OTHER');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('VERY_PRODUCTIVE', 'PRODUCTIVE', 'NEUTRAL', 'UNPRODUCTIVE', 'VERY_UNPRODUCTIVE');

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ActivityCategory" NOT NULL DEFAULT 'OTHER',
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mood" "Mood",
    "summary" TEXT,
    "energy_level" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_focus_time" INTEGER,
    "distractions" TEXT[],
    "highlights" TEXT[],

    CONSTRAINT "day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry" (
    "id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ActivityCategory" NOT NULL DEFAULT 'OTHER',
    "focus_score" INTEGER,
    "energy_level" INTEGER,
    "interruptions" INTEGER,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "day_id" TEXT NOT NULL,
    "activity_id" TEXT,

    CONSTRAINT "entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_activityTotag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_user_id_key" ON "tag"("name", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "day_date_key" ON "day"("date");

-- CreateIndex
CREATE UNIQUE INDEX "_activityTotag_AB_unique" ON "_activityTotag"("A", "B");

-- CreateIndex
CREATE INDEX "_activityTotag_B_index" ON "_activityTotag"("B");

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day" ADD CONSTRAINT "day_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry" ADD CONSTRAINT "entry_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry" ADD CONSTRAINT "entry_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_activityTotag" ADD CONSTRAINT "_activityTotag_A_fkey" FOREIGN KEY ("A") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_activityTotag" ADD CONSTRAINT "_activityTotag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
