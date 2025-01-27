"use client";
import { useState } from "react";
import useSWR from "swr";

import { PageTitle } from "@/app/app/_componenets/pageTitle";
import { SidebarNav } from "@/app/app/_componenets/sidebarNav";
import { AccountabilityPartnersTabs, AccountabilityTabIcons } from "@/components/accountability/AccountabilityTabIcons";


type TabNamesKeys = keyof typeof AccountabilityPartnersTabs;
const TabNames = Object.keys(AccountabilityPartnersTabs) as (keyof typeof AccountabilityPartnersTabs)[];

const AccountabilityPartnersPage = () => {
  const [activeTab, setActiveTab] = useState(TabNames[0]);

  const CurrentTab = AccountabilityPartnersTabs[activeTab];

  return (
    <div className="h-full w-full items-center justify-center">
        <PageTitle
          heading="Accountability Partners"
          subHeading="Decide who you want to be accountable to"
        />
        <div className="flex flex-col gap-4 p-4 max-w-7xl lg:mx-auto lg:grid lg:grid-cols-12">
        <SidebarNav
            className="col-span-2"
            items={TabNames.map((x: any) => {
              return {
                title: x,
                icon: AccountabilityTabIcons[x],
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

export default AccountabilityPartnersPage;
