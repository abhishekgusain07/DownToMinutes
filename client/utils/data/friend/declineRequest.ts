"use server"

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"
import { getUser } from "../user/getUser";
import { FriendRequest, FriendshipStatus, User } from "@/utils/types";
import { getFriendRequest } from "./getFriendRequest";

export const declineRequest = async({
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
        //check if this user is sender of this request
        if(userData.id !== friendRequestData.receiver_id) {
            throw new Error("You are not the receiver of this friend request");
        }
        const { error: updateError } = await supabase
        .from("FriendRequest")
        .update({status: FriendshipStatus.REJECTED})
        .eq("id", requestId);
        if(updateError) {
            throw new Error(updateError.message);
        }
        return {
            success: true,
            message: "Friend request declined ✅"
        }
    }catch(error) {
        console.log(error)
        return {
            success: false,
            message: "Error declining friend request ‼️"
        }
    }
}   
