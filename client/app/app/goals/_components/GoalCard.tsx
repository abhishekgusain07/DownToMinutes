"use client";

import { cn } from "@/lib/utils";
import { Goal, Priority } from "@/utils/types";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

interface GoalCardProps {
  goal: Goal;
}

const calculateProgress = (goal: Goal) => {
  if (!goal.subgoals || goal.subgoals.length === 0) return 0;
  const completedSubgoals = goal.subgoals.filter(subgoal => subgoal.completed).length;
  return Math.round((completedSubgoals / goal.subgoals.length) * 100);
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.HIGH:
      return 'text-red-500';
    case Priority.MEDIUM:
      return 'text-yellow-500';
    case Priority.LOW:
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}; 

const getStatusText = (progress: number, dueDate: Date) => {
  const now = new Date();
  const isOverdue = new Date(dueDate) < now;
  
  if (isOverdue) return { text: "Behind Schedule", color: "text-red-500" };
  if (progress === 100) return { text: "Completed", color: "text-green-500" };
  if (progress >= 50) return { text: "On Track", color: "text-green-500" };
  return { text: "Needs Attention", color: "text-yellow-500" };
};

export function GoalCard({ goal }: GoalCardProps) {
  const progress = calculateProgress(goal);
  const priorityColor = getPriorityColor(goal.priority);
  const status = getStatusText(progress, goal.end_date);
  
  return (
    <Link href={`/app/goals/${goal.id}`}>
      <div className="bg-neutral-900 rounded-lg p-6 space-y-4 hover:bg-neutral-800 transition-colors">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-medium", priorityColor)}>
                {goal.priority} Priority
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
            <p className="text-sm text-neutral-400">
              {goal.description || "No description provided"}
            </p>
          </div>
          <button className="text-neutral-400 hover:text-white">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Overall Progress</span>
            <span className="text-white">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <span className="text-neutral-400">Due Date: </span>
            <span className="text-white">
              {new Date(goal.end_date).toLocaleDateString()}
            </span>
          </div>
          <span className={cn("font-medium", status.color)}>
            {status.text}
          </span>
        </div>
      </div>
    </Link>
  );
}
