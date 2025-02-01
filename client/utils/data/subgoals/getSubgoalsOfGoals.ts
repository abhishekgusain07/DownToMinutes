"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Goal, Subgoal, User } from "@/utils/types";
import { getUser } from "../user/getUser";
import { getGoal } from "../goals/getGoal";
import { auth } from "@clerk/nextjs/server";

export const getSubgoalsOfGoals = async ({
    userId,
    goalId
}: {
    userId ?: string;
    goalId: string;
}): Promise<Subgoal[] | null> => {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        {
            cookies: {
                get(name: string) {
                  return cookieStore.get(name)?.value;
                },
              },
        }
    );

    try {
        const {userId:clerkUserId} = await auth();
        //check if goal and user exist independently
        const userData: User | null = await getUser(clerkUserId!);

        const goalData: Goal | null = await getGoal(goalId);

        if (!goalData) {
            throw new Error("Goal or user not found");
        }
        if (!userData) {
            throw new Error("User not found");
        }
        //check if goal is of user
        if (goalData.user_id !== userData.id) {
            throw new Error("You are not authorized to create subgoals for this goal");
        }

        const { data, error } = await supabase
            .from("subgoal")
            .select()
            .eq("goal_id", goalId)
            .order('created_at', { ascending: false });

        if (error?.code) return [];
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
