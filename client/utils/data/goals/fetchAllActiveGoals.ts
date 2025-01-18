import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "../user/getUser";
import { User } from "@/utils/types";
import { Goal } from "@/utils/types";

export const fetchAllActiveGoals = async():Promise<Goal[] | null> => {
    const cookieStore = await cookies();
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

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
        const userData: User | null = await getUser(userId);

        if (!userData) {
            throw new Error("User not found");
        }

        const { data, error } = await supabase
            .from("goal")
            .select()
            .eq("user_id", userData.id)
            .eq("active", true);

        if (error) {
            throw new Error("Error fetching goals:", error);
        }
        return data;
    } catch (error) {
        console.error("Error in fetchAllActiveGoals:", error);
        return null;
    }
}