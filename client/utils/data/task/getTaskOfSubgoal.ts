"use server"
import { Subgoal, Task, User } from "@/utils/types"
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "../user/getUser";
import { getGoal } from "../goals/getGoal";
import { getSubgoal } from "../subgoals/getSubgoal";


interface GetTaskOfSubgoalProps {
    subgoalId: string
    goalId: string
}
export const getTaskOfSubgoal = async ({subgoalId, goalId}: GetTaskOfSubgoalProps): Promise<Task[] | null> => {
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

    // check if subgoal exists
    const subgoalData: Subgoal | null = await getSubgoal({goalId,subgoalId});
    if(!subgoalData) {
      throw new Error("Subgoal not found");
    }
    // check if subgoal belongs to goal
    if(subgoalData.goal_id !== goalId){
      throw new Error("Subgoal does not belong to goal");
    }

    const { data, error } = await supabase
      .from("task")
      .select()
      .eq("subgoal_id", subgoalId)
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