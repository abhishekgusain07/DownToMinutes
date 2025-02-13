"use client";

import { ActivityCalendar } from "@/app/app/plans/_component/activityCalendar";
import { getActivityDataForGoal } from "@/utils/data/goals/getActivityDataForGoal";
import { getGoal } from "@/utils/data/goals/getGoal";
import { Goal } from "@/utils/types";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ActivityForGoals = ({ goalId }: { goalId: string }) => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [fetchingGoal, setFetchingGoal] = useState(false);
  const [fetchingActivityData, setFetchingActivityData] = useState(false);
  const [activityData, setActivityData] = useState<{ date: string; count: number }[]>([]);

  // Fetch Goal
  const fetchGoal = async () => {
    try {
      setFetchingGoal(true);
      const fetchedGoal: Goal | null = await getGoal(goalId);
      if (!fetchedGoal) {
        toast.error("Goal not found");
        return;
      }
      setGoal(fetchedGoal);
      toast.success("Goal loaded successfully");
    } catch (error) {
      console.error("Failed to load goal details:", error);
      toast.error("Failed to load goal details");
    } finally {
      setFetchingGoal(false);
    }
  };

  // Fetch Activity Data
  const fetchActivityData = async () => {
    try {
      setFetchingActivityData(true);
      const data: { date: string; count: number }[] = await getActivityDataForGoal({ goalId });

      if (!data || data.length === 0) {
        toast.warning("No activity data found for this goal");
        return;
      }

      // Transform the data
      const transformedData = data.reduce<{ date: string; count: number }[]>((acc, plan) => {
        const date = plan.date ? format(new Date(plan.date), "yyyy/MM/dd") : null;
        if (!date) return acc; // Skip invalid dates
        const existingDay = acc.find((d) => d.date === date);
        if (existingDay) {
          existingDay.count += plan.count;
        } else {
          acc.push({ date, count: plan.count });
        }
        return acc;
      }, []);

      setActivityData(transformedData);
      toast.success("Activity data fetched successfully");
    } catch (error) {
      console.error("Error fetching activity data:", error);
      toast.error("Failed to fetch activity data");
    } finally {
      setFetchingActivityData(false);
    }
  };

  // Effect for fetching goal and activity data
  useEffect(() => {
    fetchGoal();
    fetchActivityData();
  }, [goalId]);

  // Show loader while fetching data
  if (fetchingGoal || fetchingActivityData) {
    return <Loader2 className="animate-spin size-4" />;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">
        {goal ? `Activity for Goal: ${goal.title}` : "Loading goal..."}
      </h1>
      <div className="flex-1 w-full overflow-x-auto">
        <ActivityCalendar data={activityData} />
      </div>
    </div>
  );
};

export default ActivityForGoals;
