"use server"
import { User } from "@/utils/types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "../user/getUser";

export const checkExistingFriendship = async(
    {
        senderId,
        recipientId
    }: {
        senderId: string;
        recipientId: string
    }
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

    try{
        //check if both sender and receiver exist
        const senderData: User | null = await getUser(senderId);
        const receiverData: User | null = await getUser(recipientId);
        if (!senderData || !receiverData) {
            throw new Error("User not found");
        }
        
        //check if sender and receiver are not friends
        const {data: existingFriendship1, error: existingFriendshipError1} = await supabase
        .from("friendship")
        .select()
        .eq("sender_id", senderData.id)
        .eq("receiver_id", receiverData.id)
        .single()

        console.log("existingFriendship1 🐶", existingFriendship1);

        const {data: existingFriendship2, error: existingFriendshipError2} = await supabase
        .from("friendship")
        .select()
        .eq("sender_id", receiverData.id)
        .eq("receiver_id", senderData.id)
        .single()

        console.log("existingFriendship2 🐶", existingFriendship2);

        if (existingFriendshipError1 || existingFriendshipError2) {
            throw new Error("Error determining friendship status");
        }

        if (existingFriendship1 || existingFriendship2) {
            return true;
        }else{
            return false;
        }
    }catch(error){
        console.log(error)
        throw new Error("Error determining friendship status");
    }
    
}