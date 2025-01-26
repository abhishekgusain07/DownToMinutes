"use client";
import { useState } from "react";
import useSWR from "swr";

import { PageTitle } from "@/app/app/_componenets/pageTitle";
import { SidebarNav } from "@/app/app/_componenets/sidebarNav";
import { SettingsTabIcons, SettingsTabs } from "@/components/settings/SettingsTabIcons";


type TabNamesKeys = keyof typeof SettingsTabs;
const TabNames = Object.keys(SettingsTabs);

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabNamesKeys>(
    TabNames[0] as TabNamesKeys
  );

  const CurrentTab = SettingsTabs[activeTab] as React.ComponentType;

  return (
    <div className="h-screen w-screen items-center justify-center">
        <PageTitle
          heading="Settings"
          subHeading="Fine-tune your chatbot's behavior, appearance, and functionality"
        />
        <div className="flex flex-col gap-4 p-4 max-w-7xl lg:mx-auto lg:grid lg:grid-cols-12">
          <SidebarNav
            className="col-span-2"
            items={TabNames.map((x: any) => {
              return {
                title: x,
                icon: SettingsTabIcons[x],
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

export default SettingsPage;
