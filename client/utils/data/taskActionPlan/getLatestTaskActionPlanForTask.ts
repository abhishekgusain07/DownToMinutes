"use server";
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { auth } from "@clerk/nextjs/server";
import { getUser } from "../user/getUser";
import { User } from "@/utils/types";

export const getLatestTaskActionPlanForTask = async({taskId}:{taskId: string}):Promise<string | null> => {
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
    try{
        const { userId } = await auth();
        if(!userId){
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId!);
        if(!userData){
            throw new Error("User not found");
        }
        // if there are no existing task action plans, this will return null
        // if there is one existing task action plan, this will return the id of that plan
        // if there are multiple existing task action plans, this will return the id of the one with the highest version
        const { data: existingTaskActionPlans, error: taskActionPlanError } = await supabase
            .from("TaskActionPlan")
            .select("id")
            .eq("task_id", taskId)
            .eq("user_id", userData.id)
            .order("version", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (taskActionPlanError) {
            throw new Error("Error getting existing TaskActionPlans");
        }

        return existingTaskActionPlans?.id || null;
    }catch(error){
        console.error("Error in createNewTaskActionPlan:", error);
        throw error;
    }
}