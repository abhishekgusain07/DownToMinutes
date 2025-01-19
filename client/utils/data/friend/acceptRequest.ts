"use server"

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"
import { getUser } from "../user/getUser";
import { FriendRequest, FriendshipStatus, User } from "@/utils/types";
import { getFriendRequest } from "./getFriendRequest";
import { uid } from "uid";

export const acceptRequest = async({
    requestId,
    userId
}: {
    requestId: string;
    userId: string;
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
        const userData: User | null = await getUser(userId);
        const friendRequestData: FriendRequest | null = await getFriendRequest(requestId);
        if (!userData || !friendRequestData) {
            throw new Error("User or friend request not found");
        }
        //check if this user is receiver of this request
        if(userData.id !== friendRequestData.receiver_id) {
            throw new Error("You are not the receiver of this friend request");
        }
        const { error: updateError } = await supabase
        .from("FriendRequest")
        .update({status: FriendshipStatus.ACCEPTED})
        .eq("id", requestId);
        if(updateError) {
            throw new Error(updateError.message);
        }

        // Create friendship
        const friendshipId = uid(32);
        const { error: createFriendshipError } = await supabase
        .from("Friendship")
        .insert({
            id: friendshipId,
            user1_id: friendRequestData.sender_id,
            user2_id: userData.id,
        });
        
        if(createFriendshipError) {
            throw new Error(createFriendshipError.message);
        }

        // Create accountability settings for both users
        const { error: createSettingsError } = await supabase
        .from("AccountabilitySettings")
        .insert([
            {
                // Settings for sender (user1)
                id: uid(32),
                friendship_id: friendshipId,
                user_id: friendRequestData.sender_id,
                share_enabled: false,
                frequency: 'DAILY',
                reminder_time: null,
                updated_at: new Date()
            },
            {
                // Settings for receiver (user2)
                id: uid(32),
                friendship_id: friendshipId,
                user_id: userData.id,
                share_enabled: false,
                frequency: 'DAILY',
                reminder_time: null,
                updated_at: new Date()
            }
        ]);


        if(createSettingsError) {
            throw new Error(createSettingsError.message);
        }

        console.log("Friend request accepted and accountability settings created for both users 🐶 🐶 🐶 🐶 🐶 🐶 🐶 🐶 🐶 ");
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
