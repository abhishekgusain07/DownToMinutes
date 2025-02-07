"use server"
import { z } from "zod";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { User } from "@/utils/types";
import { getUser } from "../user/getUser";
import { uid } from "uid";
import { revalidatePath } from "next/cache";
import { actionFormSchema } from "@/utils/zod/schemas";

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

export const createPlan = async ({data}:{data: z.infer<typeof actionFormSchema>}) => {
    const cookieStore = await cookies();
    const { userId } = await auth();
    
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
        if(!userId){
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId!);
        if (!userData) {
            throw new Error("User not found");
        }
        const now = new Date();
        const today = new Date();
        
        // Get or create day for today
        const { data: existingDay, error: dayError } = await supabase
            .from('day')
            .select('*')
            .eq('user_id', userId)
            .eq('date', today.toISOString().split('T')[0])
            .single();

        if (dayError && dayError.code !== 'PGRST116') {
            throw dayError;
        }

        let dayId;
        if (!existingDay) {
            const { data: newDay, error: createDayError } = await supabase
                .from('day')
                .insert([
                    {
                        user_id: userId,
                        date: today.toISOString().split('T')[0],
                    }
                ])
                .select()
                .single();

            if (createDayError) throw createDayError;
            dayId = newDay.id;
        } else {
            dayId = existingDay.id;
        }

        // Create action item
        const actionItemData = {
            user_id: userId,
            task_id: data.task_id,
            day_id: dayId,
            description: data.title,
            duration: data.duration,
            date: formatDateTime(now),
            ...(data.plan_id && { plan_id: data.plan_id }) // Only include plan_id if it exists
        };

        const { error: actionError } = await supabase
            .from('ActionItem')
            .insert([actionItemData]);

        if (actionError) throw actionError;

        revalidatePath('/app/plans');
        return { success: true };
    } catch (error) {
        console.error('Error creating plan:', error);
        throw error;
    }
}