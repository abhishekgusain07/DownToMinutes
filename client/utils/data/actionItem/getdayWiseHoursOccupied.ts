"use server"

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"
import { getUser } from "../user/getUser";
import { FriendRequest, FriendshipStatus, User } from "@/utils/types";
import { uid } from "uid";
import { useAuth } from "@clerk/nextjs";

export const getDayWiseHoursOccuped = async({startDate, endDate}:{
    startDate: Date ;
    endDate: Date;
}) => {
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
        const {userId} = useAuth();
        const userData: User | null = await getUser(userId!);

        if(!userData){
            throw new Error("user data not found")
        }
        
        return {
            success: true,
            message: "Friend request accepted"
        }
    } catch(error: any) {
        console.log("error while accepting friend request", {
            message: error.message,
            error: error,
            stack: error.stack
        });
        return {
            success: false,
            message: `Error accepting friend request: ${error.message}`
        }
    }
}
