"use server";

import { FriendRequest } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getFriendRequestBySenderAndRecieversId = async ({senderId,recieverId}: {senderId: number, recieverId: number}):Promise<FriendRequest | null> => {
    const cookieStore = await cookies();
    const {userId} = await auth();
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
        const { data, error } = await supabase
            .from("FriendRequest")
            .select()
            .eq("sender_id", senderId)
            .eq("receiver_id", recieverId)
            .single();
        if (error) {
            console.error("Error fetching friend request:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error fetching friend request:", error);
        return null;
    }
}