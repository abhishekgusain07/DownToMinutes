"use server"

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Subgoal, User } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "../user/getUser";

export const getSubgoal = async ({goalId,subgoalId}: {subgoalId: string, goalId: string}): Promise<Subgoal | null> => {
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
        const {userId} = await auth();
        if(!userId) {
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId);
        if(!userData) {
            throw new Error("User not found");
        }
        const {data, error} = await supabase
        .from("subgoal")
        .select()
        .eq("id", subgoalId)
        .eq("user_id", userData.id)
        .eq("goal_id", goalId)
        .single();
        if(error) {
            console.error("Error fetching subgoal:", error);
            throw new Error("Subgoal not found linked to this goal and user");
        }
        return data
    }catch(error) {
        console.error("Error fetching subgoal:", error);
        throw error;
    }
}