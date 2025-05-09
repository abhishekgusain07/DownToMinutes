"use server"

import { Goal, Priority, ProgressType } from "@/utils/types"
import { auth } from "@clerk/nextjs/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { uid } from "uid"

type CreateGoalInput = {
    title: string
    description?: string
    priority: Priority
    start_date: Date
    end_date: Date
    progress_type: ProgressType
    current_progress?: number
}

export const createGoal = async (goalData: CreateGoalInput): Promise<Goal | null> => {
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
        const { data: userData, error: userError } = await supabase
            .from("user")
            .select("id")
            .eq("user_id", userId)
            .single();

        if (userError || !userData) {
            console.error("Error fetching user:", userError);
            throw new Error("User not found");
        }

        const now = new Date();
        
        // Now create the goal with the correct user_id
        const { data, error } = await supabase
            .from("goal")
            .insert([
                {
                    id: uid(32),
                    title: goalData.title,
                    description: goalData.description,
                    priority: goalData.priority,
                    start_date: goalData.start_date,
                    end_date: goalData.end_date,
                    progress_type: goalData.progress_type,
                    current_progress: goalData.current_progress || 0,
                    user_id: userData.id,
                    active: true,
                    completed: false,
                    created_at: now,
                    updated_at: now,
                    isArchived: false,
                    streak_count: 0
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Error creating goal:", error);
            throw new Error("Error creating goal");
        }

        return data;
    } catch (error) {
        console.error("Error in createGoal:", error);
        throw error;
    }
}