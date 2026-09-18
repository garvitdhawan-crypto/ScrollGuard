import { create } from 'zustand';
import { RoastEngine, RoastIntensity, RoastResult } from '../services/RoastEngine';

export interface BlockedApp {
  id: string;
  packageName: string;
  appName: string;
  dailyLimitMinutes: number;
  dailyLimitScrolls: number;
  timeSpentSecondsToday: number;
  reelsScrolledToday: number;
  isBlocked: boolean;
}

interface AppState {
  streakDays: number;
  xp: number;
  level: number;
  isGuardActive: boolean;
  roastIntensity: RoastIntensity;
  currentRoast: RoastResult | null;
  blockedApps: BlockedApp[];

  // Actions
  toggleGuard: () => void;
  setRoastIntensity: (intensity: RoastIntensity) => void;
  addXp: (points: number) => void;
  recordReelScroll: (packageName: string) => void;
  updateScreenTime: (packageName: string, seconds: number) => void;
  updateAppLimits: (id: string, limitMinutes: number, limitScrolls: number) => void;
  refreshRoast: (packageName?: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  streakDays: 7,
  xp: 1420,
  level: 4,
  isGuardActive: true,
  roastIntensity: 'Savage',
  currentRoast: {
    message: 'Your shield is active. Stay vigilant against doom-scrolling traps.',
    escalationLevel: 'mild',
    roastStyle: 'calm',
  },
  blockedApps: [
    {
      id: '1',
      packageName: 'com.instagram.android',
      appName: 'Instagram Reels',
      dailyLimitMinutes: 20,
      dailyLimitScrolls: 40,
      timeSpentSecondsToday: 14 * 60 + 25,
      reelsScrolledToday: 34,
      isBlocked: false,
    },
    {
      id: '2',
      packageName: 'com.google.android.youtube',
      appName: 'YouTube Shorts',
      dailyLimitMinutes: 15,
      dailyLimitScrolls: 30,
      timeSpentSecondsToday: 18 * 60 + 10,
      reelsScrolledToday: 48,
      isBlocked: true,
    },
  ],

  toggleGuard: () => set((state) => ({ isGuardActive: !state.isGuardActive })),

  setRoastIntensity: (intensity) => {
    set({ roastIntensity: intensity });
    get().refreshRoast();
  },

  addXp: (points) => set((state) => ({ xp: state.xp + points })),

  recordReelScroll: (packageName) => {
    set((state) => {
      const updated = state.blockedApps.map((app) => {
        if (app.packageName === packageName) {
          const newCount = app.reelsScrolledToday + 1;
          const isBlocked =
            newCount >= app.dailyLimitScrolls ||
            app.timeSpentSecondsToday >= app.dailyLimitMinutes * 60;
          return {
            ...app,
            reelsScrolledToday: newCount,
            isBlocked,
          };
        }
        return app;
      });
      return { blockedApps: updated };
    });
    get().refreshRoast(packageName);
  },

  updateScreenTime: (packageName, seconds) => {
    set((state) => {
      const updated = state.blockedApps.map((app) => {
        if (app.packageName === packageName) {
          const isBlocked =
            seconds >= app.dailyLimitMinutes * 60 ||
            app.reelsScrolledToday >= app.dailyLimitScrolls;
          return {
            ...app,
            timeSpentSecondsToday: seconds,
            isBlocked,
          };
        }
        return app;
      });
      return { blockedApps: updated };
    });
    get().refreshRoast(packageName);
  },

  updateAppLimits: (id, limitMinutes, limitScrolls) =>
    set((state) => ({
      blockedApps: state.blockedApps.map((app) =>
        app.id === id
          ? {
              ...app,
              dailyLimitMinutes: limitMinutes,
              dailyLimitScrolls: limitScrolls,
              isBlocked:
                app.timeSpentSecondsToday >= limitMinutes * 60 ||
                app.reelsScrolledToday >= limitScrolls,
            }
          : app
      ),
    })),

  refreshRoast: (packageName) => {
    const { blockedApps, roastIntensity } = get();
    const targetApp = packageName
      ? blockedApps.find((a) => a.packageName === packageName)
      : blockedApps.reduce((prev, curr) =>
          curr.reelsScrolledToday > prev.reelsScrolledToday ? curr : prev
        );

    if (!targetApp) return;

    const roast = RoastEngine.generateRoast({
      appName: targetApp.appName,
      reelsScrolled: targetApp.reelsScrolledToday,
      screenTimeSeconds: targetApp.timeSpentSecondsToday,
      intensity: roastIntensity,
    });

    set({ currentRoast: roast });
  },
}));
