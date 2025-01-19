"use server"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "../user/getUser";
import { FriendRequest, User } from "@/utils/types";
import { uid } from "uid";

const sendFriendRequest = async({
    senderId, 
    receiverId
}:{
    senderId: string;
    receiverId: string;
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
        if(senderId === receiverId) {
            throw new Error("Cannot send friend request to yourself");
        }
        //check if both sender and receiver exist
        const senderData: User | null = await getUser(senderId);
        const receiverData: User | null = await getUser(receiverId);
        if (!senderData || !receiverData) {
            throw new Error("User not found");
        }
        
        //check if sender and receiver are not friends
        const {data: existingFriendship1, error: existingFriendshipError1} = await supabase
        .from("Friendship")
        .select()
        .eq("sender_id", senderData.id)
        .eq("receiver_id", receiverData.id)
        .single()

        console.log("existingFriendship1 🐶", existingFriendship1);

        const {data: existingFriendship2, error: existingFriendshipError2} = await supabase
        .from("Friendship")
        .select()
        .eq("sender_id", receiverData.id)
        .eq("receiver_id", senderData.id)
        .single()

        console.log("existingFriendship2 🐶", existingFriendship2);

        if (existingFriendship1 || existingFriendship2) {
            throw new Error("You are already friends with this user");
        }

        //check if sender and receiver are already pending friend requests
        const {data: pendingFriendRequest1, error: pendingFriendRequestError1} = await supabase
        .from("FriendRequest")
        .select()
        .eq("sender_id", senderData.id)
        .eq("receiver_id", receiverData.id)
        .single()

        const {data: pendingFriendRequest2, error: pendingFriendRequestError2} = await supabase
        .from("FriendRequest")
        .select()
        .eq("sender_id", receiverData.id)
        .eq("receiver_id", senderData.id)
        .single()

        if (pendingFriendRequest1 || pendingFriendRequest2) {
            throw new Error("You have already sent a friend request to this user");
        }
        //send friend request
        const {data: friendRequest, error: friendRequestError} = await supabase
        .from("FriendRequest").insert({
            id: uid(32),
            sender_id: senderData.id,
            receiver_id: receiverData.id,
        }).select().single();

        if (friendRequestError) {
            throw new Error(friendRequestError.message);
        }

        return friendRequest as FriendRequest;
    }catch(error: any) {  
        console.log(error);  
        throw new Error(error.message);
    }
    
}

export default sendFriendRequest;