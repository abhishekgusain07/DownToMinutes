"use server";
import { NotificationPreference, User } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "../user/getUser";

export const updateNotificationSettings = async({userId, settings}: {userId?: string, settings: NotificationPreference}) => {
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
        const {userId: userClerkId} = await auth();
        if(!userClerkId) {
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userClerkId);
        if(!userData) {
            throw new Error("User not found");
        }
        const {data, error} = await supabase
            .from("NotificationPreference")
            .update(settings)
            .eq("user_id", userData?.id)
            .select();
        if(error) {
            throw new Error(error.message);
        }
        return {
            success: true,
            data
        }
    }catch(error){
        console.log(error);
        throw error;
    }
};