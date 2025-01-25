"use server";

import { FriendshipStatus, User } from "@/utils/types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "../user/getUser";
import { getUserById } from "../user/getUserByIntId";

export const getAllFriendRequests = async (
    userId: string
) => {
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
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId);
        if (!userData) {
            throw new Error("User not found");
        }
        const { data: friendRequests } = await supabase
        .from("FriendRequest")
        .select("id, sender_id, receiver_id, created_at")
        .eq("receiver_id", userData?.id)
        .eq("status", FriendshipStatus.PENDING);
        if(!friendRequests) {
            return []
        }
        const friendRequestsWithUsers = await Promise.all(
            friendRequests.map(async (friendRequest) => {
            const senderData = await getUserById(friendRequest.sender_id);
            return {
                ...friendRequest,
                senderData: senderData,
            };
            })
        );
    return friendRequestsWithUsers;

    } catch (error) {
        console.error("Error in getAllFriendRequests:", error);
        return null;
    }
}