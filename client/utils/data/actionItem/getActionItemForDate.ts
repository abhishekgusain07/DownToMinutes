"use server"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"
import { getUser } from "../user/getUser";
import { FriendRequest, FriendshipStatus, User } from "@/utils/types";
import { ActionItem } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { format } from 'date-fns';

export const getActionItemForDate = async({date}:{date: Date}):Promise<ActionItem[]> => {
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

        // Get start and end of the day in ISO format
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const {data, error} = await supabase
            .from("ActionItem")
            .select(`
                *,
                task:task (
                    id,
                    title,
                    description,
                    status,
                    estimated_hours,
                    actual_hours,
                    due_date
                )
            `)
            .eq("user_id", userData.id)
            .gte("date", startOfDay.toISOString())
            .lt("date", endOfDay.toISOString())
            .order("created_at", {ascending: false});

        if(error){
            console.error("Error fetching action items:", error);
            return [];
        }

        return data || [];
        
    } catch(error: any) {
        console.error("Error in getActionItemForDate:", error);
        return [];
    }
}