import { create } from 'zustand';
import { RoastEngine, RoastIntensity, RoastResult } from '../services/RoastEngine';

export type KittenStage = 'healthy' | 'tired' | 'sick' | 'critical' | 'dead';

export interface PetState {
  hasAppeared: boolean;
  healthPercent: number; // 0 - 100
  stage: KittenStage;
  revivesRemaining: number;
  isDead: boolean;
}

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
  // Onboarding
  hasOnboarded: boolean;
  completeOnboarding: () => void;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  dailyReelThreshold: number;
  dailyTimeThresholdMinutes: number;

  // Level & Guard
  xp: number;
  level: number;
  isGuardActive: boolean;
  roastIntensity: RoastIntensity;
  currentRoast: RoastResult | null;
  blockedApps: BlockedApp[];

  // Kitten Companion
  pet: PetState;
  reviveKitten: () => void;

  // Actions
  toggleGuard: () => void;
  setRoastIntensity: (intensity: RoastIntensity) => void;
  addXp: (points: number) => void;
  recordReelScroll: (packageName: string) => void;
  updateScreenTime: (packageName: string, seconds: number) => void;
  updateAppLimits: (id: string, limitMinutes: number, limitScrolls: number) => void;
  refreshRoast: (packageName?: string) => void;
  evaluatePetState: () => void;
}

const MAX_DEADLY_REELS = 700;

export const useAppStore = create<AppState>((set, get) => ({
  hasOnboarded: false,
  completeOnboarding: () => set({ hasOnboarded: true }),

  currentStreak: 5,
  longestStreak: 12,
  dailyReelThreshold: 50,
  dailyTimeThresholdMinutes: 25,

  xp: 1420,
  level: 4,
  isGuardActive: true,
  roastIntensity: 'Savage',
  currentRoast: {
    message: 'Your shield is active. Stay vigilant against doom-scrolling traps.',
    escalationLevel: 'mild',
    roastStyle: 'calm',
  },

  pet: {
    hasAppeared: false,
    healthPercent: 100,
    stage: 'healthy',
    revivesRemaining: 1,
    isDead: false,
  },

  blockedApps: [
    {
      id: '1',
      packageName: 'com.instagram.android',
      appName: 'Instagram Reels',
      dailyLimitMinutes: 20,
      dailyLimitScrolls: 40,
      timeSpentSecondsToday: 0,
      reelsScrolledToday: 0,
      isBlocked: false,
    },
    {
      id: '2',
      packageName: 'com.google.android.youtube',
      appName: 'YouTube Shorts',
      dailyLimitMinutes: 15,
      dailyLimitScrolls: 30,
      timeSpentSecondsToday: 0,
      reelsScrolledToday: 0,
      isBlocked: false,
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
    get().evaluatePetState();
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
    get().evaluatePetState();
    get().refreshRoast(packageName);
  },

  evaluatePetState: () => {
    const { blockedApps, pet } = get();
    const totalReelsToday = blockedApps.reduce(
      (sum, app) => sum + app.reelsScrolledToday,
      0,
    );

    if (totalReelsToday === 0 && !pet.hasAppeared) {
      return;
    }

    // Health drops proportionally from 100% to 0% as total scrolls reach 700
    const healthLeft = Math.max(
      0,
      Math.round(((MAX_DEADLY_REELS - totalReelsToday) / MAX_DEADLY_REELS) * 100),
    );

    let stage: KittenStage = 'healthy';
    let isDead = false;

    if (totalReelsToday >= MAX_DEADLY_REELS || healthLeft <= 0) {
      stage = 'dead';
      isDead = true;
    } else if (totalReelsToday >= 550 || healthLeft <= 20) {
      stage = 'critical';
    } else if (totalReelsToday >= 350 || healthLeft <= 50) {
      stage = 'sick';
    } else if (totalReelsToday >= 150 || healthLeft <= 75) {
      stage = 'tired';
    } else {
      stage = 'healthy';
    }

    set({
      pet: {
        ...pet,
        hasAppeared: true,
        healthPercent: healthLeft,
        stage,
        isDead,
      },
    });
  },

  reviveKitten: () => {
    set((state) => {
      if (state.pet.revivesRemaining <= 0) {
        return state;
      }
      return {
        pet: {
          ...state.pet,
          hasAppeared: true,
          healthPercent: 50,
          stage: 'tired',
          isDead: false,
          revivesRemaining: state.pet.revivesRemaining - 1,
        },
      };
    });
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
          : app,
      ),
    })),

  refreshRoast: (packageName) => {
    const { blockedApps, roastIntensity } = get();
    const targetApp = packageName
      ? blockedApps.find((a) => a.packageName === packageName)
      : blockedApps.reduce((prev, curr) =>
          curr.reelsScrolledToday > prev.reelsScrolledToday ? curr : prev,
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
