// utils/data/friend/updateAccountabilitySettings.ts
"use server"

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface AccountabilitySettingsUpdate {
    share_enabled?: boolean;
    frequency?: 'DAILY' | 'WEEKLY';
    reminder_time?: Date | null;
}

export const updateAccountabilitySettings = async ({
    friendshipId,
    userId,
    settings
}: {
    friendshipId: string;
    userId: number;
    settings: AccountabilitySettingsUpdate;
}) => {
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
        
        const { error } = await supabase
            .from("AccountabilitySettings")
            .update(settings)
            .match({
                friendship_id: friendshipId,
                user_id: userId
            });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: "Your accountability settings updated successfully"
        };
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const getAccountabilitySettings = async ({
    friendshipId,
    userId
}: {
    friendshipId: string;
    userId: number;
}) => {
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
        // Get this user's settings for this friendship
        const { data, error } = await supabase
            .from("AccountabilitySettings")
            .select("*")
            .match({
                friendship_id: friendshipId,
                user_id: userId
            })
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};