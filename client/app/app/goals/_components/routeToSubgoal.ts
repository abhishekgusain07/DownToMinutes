"use client";

import { useRouter } from "next/navigation";

export const useSubgoalNavigation = () => {
  const router = useRouter();

  const routeToSubgoal = (goalId: string, subgoalId?: string) => {
    router.push(`/app/goals/${goalId}/subgoals/${subgoalId}`);
  };

  return { routeToSubgoal };
};