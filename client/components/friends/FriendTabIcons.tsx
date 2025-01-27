"use client";

import React from 'react';
import SettingsIcon from "@/app/icons/settingsIcon";
import NotificationsIcon from "@/app/icons/notificationsIcons";
import FaqIcon from "@/app/icons/faq.svg";
import SecurityIcon from "@/app/icons/security.svg";
import ChatInterfaceIcon from "@/app/icons/chat-interface.svg";
import AgentIcon from "@/app/icons/agent.svg";
import { PersonStandingIcon, PlusIcon } from 'lucide-react';

export const FriendTabIcons: Record<string, React.ReactNode> = {
  "Add_Friends": <PersonStandingIcon />,
  "Pending_Requests": <PlusIcon />,
//   "Members": <AgentIcon />,
//   "Chat Interface": <ChatInterfaceIcon />,
//   "Security": <SecurityIcon />,
//   "Notifications": <NotificationsIcon />,
//   "FAQs": <FaqIcon />,
};

interface FriendRequestsProps extends React.PropsWithChildren {}

export const FriendRequestTabs: Record<string, React.ComponentType<FriendRequestsProps>> = {
  "Add_Friends": React.lazy(() => import("./_components/addFriends")),
  "Pending_Requests": React.lazy(() => import("./_components/pendingRequest")),
//   "Members": React.lazy(() => import("./MembersPage")),
//   "Chat Interface": React.lazy(() => import("./ChatInterfacePage")),
//   "Security": React.lazy(() => import("./SecurityPage")),
//   "Notifications": React.lazy(() => import("./NotificationsPage")),
//   "FAQs": React.lazy(() => import("./FaqsPage")),
};
