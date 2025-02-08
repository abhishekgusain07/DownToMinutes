"use server"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"
import { getUser } from "../user/getUser";
import { ActionItemStatus, FriendRequest, FriendshipStatus, PartialActionItem, User } from "@/utils/types";
import { ActionItem } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { format } from 'date-fns';
import { uid } from "uid";

// Format function to match Supabase datetime format
function formatDateTime(date: Date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0') + '.' +
        String(date.getMilliseconds()).slice(0, 1);
}

const standaloneTaskId = process.env.STANDALONE_TASK_ID;
interface CreateActionItemProps {
    taskId ?: string
    date: Date
    taskActionPlanId ?: string
    actionItem: (ActionItem|PartialActionItem)
    status ?: ActionItemStatus
}

async function ensureStandaloneGoalAndSubgoal(supabase: any, userId: string) {
    // First check if standalone goal exists
    const { data: existingGoal } = await supabase
        .from("goal")
        .select("id")
        .eq("title", "Standalone Tasks")
        .eq("user_id", userId)
        .single();

    let goalId;
    if (existingGoal) {
        goalId = existingGoal.id;
    } else {
        // Create standalone goal
        const { data: newGoal, error: goalError } = await supabase
            .from("goal")
            .insert([
                {
                    id: uid(32),
                    title: "Standalone Tasks",
                    description: "Container for standalone tasks",
                    start_date: new Date("2024-01-01").toISOString(),
                    end_date: new Date("2030-12-31").toISOString(), // Far future date
                    user_id: userId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    active: true,
                    completed: false,
                    progress_type: "TASK_BASED",
                }
            ])
            .select()
            .single();

        if (goalError) {
            console.error("Failed to create standalone goal:", goalError);
            throw new Error(`Failed to create standalone goal: ${goalError.message}`);
        }
        goalId = newGoal.id;
    }

    // Check if standalone subgoal exists
    const { data: existingSubgoal } = await supabase
        .from("subgoal")
        .select("id")
        .eq("title", "Standalone Tasks")
        .eq("goal_id", goalId)
        .single();

    let subgoalId;
    if (existingSubgoal) {
        subgoalId = existingSubgoal.id;
    } else {
        // Create standalone subgoal
        const { data: newSubgoal, error: subgoalError } = await supabase
            .from("subgoal")
            .insert([
                {
                    id: uid(32),
                    title: "Standalone Tasks",
                    description: "Container for standalone tasks",
                    goal_id: goalId,
                    user_id: userId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    active: true,
                    completed: false,
                    frequency: "ONE_TIME",
                    due_date: new Date("2030-12-31").toISOString(), // Far future date
                }
            ])
            .select()
            .single();

        if (subgoalError) {
            console.error("Failed to create standalone subgoal:", subgoalError);
            throw new Error(`Failed to create standalone subgoal: ${subgoalError.message}`);
        }
        subgoalId = newSubgoal.id;
    }

    return { goalId, subgoalId };
}

async function getOrCreateStandaloneTaskForDay(supabase: any, userId: string, date: Date) {
    // Format date for database query (YYYY-MM-DD)
    const dateString = date.toISOString().split('T')[0];

    // First try to find an existing standalone task for this day
    const { data: existingTask } = await supabase
        .from("task")
        .select("id")
        .eq("user_id", userId)
        .eq("due_date", dateString)
        .eq("title", "Standalone Tasks for " + dateString)
        .single();

    if (existingTask) {
        return existingTask.id;
    }

    // If no existing task, create one
    const { goalId, subgoalId } = await ensureStandaloneGoalAndSubgoal(supabase, userId);
    
    const { data: standaloneTask, error: taskError } = await supabase
        .from("task")
        .insert([
            {
                id: uid(32),
                title: "Standalone Tasks for " + dateString,
                description: "Container for standalone tasks for " + dateString,
                estimated_hours: 0,
                actual_hours: 0,
                due_date: dateString,
                user_id: userId,
                goal_id: goalId,
                subgoal_id: subgoalId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        ])
        .select()
        .single();

    if (taskError) {
        console.error("Failed to create standalone task:", taskError);
        throw new Error(`Failed to create standalone task: ${taskError.message}`);
    }

    return standaloneTask.id;
}

export const createActionItem = async({taskId, date, taskActionPlanId, actionItem, status}:CreateActionItemProps):Promise<ActionItem> => {
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
        const userData: User | null = await getUser(userId!);

        if(!userData){
            throw new Error("user data not found")
        }

        // Create new Date objects instead of mutating the input
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        // Format date for database query (YYYY-MM-DD)
        const dateString = startOfDay.toISOString().split('T')[0];
        console.log("Searching for day with date:", dateString);

        // First, try to find an existing day record for today
        const { data: existingDay, error: existingDayError } = await supabase
            .from("day")
            .select("id")
            .eq("user_id", userData.id)
            .eq("date", dateString)
            .single();

        if (existingDayError && existingDayError.code !== 'PGRST116') { // PGRST116 is "not found" error
            console.error("Error checking existing day:", existingDayError);
            throw new Error(`Failed to check existing day: ${existingDayError.message}`);
        }

        let dayId;
        if (existingDay) {
            console.log("Found existing day:", existingDay);
            dayId = existingDay.id;
        } else {
            const dayUid = uid(32);
            console.log("Creating new day with ID:", dayUid, "for date:", dateString);
            
            const { data: newDay, error: dayError } = await supabase
                .from("day")
                .insert([
                    {
                        id: dayUid,
                        date: dateString, // Use date string without time
                        user_id: userData.id,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                ])
                .select()
                .single();

            if (dayError) {
                console.error("Day creation error:", dayError);
                throw new Error(`Failed to create day record: ${dayError.message}`);
            }

            if (!newDay) {
                throw new Error("Day record was not created");
            }

            dayId = newDay.id;
        }
        let finalTaskId = taskId;
        
        if (taskId === "") {
            console.log("Getting or creating standalone task for the day");
            finalTaskId = await getOrCreateStandaloneTaskForDay(supabase, userData.id, date);
            console.log("Using standalone task with ID:", finalTaskId);
        }

        const actionItemId = uid(32);
        console.log("Creating action item with data:", {
            id: actionItemId,
            date: date.toISOString(),
            description: actionItem.description,
            duration: actionItem.duration,
            plan_id: taskActionPlanId === "" ? null : taskActionPlanId,
            day_id: dayId,
            user_id: userData.id,
            status: status ?? ActionItemStatus.PENDING,
            task_id: finalTaskId,
        });

        const { data: newActionItem, error: actionItemError } = await supabase
            .from("ActionItem")
            .insert([
                {
                    id: actionItemId,
                    date: date.toISOString(),
                    description: actionItem.description,
                    duration: actionItem.duration,
                    plan_id: taskActionPlanId === "" ? null : taskActionPlanId,
                    day_id: dayId,
                    user_id: userData.id,
                    status: status ?? ActionItemStatus.PENDING,
                    task_id: finalTaskId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (actionItemError) {
            console.error("Action item creation error:", actionItemError);
            throw new Error(`Failed to create action item: ${actionItemError.message}`);
        }
        if (!newActionItem) {
            throw new Error("Action item was created but no data was returned");
        }
        return newActionItem;
    } catch(error: any) {
        console.error("Error in getActionItemForDate:", error);
        throw error;
    }
}