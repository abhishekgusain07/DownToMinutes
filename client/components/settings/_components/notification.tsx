"use client";
import { TabCard } from "@/components/Tabcard";
import { ToggleField } from "@/components/ToggleField";
import { Button } from "@/components/ui/button";
import { getNotificationSettingsForUser } from "@/utils/data/notifications/getNotificationSettingsForUser";
import { updateNotificationSettings } from "@/utils/data/notifications/updateNotificationSettings";
import { NotificationPreference } from "@/utils/types";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Notifications() {
    const {user} = useUser();
    const [notificationSettings, setNotificationSettings] = useState<NotificationPreference | null>(null);
    const [isNotificationLoading, setIsNotificationLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    useEffect(() => {
        const fetchNotificationSettings = async () => {
            try{
                setIsNotificationLoading(true);
                const settings = await getNotificationSettingsForUser();
                setNotificationSettings(settings);
            }catch(error){
                console.error("Error fetching notification settings:", error);
            }finally{
                setIsNotificationLoading(false);
            }
        };
        fetchNotificationSettings();
    }, []);
    const saveNotificationSettings = async () => {
        try{
            setIsSaving(true);
            console.log("Saving notification settings...");
            await updateNotificationSettings({
                settings: notificationSettings!
            });
            console.log("Notification settings saved");
            toast.success("Notification settings saved");
        }catch(error){
            console.error("Error saving notification settings:", error);
            toast.error("Error saving notification settings");
        }finally{
            setIsSaving(false);
        }
    }
    if(isNotificationLoading){
        return <Loader2 className="animate-spin size-4 text-foreground" />;
    }
    console.log("notificationSettings -> ", notificationSettings);
  return (
    <div className="w-full">
      <TabCard heading="Notifications setting">
        <div className="px-4 py-6 sm:px-6 sm:py-8 min-h-[500px]">
          <div className="max-w-3xl mb-5">
            <p className="mt-1 text-sm text-muted-foreground">
              Enable or disable notifications for different types of updates.
            </p>
          </div>
          <div className="space-y-4">
            <ToggleField
              title="Receive Goal Update Notifications"
              initialOpen={notificationSettings?.goal_updates}
              blockToggleState={false}
              setUpgradeOpen={() => {}}
              onToggle={() => {
                if (notificationSettings) {
                  setNotificationSettings({
                    ...notificationSettings,
                    goal_updates: !notificationSettings.goal_updates,
                  });
                }
              }}
            />
            <ToggleField
              title="Receive Milestone Notifications"
              initialOpen={notificationSettings?.milestones}
              blockToggleState={false}
              setUpgradeOpen={() => {}}
              onToggle={() => {
                if (notificationSettings) {
                  setNotificationSettings({
                    ...notificationSettings,
                    milestones: !notificationSettings.milestones,
                  });
                }
              }}
            />
            <ToggleField
              title="Receive Accountability Notifications"
              initialOpen={notificationSettings?.accountability}
              blockToggleState={false}
              setUpgradeOpen={() => {}}
              onToggle={() => {
                if (notificationSettings) {
                  setNotificationSettings({
                    ...notificationSettings,
                    accountability: !notificationSettings.accountability,
                  });
                }
              }}
            />
            <ToggleField
              title="Receive Reminder Notifications"
              initialOpen={notificationSettings?.reminders}
              blockToggleState={false}
              setUpgradeOpen={() => {}}
              onToggle={() => {
                if (notificationSettings) {
                  setNotificationSettings({
                    ...notificationSettings,
                    reminders: !notificationSettings.reminders,
                  });
                }
              }}
            />
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-border bg-muted/50">
            <Button 
                variant="default" 
                onClick={saveNotificationSettings} 
                disabled={isSaving}
                className="flex items-center gap-2"
            >
                {isSaving ? "Saving Changes" : "Save Changes"}
                {isSaving && <Loader2 className="animate-spin size-4" />}
            </Button>
        </div>
      </TabCard>
        
    </div>
  );
}
