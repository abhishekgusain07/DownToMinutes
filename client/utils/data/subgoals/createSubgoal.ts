"use server"

import { auth } from "@clerk/nextjs/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getUser } from "../user/getUser"
import { getGoal } from "../goals/getGoal"
import { Frequency, Subgoal } from "@/utils/types"
import { uid } from "uid"
import {SubgoalFormValues } from "@/utils/zod/schemas"
import { revalidatePath } from "next/cache"


export const createSubgoal = async (subgoalData: SubgoalFormValues): Promise<Subgoal> => {
    const cookieStore = await cookies();
    const { userId } = await auth();
    
    if (!userId) {
        throw new Error("User not authenticated");
    }

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
        // First, get the user's database ID using their Clerk ID
        const userData = await getUser(userId);
        if (!userData) {
            throw new Error("User not found");
        }

        // Verify the goal exists and belongs to the user
        const goalData = await getGoal(subgoalData.goal_id);
        if (!goalData) {
            throw new Error("Goal not found");
        }
        if (goalData.user_id !== userData.id) {
            throw new Error("Not authorized to create subgoals for this goal");
        }

        const now = new Date();
        
        const { data, error } = await supabase
            .from("subgoal")
            .insert([
                {
                    id: uid(32),
                    title: subgoalData.title,
                    description: subgoalData.description,
                    frequency: subgoalData.frequency,
                    due_date: subgoalData.due_date,
                    goal_id: subgoalData.goal_id,
                    user_id: userData.id,
                    completed: false,
                    active: true,
                    created_at: now,
                    updated_at: now
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Error creating subgoal:", error);
            throw new Error("Error creating subgoal");
        }
        revalidatePath(`/app/goals/${subgoalData.goal_id}`);
        return data as Subgoal;
    } catch (error) {
        console.error("Error in createSubgoal:", error);
        throw error;
    }
}