"use client"
import { useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import GoalTabsLayout from "./_component/GoalTabsLayout";

type TabName = "subgoals" | "tasks" | "progress" | "activity";

const tabNameToUrlMap: Record<TabName, string> = {
    subgoals: "subgoals",
    tasks: "tasks",
    progress: "progress",
    activity: "activity",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const tabs = ["subgoals", "tasks", "progress", "activity"] as const;
    
    const [activeTab, setActiveTab] = useState<TabName>(() => {
        const currentPath = pathname.split("/").pop();
        return (tabs.find(tab => tabNameToUrlMap[tab as TabName] === currentPath) || tabs[0]) as TabName;
    });

    const handleTabChange = (tab: TabName) => {
        setActiveTab(tab);
        router.push(`/app/goalv2/${tabNameToUrlMap[tab]}`);
    };
      
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col my-6 px-3 py-8 w-full h-full">
                <div className="flex px-3 overflow-x-auto border-b border-zinc-300 lg:justify-center">
                    <GoalTabsLayout 
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