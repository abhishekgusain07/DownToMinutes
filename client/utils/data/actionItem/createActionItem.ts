"use server"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"
import { getUser } from "../user/getUser";
import { FriendRequest, FriendshipStatus, PartialActionItem, User } from "@/utils/types";
import { ActionItem } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { format } from 'date-fns';
import { uid } from "uid";




// Format function to match Supabase datetime format
function formatDateTime(date: Date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0') + '.' +
        String(date.getMilliseconds()).slice(0, 1);
}

export const createActionItem = async({taskId, date, taskActionPlanId, actionItem}:{date: Date, taskActionPlanId: string, actionItem: (ActionItem|PartialActionItem), taskId: string}):Promise<ActionItem> => {
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
        const {userId} = await auth();
        const userData: User | null = await getUser(userId!);

        if(!userData){
            throw new Error("user data not found")
        }

    
    const today_12_01_AM = date;
    today_12_01_AM.setHours(0, 1, 0, 0);

    // Set to today 11:59 PM
    const today_11_59_PM = date;
    today_11_59_PM.setHours(23, 59, 59, 999);

    const startTime = formatDateTime(today_12_01_AM);
    const endTime = formatDateTime(today_11_59_PM);

    // First, try to find an existing day record for today
    const { data: existingDay } = await supabase
        .from("day")
        .select("id")
        .eq("user_id", userData.id)
        .gte("date", startTime)
        .lt("date", endTime)
        .single();  

    let dayId;
    if (existingDay) {
        // Use existing day
        dayId = existingDay.id;
    } else {
        // Create new day record
        const { data: newDay, error: dayError } = await supabase
            .from("day")
            .insert([
                {
                    id: uid(32),
                    date: date.toISOString(),
                    user_id: userData.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (dayError || !newDay) {
            throw new Error("Failed to create day record");
        }

        dayId = newDay.id;
    }
    //create new action item
    const { data: newActionItem, error: actionItemError } = await supabase
        .from("ActionItem")
        .insert([
            {
                id: uid(32),
                date: date.toISOString(),
                description: actionItem.description,
                duration: actionItem.duration,
                plan_id: taskActionPlanId,
                day_id: dayId,
                user_id: userData.id,
                task_id: taskId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ])
        .select()
        .single();
        if (actionItemError || !newActionItem) {
            throw new Error("Failed to create action item");
        }
        return newActionItem;
    } catch(error: any) {
        console.error("Error in getActionItemForDate:", error);
        throw error;
    }
}