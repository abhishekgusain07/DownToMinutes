"use client";

import React from 'react';
import SettingsIcon from "@/app/icons/settingsIcon";
import NotificationsIcon from "@/app/icons/notificationsIcons";
import FaqIcon from "@/app/icons/faq.svg";
import SecurityIcon from "@/app/icons/security.svg";
import ChatInterfaceIcon from "@/app/icons/chat-interface.svg";
import AgentIcon from "@/app/icons/agent.svg";
import { Settings } from 'lucide-react';

export const SettingsTabIcons: Record<string, React.ReactNode> = {
  "General": <Settings />,
  "Notifications": <NotificationsIcon />,
//   "Members": <AgentIcon />,
//   "Chat Interface": <ChatInterfaceIcon />,
//   "Security": <SecurityIcon />,
//   "Notifications": <NotificationsIcon />,
//   "FAQs": <FaqIcon />,
};

interface SettingsProps extends React.PropsWithChildren {}

export const SettingsTabs: Record<string, React.ComponentType<SettingsProps>> = {
  "General": React.lazy(() => import("./_components/Settings")),
  "Notifications": React.lazy(() => import("./_components/notification")),
//   "Members": React.lazy(() => import("./MembersPage")),
//   "Chat Interface": React.lazy(() => import("./ChatInterfacePage")),
//   "Security": React.lazy(() => import("./SecurityPage")),
//   "Notifications": React.lazy(() => import("./NotificationsPage")),
//   "FAQs": React.lazy(() => import("./FaqsPage")),
};
