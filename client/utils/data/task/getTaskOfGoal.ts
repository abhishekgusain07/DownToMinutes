"use server"
import { Subgoal, Task, User } from "@/utils/types"
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "../user/getUser";
import { getGoal } from "../goals/getGoal";
import { getSubgoal } from "../subgoals/getSubgoal";


interface GetTaskOfGoalProps {
    goalId: string
}
export const getTaskOfGoal = async ({goalId}: GetTaskOfGoalProps): Promise<Task[] | null> => {
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

    //check if the goal exists or not
    const goalData: any = await getGoal(goalId);
    if(!goalData) {
      throw new Error("Goal not found");
    }
    // check if goal belongs to user
    if(goalData.user_id !== userData.id){
      throw new Error("Goal does not belong to user");
    }

    const { data, error } = await supabase
      .from("task")
      .select("*")
      .eq("goal_id", goalId)
      .order("created_at", { ascending: false })
    if(error) {
      throw new Error("Error fetching task");
    }
    return data as Task[];
  }catch(error) {   
    console.error("Error fetching task:", error);
    return null
  }
}