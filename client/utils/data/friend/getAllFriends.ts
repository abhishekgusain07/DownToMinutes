"use server"

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { FriendInfo, User } from "@/utils/types";
import { getUser } from "../user/getUser";
import { auth } from "@clerk/nextjs/server";

export const getAllFriends = async (): Promise<FriendInfo[] | null> => {
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
        const {userId} = await auth();
        if(!userId) {
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId);
        if (!userData) {
            throw new Error("User not found");
        }

        // Get all friendships where the user is either user1 or user2
        const { data: friendships, error: friendshipsError } = await supabase
            .from('Friendship')
            .select('user1_id, user2_id')
            .or(`user1_id.eq.${userData.id},user2_id.eq.${userData.id}`);

        if (friendshipsError) {
            throw new Error(friendshipsError.message);
        }

        if (!friendships || friendships.length === 0) {
            return [];
        }

        // Get all friend IDs (excluding the current user's ID)
        const friendIds = friendships.map(friendship => 
            friendship.user1_id === userData.id ? friendship.user2_id : friendship.user1_id
        );

        // Get friend details
        const { data: friends, error: friendsError } = await supabase
            .from('user')
            .select('id, first_name, last_name, email, profile_image_url, user_id')
            .in('id', friendIds);

        if (friendsError) {
            throw new Error(friendsError.message);
        }

        // Format the response to match the expected type
        return friends;
    } catch (error: any) {
        console.error("Error getting friends:", error);
        throw error;
    }
}