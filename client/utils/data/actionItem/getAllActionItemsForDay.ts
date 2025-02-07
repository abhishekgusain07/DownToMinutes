// "use server";
// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
// import { format } from 'date-fns';
// import { getUser } from "../user/getUser";
// import { ActionItem, User } from "@/utils/types";
// import { auth } from "@clerk/nextjs/server";


// export const getAllActionItemsForDay = async ({date}:{date: Date}):Promise<ActionItem[]> => {
//     const cookieStore = await cookies();
//     const supabase = createServerClient(
//         process.env.SUPABASE_URL!,
//         process.env.SUPABASE_SERVICE_KEY!,
//         {
//             cookies: {
//                 get(name: string) {
//                     return cookieStore.get(name)?.value;
//                 },
//             },
//         }
//     );
//     try{
//         const { userId } = await auth();
//         if(!userId){
//             throw new Error("User not authenticated");
//         }
//         const userData: User | null = await getUser(userId!);
//         if (!userData) {
//             throw new Error("User not found");
//         }
//         const { data, error } = await supabase
//             .from("ActionItem")
//             .select("*")
//             .eq("user_id", userData.id)
//             .gte("created_at", format(date, 'yyyy-MM-dd'))
//             .lte("created_at", format(date, 'yyyy-MM-dd'))
//             .order("created_at", { ascending: true });
//         if (error) {
//             throw error;    
//         }
//         return data;
//     } catch (error) {
//         toast.error("cannot fetch action items for the day");
//         return null;
//     }
// }