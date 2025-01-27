"use client";
import { useState } from "react";
import useSWR from "swr";

import { PageTitle } from "@/app/app/_componenets/pageTitle";
import { SidebarNav } from "@/app/app/_componenets/sidebarNav";
import { FriendRequestTabs, FriendTabIcons } from "@/components/friends/FriendTabIcons";


type TabNamesKeys = keyof typeof FriendRequestTabs;
const TabNames = Object.keys(FriendRequestTabs) as (keyof typeof FriendRequestTabs)[];

const FriendRequestsPage = () => {
  const [activeTab, setActiveTab] = useState(TabNames[0]);

  const CurrentTab = FriendRequestTabs[activeTab];

  return (
    <div className="h-full w-full items-center justify-center">
        <PageTitle
          heading="Friend Requests"
          subHeading="Manage your friend requests and accept or reject them"
        />
        <div className="flex flex-col gap-4 p-4 max-w-7xl lg:mx-auto lg:grid lg:grid-cols-12">
        <SidebarNav
            className="col-span-2"
            items={TabNames.map((x: any) => {
              return {
                title: x,
                icon: FriendTabIcons[x],
                active: activeTab === x,
                onClick: () => {
                  setActiveTab(x);
                },
              };
            })}
          />
          <div className="col-span-10 overflow-y-hidden">
            <CurrentTab />
          </div>
        </div>
    </div>
  );
};

export default FriendRequestsPage;
