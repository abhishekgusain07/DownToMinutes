import { FriendRequest } from "@/utils/types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getFriendRequest = async (requestId: string): Promise<FriendRequest | null> => {
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
        const { data, error } = await supabase
            .from("FriendRequest")
            .select()
            .eq("id", requestId)
            .single()
        return data
    } catch (error) {
        console.error("Error fetching friend request:", error);
        return null;
    }
}