"use server"
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";
import { User } from "@/utils/types";
import { getUser } from "../user/getUser";
import { Notification } from "@/utils/types";

export const getNotificationsForUser = async (): Promise<Notification[] | null> => {
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
        const { userId  } = await auth();
        if(!userId){
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId!);
        if (!userData) {
            throw new Error("User not found");
        }

        const { data: notifications, error } = await supabase
            .from("Notification")
            .select("*")
            .eq("userId", userData?.id)
            .eq("isRead", false);
        if (error) {
            throw new Error(error.message);
        }
        return notifications
    }catch(error){
        console.error("Error in getNotificationsForUser:", error);
        return null;
    }
}