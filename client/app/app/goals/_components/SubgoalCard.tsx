"use client";

import { Subgoal } from "@/utils/types";
import { useSubgoalNavigation } from "./routeToSubgoal";

interface SubgoalCardProps {
  subgoal: Subgoal;
  goalId: string;
}

export function SubgoalCard({ subgoal, goalId }: SubgoalCardProps) {
  const { routeToSubgoal } = useSubgoalNavigation();

  return (
    <div
      className="bg-card p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => routeToSubgoal(goalId, subgoal.id)}
    >
      <h3 className="font-medium">{subgoal.title}</h3>
      <p className="text-sm text-muted-foreground">{subgoal.description}</p>
      <div className="mt-2">
        <p className="text-xs text-muted-foreground">
          Due: {new Date(subgoal.due_date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
