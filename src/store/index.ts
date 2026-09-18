import { create } from 'zustand';

interface BlockedApp {
  id: string;
  packageName: string;
  appName: string;
  dailyLimitMinutes: number;
  usedMinutesToday: number;
  isBlocked: boolean;
}

interface AppState {
  streakDays: number;
  xp: number;
  level: number;
  isGuardActive: boolean;
  blockedApps: BlockedApp[];
  toggleGuard: () => void;
  addXp: (points: number) => void;
  updateAppLimit: (id: string, limitMinutes: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  streakDays: 7,
  xp: 1420,
  level: 4,
  isGuardActive: true,
  blockedApps: [
    {
      id: '1',
      packageName: 'com.instagram.android',
      appName: 'Instagram',
      dailyLimitMinutes: 20,
      usedMinutesToday: 14,
      isBlocked: false,
    },
    {
      id: '2',
      packageName: 'com.zhiliaoapp.musically',
      appName: 'TikTok',
      dailyLimitMinutes: 15,
      usedMinutesToday: 15,
      isBlocked: true,
    },
    {
      id: '3',
      packageName: 'com.google.android.youtube',
      appName: 'YouTube Shorts',
      dailyLimitMinutes: 30,
      usedMinutesToday: 10,
      isBlocked: false,
    },
  ],
  toggleGuard: () => set((state) => ({ isGuardActive: !state.isGuardActive })),
  addXp: (points) => set((state) => ({ xp: state.xp + points })),
  updateAppLimit: (id, limitMinutes) =>
    set((state) => ({
      blockedApps: state.blockedApps.map((app) =>
        app.id === id ? { ...app, dailyLimitMinutes: limitMinutes } : app
      ),
    })),
}));
