"use server"
import { Subgoal, Task, User } from "@/utils/types"
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "../user/getUser";
import { getGoal } from "../goals/getGoal";
import { getSubgoal } from "../subgoals/getSubgoal";

export const getTaskById = async ({taskId}: {taskId: string}): Promise<Task | null> => {
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
    const { userId } = await auth();
    if( !userId ){ 
      throw new Error("User not authenticated");
    }
    const userData: User | null = await getUser(userId!);
    if (!userData) {
      throw new Error("User not found");
    }
    const { data:task, error } = await supabase
      .from("task")
      .select()
      .eq("id", taskId)
      .single();

    if(error) {
      throw new Error("Error fetching task");
    }
    return task as Task;
  }catch(error) {   
    console.error("Error fetching task:", error);
    return null
  }
}