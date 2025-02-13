-- DropForeignKey
ALTER TABLE "AccountabilityGroup" DROP CONSTRAINT "AccountabilityGroup_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "AccountabilityGroupMember" DROP CONSTRAINT "AccountabilityGroupMember_group_id_fkey";

-- DropForeignKey
ALTER TABLE "AccountabilityGroupMember" DROP CONSTRAINT "AccountabilityGroupMember_user_id_fkey";

-- DropForeignKey
ALTER TABLE "AccountabilityReport" DROP CONSTRAINT "AccountabilityReport_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "AccountabilityReport" DROP CONSTRAINT "AccountabilityReport_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "AccountabilitySettings" DROP CONSTRAINT "AccountabilitySettings_friendship_id_fkey";

-- DropForeignKey
ALTER TABLE "AccountabilitySettings" DROP CONSTRAINT "AccountabilitySettings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_day_id_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_task_id_fkey";

-- DropForeignKey
ALTER TABLE "ActionItem" DROP CONSTRAINT "ActionItem_day_id_fkey";

-- DropForeignKey
ALTER TABLE "ActionItem" DROP CONSTRAINT "ActionItem_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "ActionItem" DROP CONSTRAINT "ActionItem_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "ActionItem" DROP CONSTRAINT "ActionItem_task_id_fkey";

-- DropForeignKey
ALTER TABLE "ActionItem" DROP CONSTRAINT "ActionItem_user_id_fkey";

-- DropForeignKey
ALTER TABLE "DailyReflection" DROP CONSTRAINT "DailyReflection_day_id_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user1_id_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user2_id_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_dayId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_friendshipId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_goalId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_reportId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_subgoalId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationPreference" DROP CONSTRAINT "NotificationPreference_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PlanFeedback" DROP CONSTRAINT "PlanFeedback_day_id_fkey";

-- DropForeignKey
ALTER TABLE "TaskActionPlan" DROP CONSTRAINT "TaskActionPlan_task_id_fkey";

-- DropForeignKey
ALTER TABLE "TaskActionPlan" DROP CONSTRAINT "TaskActionPlan_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_activityTotag" DROP CONSTRAINT "_activityTotag_A_fkey";

-- DropForeignKey
ALTER TABLE "_activityTotag" DROP CONSTRAINT "_activityTotag_B_fkey";

-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_user_id_fkey";

-- DropForeignKey
ALTER TABLE "day" DROP CONSTRAINT "day_user_id_fkey";

-- DropForeignKey
ALTER TABLE "entry" DROP CONSTRAINT "entry_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "entry" DROP CONSTRAINT "entry_day_id_fkey";

-- DropForeignKey
ALTER TABLE "goal" DROP CONSTRAINT "goal_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subgoal" DROP CONSTRAINT "subgoal_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "subgoal" DROP CONSTRAINT "subgoal_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tag" DROP CONSTRAINT "tag_user_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_subgoal_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_user_id_fkey";

-- DropTable
DROP TABLE "AccountabilityGroup";

-- DropTable
DROP TABLE "AccountabilityGroupMember";

-- DropTable
DROP TABLE "AccountabilityReport";

-- DropTable
DROP TABLE "AccountabilitySettings";

-- DropTable
DROP TABLE "Action";

-- DropTable
DROP TABLE "ActionItem";

-- DropTable
DROP TABLE "DailyReflection";

-- DropTable
DROP TABLE "FriendRequest";

-- DropTable
DROP TABLE "Friendship";

-- DropTable
DROP TABLE "Milestone";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "NotificationPreference";

-- DropTable
DROP TABLE "PlanFeedback";

-- DropTable
DROP TABLE "TaskActionPlan";

-- DropTable
DROP TABLE "_activityTotag";

-- DropTable
DROP TABLE "activity";

-- DropTable
DROP TABLE "day";

-- DropTable
DROP TABLE "entry";

-- DropTable
DROP TABLE "goal";

-- DropTable
DROP TABLE "invoices";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "subgoal";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "subscriptions_plans";

-- DropTable
DROP TABLE "tag";

-- DropTable
DROP TABLE "task";

-- DropTable
DROP TABLE "user";

-- DropEnum
DROP TYPE "ActionItemStatus";

-- DropEnum
DROP TYPE "ActivityCategory";

-- DropEnum
DROP TYPE "Frequency";

-- DropEnum
DROP TYPE "FriendshipStatus";

-- DropEnum
DROP TYPE "MilestoneType";

-- DropEnum
DROP TYPE "Mood";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "NotificationUrgency";

-- DropEnum
DROP TYPE "PlanStatus";

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "ProgressType";

-- DropEnum
DROP TYPE "TaskStatus";

