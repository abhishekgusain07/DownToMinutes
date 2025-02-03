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
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      },
      db: {
        schema: 'public'
      }
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

    if (error) {
      console.error("Detailed error info:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return error;
    }

    console.log("User inserted successfully:", data);
    
    const { data: prefData, error: prefError } = await supabase
      .from("NotificationPreference")
      .insert({
        id: uid(32),
        user_id: userId,
      });

    if (prefError) {
      console.error("Error inserting notification preferences:", prefError);
      return prefError;
    }

    return data;
  } catch (error: any) {
    console.error("Unexpected error:", error);
    throw new Error(error.message);
  }
};
