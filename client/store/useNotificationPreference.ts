import { create } from 'zustand'
import { persist } from 'zustand/middleware';

interface NotificationPreference {
  goalUpdates: boolean;
  milestones: boolean;
  accountability: boolean;
  reminders: boolean;
  quietHoursStart: Date | null;
  quietHoursEnd: Date | null;
}

interface NotificationPreferenceState {
  preferences: NotificationPreference | null;
  setPreferences: (preferences: NotificationPreference) => void;
  updatePreference: (key: keyof Omit<NotificationPreference, 'id' | 'userId'>, value: boolean | Date | null) => void;
  resetPreferences: () => void;
}

const initialPreferences: NotificationPreference = {
  goalUpdates: true,
  milestones: true,
  accountability: true,
  reminders: true,
  quietHoursStart: null,
  quietHoursEnd: null,
};

export const useNotificationPreference = create<NotificationPreferenceState>()(
  persist(
    (set) => ({
      preferences: null,
      setPreferences: (preferences) => set({ preferences }),
      updatePreference: (key, value) =>
        set((state) => ({
          preferences: state.preferences
            ? {
                ...state.preferences,
                [key]: value,
              }
            : null,
        })),
      resetPreferences: () => set({ preferences: initialPreferences }),
    }),
    {
      name: 'notification-preferences',
    }
  )
);