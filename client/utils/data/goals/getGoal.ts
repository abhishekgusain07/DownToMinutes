"use server"

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Goal } from "@/utils/types";

export const getGoal = async (goalId: string):Promise<Goal | null> => {
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
            .from("goal")
            .select()
            .eq("id", goalId)
            .single()
        if(error) {
            console.error("Error fetching goal:", error);
            return null;
        }
        return data
    } catch (error) {
        console.error("Error fetching goal:", error);
        return null;
    }
}