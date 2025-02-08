"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { format, startOfDay, endOfDay } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "../user/getUser";
import { User } from "@/utils/types";

export const getActivityData = async ():Promise<{ date: string; count: number }[]> => {
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
        // Get the date range
        const today = new Date();
        const startOfToday = startOfDay(today);
        const startOfYearAgo = startOfDay(new Date(today.setFullYear(today.getFullYear() - 1)));
        
        const startDateStr = format(startOfYearAgo, 'yyyy-MM-dd');
        const endDateStr = format(startOfToday, 'yyyy-MM-dd');
        
        console.log('Fetching action items from:', startDateStr, 'to:', endDateStr);

        // Get all action items from the last year
        const { data: actionItems, error } = await supabase
            .from('ActionItem')
            .select('date')
            .eq('user_id', userData.id)
            .gte('date', startDateStr)
            .lte('date', endDateStr);

        if (error) {
            console.error('Error fetching activity data:', error);
            return [];
        }

        if (!actionItems?.length) {
            console.log('No action items found');
            return [];
        }

        console.log('Found action items:', actionItems);

        // Group by date and count occurrences
        const dateMap = new Map<string, number>();
        
        actionItems.forEach(item => {
            // Ensure we're using the date part only
            const itemDate = startOfDay(new Date(item.date));
            const dateKey = format(itemDate, 'yyyy/MM/dd');
            dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
        });

        const activityData = Array.from(dateMap.entries())
            .map(([date, count]) => ({
                date,
                count
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return activityData;
    } catch (error) {
        console.error('Error fetching activity data:', error);
        return [];
    }
}
