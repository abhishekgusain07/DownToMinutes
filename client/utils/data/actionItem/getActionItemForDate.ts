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

        // Format the date to ISO string and extract just the date part
        const formattedDate = format(date, 'yyyy-MM-dd');

        const {data, error} = await supabase
        .from("ActionItem")
        .select("*")
        .eq("user_id", userData.id)
        .eq("date", formattedDate)
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