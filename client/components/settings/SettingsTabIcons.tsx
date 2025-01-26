"use client";

import React from 'react';
import SettingsIcon from "@/app/icons/settings.svg";
import NotificationsIcon from "@/app/icons/notifications.svg";
import FaqIcon from "@/app/icons/faq.svg";
import SecurityIcon from "@/app/icons/security.svg";
import ChatInterfaceIcon from "@/app/icons/chat-interface.svg";
import AgentIcon from "@/app/icons/agent.svg";

export const SettingsTabIcons: Record<string, React.ReactNode> = {
  Settings: <SettingsIcon />,
//   Members: <AgentIcon />,
//   "Chat Interface": <ChatInterfaceIcon />,
//   Security: <SecurityIcon />,
//   Notifications: <NotificationsIcon />,
//   FAQs: <FaqIcon />,
};

interface SettingsProps extends React.PropsWithChildren {}

export function Settings() {
    return (
        <div>
            Taboo
        </div>
    );
}

export const SettingsTabs: Record<string, React.ComponentType> = {
    Settings: Settings
};
