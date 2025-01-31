"server only"

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { userCreateProps } from "@/utils/types";
import { uid } from "uid";
export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: userCreateProps) => {
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
    const userId = uid(32);
    const { data, error } = await supabase
      .from("user")
      .insert([
        {
          id: userId,
          email,
          first_name,
          last_name,
          profile_image_url,
          user_id,
        },
      ])
      .select();
      await supabase.from("NotificationPreference")
      .insert({
        id: uid(32),
        user_id: userId,
      });
    console.log("data", data);
    console.log("error", error);

    if (error?.code) return error;
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
