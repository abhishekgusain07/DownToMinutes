"use server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { auth } from "@clerk/nextjs/server"
import { getUser } from "../user/getUser"
import { ActionItem, User } from "@/utils/types"


export const deleteActionItem = async ({id}: {id: string}) => {
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
        if(!userId){
            throw new Error("User not authenticated");
        }
        const userData: User | null = await getUser(userId!);
        if (!userData) {    
            throw new Error("User not found");
        }
        const { data, error } = await supabase
            .from("ActionItem")
            .delete()
            .eq("id", id)
            .eq("user_id", userData.id)
            .single();
        if(error) {
            throw new Error("Error deleting action item");
        }
        return data
    } catch (error) {
        console.log(error)
        throw error;
    }
}