"use server";
import { Entry, User } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "../user/getUser";

export const fetchLogsForToday = async () => {
    const cookieStore = await cookies();
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

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

    const userData: User | null = await getUser(userId);

    if (!userData) {
        throw new Error("User not found");
    }

    // Get current date in IST
    const today = new Date();
    
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

    // Set to today 12:01 AM
    const today_12_01_AM = new Date(today);
    today_12_01_AM.setHours(0, 1, 0, 0);

    // Set to today 11:59 PM
    const today_11_59_PM = new Date(today);
    today_11_59_PM.setHours(23, 59, 59, 999);

    const startTime = formatDateTime(today_12_01_AM);
    const endTime = formatDateTime(today_11_59_PM);

    console.log("Start time:", startTime); // Will show like 2025-01-18 00:01:00.0
    console.log("End time:", endTime);     // Will show like 2025-01-18 23:59:59.9

    try {
        // First find the day entry for today
        const { data: dayData, error } = await supabase
            .from('day')
            .select("id")
            .eq('user_id', userData.id)
            .gte('created_at', startTime)
            .lte('created_at', endTime)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Error fetching day: ${error.message}`);
        }
        console.log("Day data found:", dayData);
        if (!dayData || dayData.length === 0) {
            return [];
        }

        const dayId = dayData[0].id;

        // Then fetch all entries for this day
        const { data: entryData, error: entryError } = await supabase
            .from('entry')
            .select("*")
            .eq('day_id', dayId)
            .order('created_at', { ascending: false });

        if (entryError) {
            throw new Error(`Error fetching entries: ${entryError.message}`);
        }

        return entryData || [];
    } catch (error) {
        console.error('Error in fetchLogsForToday:', error);
        throw error;
    }
}