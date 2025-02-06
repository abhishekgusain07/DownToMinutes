"use server";
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { auth } from "@clerk/nextjs/server";
import { getUser } from "../user/getUser";
import { TaskActionPlan, User } from "@/utils/types";
import { uid } from "uid";

export const createNewTaskActionPlan = async({taskId, start_date, end_date}:{
    taskId: string
    start_date: Date
    end_date: Date
}):Promise<TaskActionPlan | null> => {
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
        const { data: existingTaskActionPlans, error: taskActionPlanError } = await supabase
            .from("TaskActionPlan")
            .select("id")
            .eq("task_id", taskId)
            .eq("user_id", userData.id);

        if (taskActionPlanError) {
            throw new Error("Error getting existing TaskActionPlans");
        }
        const version = existingTaskActionPlans?.length + 1 || 1;

        const { data: taskActionPlan, error } = await supabase
            .from("TaskActionPlan")
            .insert(
                {
                    id: uid(32),
                    task_id: taskId,
                    user_id: userData.id,
                    version,
                    start_date,
                    end_date,
                    updated_at: new Date(),
                    created_at: new Date(),
                },
            ).select("*");
        if(error){
            throw new Error("Error while creating new taskActionPlan ", error)
        }
        return taskActionPlan[0] as TaskActionPlan;
    }catch(error){
        console.error("Error in createNewTaskActionPlan:", error);
        throw error;
    }
}