"use server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { uid } from "uid";
import { ActivityCategory } from "@prisma/client";

type CreateEntryInput = {
    title: string;
    description?: string;
    category: ActivityCategory;
    start_time: Date;
    end_time: Date;
    focus_score?: number;
    energy_level?: number;
    interruptions?: number;
    location?: string;
};

export const createDayEntry = async (entryData: CreateEntryInput) => {
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

    // Get user's ID from the database
    const { data: userData, error: userError } = await supabase
        .from("user")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (userError || !userData) {
        throw new Error("User not found");
    }

    const now = new Date();

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

    // First, try to find an existing day record for today
    const { data: existingDay } = await supabase
        .from("day")
        .select("id")
        .eq("user_id", userData.id)
        .gte("date", startTime)
        .lt("date", endTime)
        .single();  

    let dayId;

    if (existingDay) {
        // Use existing day
        dayId = existingDay.id;
    } else {
        // Create new day record
        const { data: newDay, error: dayError } = await supabase
            .from("day")
            .insert([
                {
                    id: uid(32),
                    date: today.toISOString(),
                    user_id: userData.id,
                    created_at: now.toISOString(),
                    updated_at: now.toISOString(),
                },
            ])
            .select()
            .single();

        if (dayError || !newDay) {
            throw new Error("Failed to create day record");
        }

        dayId = newDay.id;
    }

    // Create the entry
    const { data: entry, error: entryError } = await supabase
        .from("entry")
        .insert([
            {
                id: uid(32),
                title: entryData.title,
                description: entryData.description,
                category: entryData.category,
                start_time: entryData.start_time.toISOString(),
                end_time: entryData.end_time.toISOString(),
                focus_score: entryData.focus_score,
                energy_level: entryData.energy_level,
                interruptions: entryData.interruptions,
                location: entryData.location,
                day_id: dayId,
                created_at: now.toISOString(),
                updated_at: now.toISOString(),
            },
        ])
        .select()
        .single();

    if (entryError || !entry) {
        throw new Error("Failed to create entry");
    }

    return entry;
};
