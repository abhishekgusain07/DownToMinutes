"use server"

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "../user/getUser";
import { User } from "@/utils/types";

export const checkExistingFriendship = async({
    senderId,
    recipientId
}: {
    senderId: string;
    recipientId: string;
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

    try {
        const senderData: User | null = await getUser(senderId);
        const recipientData: User | null = await getUser(recipientId);

        if (!senderData || !recipientData) {
            throw new Error("User not found");
        }

        // Check if they are friends in either direction
        const { data: existingFriendship, error: friendshipError } = await supabase
            .from("Friendship")
            .select()
            .or(`user1_id.eq.${senderData.id},user2_id.eq.${senderData.id}`)
            .or(`user1_id.eq.${recipientData.id},user2_id.eq.${recipientData.id}`)
            .single();

        if (friendshipError && friendshipError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            throw new Error("Error checking friendship status");
        }

        return existingFriendship ? true : false;

    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}

export default checkExistingFriendship;