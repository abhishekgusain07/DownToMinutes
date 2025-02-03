"use server";

import { Action, User } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "../user/getUser";

// Format function to match Supabase datetime format
const formatDateTime = (date: Date) => {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0') + '.' +
        String(date.getMilliseconds()).slice(0, 1);
};

export const getPlansForTheDay = async ({
    date
}: {
    date: Date;
}):Promise<Action[] | null> => {
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
    try{
        if(!userId){
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId!);
        if (!userData) {
            throw new Error("User not found");
        }

        // Get current date in IST
    const today = date;
    
    // Set to today 12:01 AM
    const today_12_01_AM = new Date(today);
    today_12_01_AM.setHours(0, 1, 0, 0);

    // Set to today 11:59 PM
    const today_11_59_PM = new Date(today);
    today_11_59_PM.setHours(23, 59, 59, 999);

    const startTime = formatDateTime(today_12_01_AM);
    const endTime = formatDateTime(today_11_59_PM);

    const { data: dayData, error } = await supabase
            .from('day')
            .select("id")
            .eq('user_id', userData.id)
            .gte('created_at', startTime)
            .lte('created_at', endTime)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Error fetching day: ${error.message}`);
        }
        console.log("Day data found:", dayData);

        if (!dayData || dayData.length === 0) {
            return [];
        }

        const dayId = dayData[0].id;

        // Then fetch all Plans for this day
        const { data: actionData, error: actionError } = await supabase
            .from('Action')
            .select("*")
            .eq('day_id', dayId)
            .order('created_at', { ascending: false });

        if (actionError) {
            throw new Error(`Error fetching entries: ${actionError.message}`);
        }

        return actionData as Action[] || [];
    }catch(err){
        return null;
    }
}