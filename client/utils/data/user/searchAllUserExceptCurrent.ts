"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUser } from "./getUser";
import { FilteredUsers, User } from "@/utils/types";


export const searchAllUserExceptCurrent = async ({
    currentUserId,
    searchTerm
}:{
    currentUserId: string,
    searchTerm: string
}):Promise<FilteredUsers[] | null> => {
    try{
        if(!currentUserId) throw new Error("User not authenticated")
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
        const userData: User | null = await getUser(currentUserId);
        if (!userData) {
            throw new Error("User not found");
        }
        const { data, error } = await supabase
            .from("user")
            .select()
            .neq("user_id", currentUserId)
            .ilike("first_name", `%${searchTerm}%`)
            .ilike("last_name", `%${searchTerm}%`)
            .ilike("email", `%${searchTerm}%`);

        if (error) {
            console.error("Error searching users:", error);
            return null;
        }

        const filteredData = data.map((user: User) => {
            return {
                id: user.id,
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                profile_image_url: user.profile_image_url,
            };
        });
        return filteredData;
    }catch(error){
        console.error("Error searching users:", error);
        return null;
    }
};