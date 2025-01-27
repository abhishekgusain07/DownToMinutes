"use client"
import { AppSidebar } from "./_componenets/Sidebar";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUser } from "@/utils/data/user/getUser";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import Script from 'next/script';

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
            <Script 
                src="https://server-5jbt.onrender.com/static/js/chatbot.js"
                id="b6a75658-7d8e-4a3a-970f-d841c41e54d8"
            />
            <AppSidebar>
                {children}
            </AppSidebar>
        </div>
    )
};

export default AppLayout;