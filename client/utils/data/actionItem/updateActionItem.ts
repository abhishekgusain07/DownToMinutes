"use server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { auth } from "@clerk/nextjs/server"
import { getUser } from "../user/getUser"
import { ActionItem, User } from "@/utils/types"
import { format } from "date-fns"

interface UpdateActionItemPayload {
    id: string
    description: string
    duration: number
    date?: Date
}

export const updateActionItem = async ({id, description, duration, date}: UpdateActionItemPayload):Promise<ActionItem | null>=> {
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
        if(!userId){
            throw new Error("User not authenticated");
        }   
        const userData: User | null = await getUser(userId!);
        if (!userData) {
            throw new Error("User not found");
        }

        // First get the current action item to preserve any fields we're not updating
        const { data: existingAction, error: fetchError } = await supabase
            .from("ActionItem")
            .select("*")
            .eq("id", id)
            .single();

        if(fetchError) {
            console.error("Error fetching existing action item:", fetchError);
            throw new Error(`Failed to fetch existing action item: ${fetchError.message}`);
        }

        if (!existingAction) {
            throw new Error(`Action item with id ${id} not found`);
        }

        // Prepare update payload
        const updatePayload: any = {
            description,
            duration,
            updated_at: new Date().toISOString()
        };

        // If date is provided, update date and day_id
        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            updatePayload.date = date.toISOString();
            updatePayload.day_id = formattedDate;

            // Verify if the day exists in the database
            const { data: dayExists, error: dayError } = await supabase
                .from("day")
                .select("id")
                .eq("id", formattedDate)
                .single();

            if (dayError || !dayExists) {
                // Create the day if it doesn't exist
                const now = new Date().toISOString();
                const { error: createDayError } = await supabase
                    .from("day")
                    .insert([
                        { 
                            id: formattedDate,
                            date: date.toISOString(),
                            user_id: userData.id,
                            created_at: now,
                            updated_at: now
                        }
                    ]);

                if (createDayError) {
                    console.error("Error creating day:", createDayError);
                    throw new Error(`Failed to create day: ${createDayError.message}`);
                }
            }
        }

        console.log('Updating action item with payload:', {
            id,
            updatePayload,
            existingAction
        });

        const { data, error } = await supabase
            .from("ActionItem")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

        if(error) {
            console.error("Error updating action item:", error);
            throw new Error(`Failed to update action item: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error("Error in updateActionItem:", error);
        throw error;
    }
}