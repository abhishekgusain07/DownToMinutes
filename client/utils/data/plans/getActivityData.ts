"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";

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
        const { data: plans, error } = await supabase
                .from('Action')
                .select('created_at')
                .gte('created_at', format(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 'yyyy-MM-dd'))
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching activity data:', error);
                return [];
            }
        // Transform the data into the format needed for the heat map
        const activityData = plans?.reduce<{ date: string; count: number }[]>((acc, plan) => {
            const date = format(new Date(plan.created_at), 'yyyy/MM/dd');
            const existingDay = acc.find(d => d.date === date);

            if (existingDay) {
                existingDay.count += 1;
            } else {
                acc.push({ date, count: 1 });
            }

            return acc;
        }, []) || [];

        return activityData;
    } catch (error) {
        console.error('Error fetching activity data:', error);
        return [];
    }
};
