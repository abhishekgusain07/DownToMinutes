"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "../user/getUser";
import { FriendRequest, FriendshipStatus, User } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";

interface ChangeFriendRequestStatusProps {
    requestId: string;
    status: FriendshipStatus;
}
export const changeFriendRequestStatus = async ({requestId, status}: ChangeFriendRequestStatusProps) => {
    const {userId} = await auth();
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
    try {
        if(!userId) {
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId!);
        if (!userData) {
            throw new Error("User not found");
        }

        const { data, error } = await supabase
        .from("FriendRequest")
        .update({ status: status })
        .eq("id", requestId)
        .select()
        .single();
        if (error) {
            console.error("Error updating friend request status:", error);
            throw new Error("Failed to update friend request status");
        }
        if (!data) {
            throw new Error("Friend request not found");
        }
        return data;
    } catch (error) {
        console.error("Error changing friend request status:", error);
        throw new Error("Failed to change friend request status");
    }
}
