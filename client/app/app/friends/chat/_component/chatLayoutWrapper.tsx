"use client"
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./SIdebar";
import LoadingScreen from "./loadingScreen";

interface ChatLayoutWrapperProps {
    children: React.ReactNode;
    preLoadedUserInfo: Preloaded<typeof api.users.readUser>;
    preLoadedConversations: Preloaded<
        typeof api.chat.getConversations
    >;
}
const ChatLayoutWrapper = (
    {
        children,
        preLoadedUserInfo,
        preLoadedConversations
    } : ChatLayoutWrapperProps
) => {

    const {isLoaded, isSignedIn} = useAuth();
    const [loading, setLoading] = useState(true);

    const userInfo = usePreloadedQuery(preLoadedUserInfo);
    const conversations = usePreloadedQuery(preLoadedConversations);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    },[])

    //TODO: better handle !isSignedIn exception
    const isLoading = !isLoaded || !isSignedIn || loading || userInfo == null || conversations == null;

    if(isLoading) {
        return <LoadingScreen />
    }

    return (
        <div className="flex h-screen bg-background dark:bg-[#111B21] overflow-hidden">
            <SideBar preloadedUserInfo={preLoadedUserInfo} preloadedConversations={preLoadedConversations} />
            <Header>
                {children}
            </Header>
        </div>
    )
};

export default ChatLayoutWrapper;
