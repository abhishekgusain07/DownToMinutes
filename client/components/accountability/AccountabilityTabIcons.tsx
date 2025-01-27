"use client";

import React from 'react';
import SettingsIcon from "@/app/icons/settingsIcon";
import NotificationsIcon from "@/app/icons/notificationsIcons";
import FaqIcon from "@/app/icons/faq.svg";
import SecurityIcon from "@/app/icons/security.svg";
import ChatInterfaceIcon from "@/app/icons/chat-interface.svg";
import AgentIcon from "@/app/icons/agent.svg";
import { HandshakeIcon, PersonStandingIcon, PlusIcon } from 'lucide-react';

export const AccountabilityTabIcons: Record<string, React.ReactNode> = {
  "Manage_Accountability": <HandshakeIcon />,
//   "Pending_Requests": <PlusIcon />,
//   "Members": <AgentIcon />,
//   "Chat Interface": <ChatInterfaceIcon />,
//   "Security": <SecurityIcon />,
//   "Notifications": <NotificationsIcon />,
//   "FAQs": <FaqIcon />,
};

interface AccountabilityPartnersProps extends React.PropsWithChildren {}

export const AccountabilityPartnersTabs: Record<string, React.ComponentType<AccountabilityPartnersProps>> = {
  "Manage_Accountability": React.lazy(() => import("./_components/manage")),
//   "Members": React.lazy(() => import("./MembersPage")),
//   "Chat Interface": React.lazy(() => import("./ChatInterfacePage")),
//   "Security": React.lazy(() => import("./SecurityPage")),
//   "Notifications": React.lazy(() => import("./NotificationsPage")),
//   "FAQs": React.lazy(() => import("./FaqsPage")),
};
