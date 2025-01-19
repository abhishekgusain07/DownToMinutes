"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { User } from "@/utils/types";

export const getUser = async (userId: string): Promise<User | null> => {
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
            .from("user")
            .select()
            .eq("user_id", userId)
            .single();

        console.log("data 🤔 🤔 🤔 🤔", data);
        if (error) {
            console.error("Error fetching user:", error);
            return null;
        }

        return data as User;
    } catch (error) {
        console.error("Error in getUser:", error);
        return null;
    }
}