"use server";
import { ActionItemStatus, User } from "@/utils/types";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "../user/getUser";

interface UpdateActionItemStatusProps {
    actionItemId: string;
    status: ActionItemStatus;
}

export const updateActionItemStatus = async ({ actionItemId, status }: UpdateActionItemStatusProps) => {
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
        const { userId } = await auth();
        if(!userId) throw new Error("User not authenticated");
        
        const userData: User | null = await getUser(userId);
        if(!userData) throw new Error("User not found");

        const { data, error } = await supabase
            .from("ActionItem")
            .update({ status })
            .eq("id", actionItemId)
            .eq("user_id", userData.id)
            .select();
        if(error) throw new Error("Error updating action item status");
        return data;
    } catch(error: any){
        console.log("Errro while updating action Item status",error);
        throw error;
    }
};