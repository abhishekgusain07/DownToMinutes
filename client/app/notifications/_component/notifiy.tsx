"use client";
import { Button } from "@/components/ui/button";
import { TriangleAlert, X } from "lucide-react";
import { Notification } from "@/utils/types";    
import { NotificationType } from "@prisma/client";
import { PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { markNotificationAsRead } from "@/utils/data/notifications/markRead";
import { useRouter } from "next/navigation";

interface NotificationBlockProps {
  notification: Notification;
  onMarkAsRead: () => Promise<void>;
}

const NotifcationBlock = ({ notification, onMarkAsRead }: NotificationBlockProps) => {
  const router = useRouter();
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case NotificationType.FRIEND_REQUEST_RECEIVED:
        return <TriangleAlert size={16} strokeWidth={2} />;
      case NotificationType.FRIEND_REQUEST_ACCEPTED:
        return <TriangleAlert size={16} strokeWidth={2} className="text-yellow-500" />;
      case NotificationType.ACCOUNTABILITY_REPORT_RECEIVED:
        return <TriangleAlert size={16} strokeWidth={2} className="text-red-500" />;
      case NotificationType.GOAL_COMPLETED:
        return <TriangleAlert size={16} strokeWidth={2} className="text-green-500" />;
      case NotificationType.ACCOUNTABILITY_REMINDER:
        return <TriangleAlert size={16} strokeWidth={2} className="text-blue-500" />;
      case NotificationType.STREAK_MILESTONE:
        return <PartyPopper size={16} strokeWidth={2} className="text-amber-500" />;
        case NotificationType.DAILY_SUMMARY:
          return <TriangleAlert size={16} strokeWidth={2} className="text-sky-500" />;
        case NotificationType.SUBGOAL_COMPLETED:
          return <TriangleAlert size={16} strokeWidth={2} className="text-purple-500" />;
      default:
        return <TriangleAlert size={16} strokeWidth={2} />;
    }
  };
  const markAsRead = async(notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      toast.success("Notification marked as read");
      await onMarkAsRead(); // Call the callback to refresh the list
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error marking notification as read");
    }
  };
  return (
    <div className="z-[100] max-w-[400px] rounded-lg border border-border bg-background p-4 shadow-lg shadow-black/5">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          {getNotificationIcon(notification.type)}
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">
                {notification.content}
              </p>
            </div>
            <div>
              <Button 
                size="sm"
                onClick={() => markAsRead(notification.id)}
              >Mark as read</Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          aria-label="Close notification"
        >
          <X
            size={16}
            strokeWidth={2}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
export default NotifcationBlock;