"use server"
import { z } from "zod";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { User } from "@/utils/types";
import { getUser } from "../user/getUser";
import { uid } from "uid";
import { revalidatePath } from "next/cache";
import { actionFormSchema } from "@/utils/zod/schemas";


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

export const createPlan = async ({data}:{data: z.infer<typeof actionFormSchema>}) => {
    const cookieStore = await cookies();
    const { userId } = await auth();
    
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
        if(!userId){
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId!);
        if (!userData) {
            throw new Error("User not found");
        }
        const now = new Date();

    const today = new Date();
    
    

    // Set to today 12:01 AM
    const today_12_01_AM = new Date(today);
    today_12_01_AM.setHours(0, 1, 0, 0);

    // Set to today 11:59 PM
    const today_11_59_PM = new Date(today);
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
                    date: today.toISOString(),
                    user_id: userData.id,
                    created_at: now.toISOString(),
                    updated_at: now.toISOString(),
                },
            ])
            .select()
            .single();

        if (dayError || !newDay) {
            throw new Error("Failed to create day record");
        }

        dayId = newDay.id;
    }
        console.log("here ✅ ✅ ✅ ✅✅ vv ✅✅✅")
        //create plan entry
        const {data: actionData, error: actionError} = await supabase
        .from("Action")
        .insert([
            {
                id: uid(32),
                day_id: dayId,
                task_id: data.task_id,
                title: data.title,
                duration: data.duration,
                completed: false,
                created_at: now.toISOString(),
                updated_at: now.toISOString(),
                notes: data.notes ?? ""
            }
        ])
        .select()
        .single();
        if(actionError || !actionData){
            console.log(actionError)
            throw new Error("Failed to create plan");
        }   
        revalidatePath("/app/plans");
        return actionData

    } catch (error) {
        throw error;
    }
}