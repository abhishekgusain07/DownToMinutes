"use server"
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";
import { User } from "@/utils/types";
import { getUser } from "../user/getUser";
import { revalidatePath } from "next/cache";

export const markNotificationAsRead = async (notificationId: string) => {
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
        //check if notification belongs to this user
        const { data: notificationData, error: notificationError } = await supabase
            .from("Notification")
            .select()
            .eq("id", notificationId)
            .single();
        if (notificationError) {
            console.error("Error fetching notification:", notificationError);
            return null;
        }
        if (notificationData?.userId !== userData.id) {
            throw new Error("Unauthorized for this action");
        }

        const { data, error } = await supabase
            .from("Notification")
            .update({ isRead: true })
            .eq("id", notificationId)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }

        // Revalidate the notifications page
        revalidatePath('/notifications');
        return { success: true };
    }catch(error){
        console.error("Error marking notification as read:", error);
    }
}