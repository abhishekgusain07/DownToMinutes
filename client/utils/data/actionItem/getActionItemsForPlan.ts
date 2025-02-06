"use server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { auth } from "@clerk/nextjs/server"
import { ActionItem, PartialActionItem, User } from "@/utils/types"
import { getUser } from "../user/getUser"


interface GetActionItemsForPlanProps {
    planId: string
    version: number
    taskId: string
}
export const getActionItemsForPlan = async ({planId, version, taskId}: GetActionItemsForPlanProps): Promise<PartialActionItem[]> => {
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
        if (!userData) {
            throw new Error("User not found");
        }

        // First verify if the plan exists and belongs to the user
        const { data: actionPlan, error: planError } = await supabase
            .from("TaskActionPlan")
            .select("id")
            .eq("id", planId)
            .eq("user_id", userData.id)
            .single();

        if (planError || !actionPlan) {
            console.error("Plan error:", planError);
            throw new Error("Action plan not found or access denied");
        }

        const { data: actionItems, error } = await supabase
            .from("ActionItem")
            .select("id, date, duration, description")
            .eq("plan_id", planId)
            .eq("task_id", taskId);

        if(error){
            console.error("Supabase error:", error);
            throw new Error(`Error fetching action items: ${error.message}`);
        }

        if (!actionItems) {
            return [];
        }
        
        // Map to PartialActionItem structure
        const partialActionItems: PartialActionItem[] = actionItems.map(item => ({
            id: item.id,
            date: new Date(item.date),
            duration: item.duration,
            description: item.description
        }));
        
        return partialActionItems;
    }catch(error){
        console.error("Error in getActionItemsForPlan:", error);
        throw error;
    }
}