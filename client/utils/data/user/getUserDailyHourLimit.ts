"use server";
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { User } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "./getUser";

export const getUserDailyHourLimit = async (): Promise<number> => {
    try {
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
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const userData: User | null = await getUser(userId);
        
        if(!userData){
            throw new Error("user data not found")
        }

        const { data, error } = await supabase
            .from("user")
            .select("daily_hour_limit")
            .eq("id", userData.id)
            .single();

        if (error) {
            console.error("Error fetching daily hour limit:", error);
            return 8; // Default to 8 hours if there's an error
        }

        // If daily_hour_limit is null or undefined, return default value
        return data?.daily_hour_limit ?? 8;
    } catch (error: any) {
        console.error("Error in getUserDailyHourLimit:", error);
        return 8; // Default to 8 hours if there's an error
    }
};
