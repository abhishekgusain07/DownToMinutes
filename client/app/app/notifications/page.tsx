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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Notifications</h1>
            <div className="bg-white shadow rounded-lg p-6">
                {
                    loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        notifications && notifications.length > 0 ? (
                            notifications.map((notification) =>  {
                                return (
                                        <NotifcationBlock 
                                            key={notification.id} 
                                            notification={notification}
                                            onMarkAsRead={fetchNotifications}
                                        />
                                )
                            })
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