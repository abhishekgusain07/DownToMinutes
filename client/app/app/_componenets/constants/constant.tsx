import {
    BellIcon,
    LucideGoal,
    PersonStanding,
    PlaneTakeoffIcon,
    Settings2,
} from "lucide-react";
export const links = [
    {
      label: "Goals",
      href: "/app/goals",
      icon: (
        <LucideGoal className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Friends",
      href: "/app/friends",
      icon: (
        <PersonStanding className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Notifications",
      href: "/app/notifications",
      icon: (
        <BellIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Plans",
      href: "/app/plans",
      icon: (
        <PlaneTakeoffIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/app/settings",
      icon: (
        <Settings2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    //Todo: logout button
  ];