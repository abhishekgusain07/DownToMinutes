"use client";

import { Notification } from "@/utils/types";
import { getNotificationsForUser } from "@/utils/data/notifications/getNotificationsForUser";
import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import NotifcationBlock from "./_component/notifiy";

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchNotifications = useCallback(async () => {
        const notifications = await getNotificationsForUser();
        setNotifications(notifications);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
            Notifications
            <div className="flex items-center justify-center mt-4">
                {
                    loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        notifications && notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <NotifcationBlock 
                                    key={notification.id} 
                                    notification={notification}
                                    onMarkAsRead={fetchNotifications}
                                />
                            ))
                        ) : (
                            <h1 className="text-center">No notifications for now</h1>
                        )
                    )
                }
            </div>
        </div>
    )
}

export default Notifications