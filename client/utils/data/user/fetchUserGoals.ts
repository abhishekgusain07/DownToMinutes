"server only"

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Goal, User, userCreateProps } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "./getUser";

interface fetchUserGoalsProps {
  userId: string
}
export const fetchUserGoals = async ({
  userId
}: fetchUserGoalsProps): Promise<Goal[] | null>=> {
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
    const userData:User | null = await getUser(userId);
    const { data, error } = await supabase
      .from("goal")
      .select()
      .eq("user_id", userData?.id);

    console.log("data", data);
    console.log("error", error);

    if (error?.code) return null;
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
