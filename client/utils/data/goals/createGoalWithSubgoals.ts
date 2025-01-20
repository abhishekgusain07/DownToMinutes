// "use server"

// import { SubgoalSuggestion, User } from "@/utils/types"
// import { auth } from "@clerk/nextjs/server"
// import { createServerClient } from "@supabase/ssr"
// import { cookies } from "next/headers"
// import { uid } from "uid"
// import { getUser } from "../user/getUser"


// export const createGoalWithSubgoals = async ({
//     goalId
// }:{
//     goalId: string
// }) => {
//     const cookieStore = await cookies();
//     const { userId } = await auth();
    
//     if (!userId) {
//         throw new Error("User not authenticated");
//     }

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

//     try {
//         if(!userId) {  
//             throw new Error("User not authenticated");
//         }
//         // Get user's database ID
//         const userData: User | null = await getUser(userId);
//         if (!userData) {
//             throw new Error("User not found");
//         }

//         if (!goalId) {
//             throw new Error("Goal ID is required");
//         }

//         const { error: goalError } = await supabase
//             .from("goal")
//             .insert({
//                 id: goalId,
//                 title: input.title,
//                 description: input.description,
//                 priority: input.priority,
//                 start_date: input.start_date,
//                 end_date: input.end_date,
//                 user_id: userData.id
//             });

//         if (goalError) {
//             throw new Error(goalError.message);
//         }

//         // Create subgoals
//         const subgoalInserts = input.subgoals.map(subgoal => ({
//             id: uid(),
//             title: subgoal.title,
//             description: subgoal.description,
//             frequency: subgoal.frequency,
//             due_date: subgoal.due_date || input.end_date, // Default to goal end date if not specified
//             goal_id: goalId,
//             user_id: userData.id
//         }));

//         if (subgoalInserts.length > 0) {
//             const { error: subgoalsError } = await supabase
//                 .from("subgoal")
//                 .insert(subgoalInserts);

//             if (subgoalsError) {
//                 throw new Error(subgoalsError.message);
//             }
//         }

//         return { goalId };
//     } catch (error) {
//         console.error("Error creating goal with subgoals:", error);
//         throw error;
//     }
// }
