"use client"
import { useState } from "react";
import FriendsTabLayout from "./_component/FriendsTabLayout";
import { usePathname, useRouter } from "next/navigation";

type TabName = "Friend_Requests" | "Accountability_Partners" | "Chats";

const tabNameToUrlMap: Record<TabName, string> = {
    Friend_Requests: "friend-requests",
    Accountability_Partners: "accountability-partners",
    Chats: "chat",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const tabs = ["Friend_Requests", "Accountability_Partners", "Chats"] as const;
    
    const [activeTab, setActiveTab] = useState<TabName>(() => {
        const currentPath = pathname.split("/").pop();
        return (tabs.find(tab => tabNameToUrlMap[tab as TabName] === currentPath) || tabs[0]) as TabName;
    });

    const handleTabChange = (tab: TabName) => {
        setActiveTab(tab);
        router.push(`/app/friends/${tabNameToUrlMap[tab]}`);
    };
      
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col my-6 px-3 py-8 w-full h-full">
                <div className="flex px-3 overflow-x-auto border-b border-zinc-300 lg:justify-center">
                    <FriendsTabLayout 
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                        className="px-3"
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;