"use server"
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";
import { Subgoal, User } from "@/utils/types";
import { getUser } from "../user/getUser";
import { TaskFormValues } from "@/utils/zod/schemas";
import { getSubgoal } from "../subgoals/getSubgoal";
import { getGoal } from "../goals/getGoal";
import { uid } from "uid";
import { revalidatePath } from "next/cache";


export const createTask = async (data: TaskFormValues & {subgoal_id: string} & {goal_id: string}) => {
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
    const goalData: any = await getGoal(data.goal_id);
    if(!goalData) {
      throw new Error("Goal not found");
    }
    // check if goal belongs to user
    if(goalData.user_id !== userData.id){
      throw new Error("Goal does not belong to user");
    }
    // check if subgoal exists
    const subgoalData: Subgoal | null = await getSubgoal({goalId:data.goal_id,subgoalId:data.subgoal_id});
    if(!subgoalData) {
      throw new Error("Subgoal not found");
    }
    // check if subgoal belongs to goal
    if(subgoalData.goal_id !== data.goal_id){
      throw new Error("Subgoal does not belong to goal");
    }

    const { data: taskData, error } = await supabase
    .from("task")
    .insert([
      {
        id: uid(32),
        title: data.title,
        description: data.description,
        status: data.status,
        estimated_hours: data.estimated_hours,
        actual_hours: 0,
        due_date: data.due_date,
        created_at: new Date(),
        updated_at: new Date(),
        notes: data.notes,
        subgoal_id: data.subgoal_id,
        goal_id: data.goal_id,
      },
    ])
    .select()
    .single();
    if (error) {
      throw new Error("Error while creating task ", error);
    }
    revalidatePath(`app/goals/${data.goal_id}/subgoals/${data.subgoal_id}`);
    return data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Error creating task "+ error);
  }
}