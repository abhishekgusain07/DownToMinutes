"use client"
import { AppSidebar } from "./_componenets/Sidebar";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUser } from "@/utils/data/user/getUser";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { User, useSupabaseClient } from "@supabase/auth-helpers-react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser(); // Get user info from Clerk
    const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
    const supabaseClient = useSupabaseClient();
    useEffect(() => {
        const fetchAndSetUserId = async () => {
            if (user) {
                try {
                    const userInfo = await getUser(user.id!);
                    if (userInfo) {
                        setUserInfo({
                            name: userInfo.first_name + " " + userInfo.last_name,
                            email: userInfo.email,
                            image: userInfo.profile_image_url!,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            }
        };
        fetchAndSetUserId();
    }, [user, setUserInfo]); 
    return(
        <div>
            <AppSidebar>
                {children}
            </AppSidebar>
        </div>
    )
};

export default AppLayout;