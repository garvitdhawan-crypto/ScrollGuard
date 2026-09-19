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

  // Historical & Graveyard / Scroll Debt
  lifetimeMinutesLost: number;
  lifetimeReelsScrolled: number;
  weekMinutesLost: number;
  weekReelsScrolled: number;

  // Focus Lock & Overrides
  isLockActive: boolean;
  overridesToday: number;
  triggerLock: () => void;
  dismissLock: () => void;
  requestOverride: (extraMinutes: number) => void;

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
  checkLockCondition: () => void;
}

const MAX_DEADLY_REELS = 700;

export const useAppStore = create<AppState>((set, get) => ({
  hasOnboarded: true,
  completeOnboarding: () => set({ hasOnboarded: true }),

  currentStreak: 5,
  longestStreak: 12,
  dailyReelThreshold: 50,
  dailyTimeThresholdMinutes: 25,

  // Baseline data for Time Graveyard / Debt & Wrapped
  lifetimeMinutesLost: 1840, // ~30.6 hours
  lifetimeReelsScrolled: 3420,
  weekMinutesLost: 290, // ~4.8 hours
  weekReelsScrolled: 512,

  isLockActive: false,
  overridesToday: 0,
  triggerLock: () => set({ isLockActive: true }),
  dismissLock: () => set({ isLockActive: false }),
  requestOverride: (extraMinutes: number) => {
    set((state) => {
      const newOverrides = state.overridesToday + 1;
      // Grant extra buffer across blocked apps
      const updatedApps = state.blockedApps.map((app) => ({
        ...app,
        dailyLimitMinutes: app.dailyLimitMinutes + extraMinutes,
        dailyLimitScrolls: app.dailyLimitScrolls + 20,
        isBlocked: false,
      }));
      return {
        overridesToday: newOverrides,
        isLockActive: false,
        blockedApps: updatedApps,
      };
    });
  },

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
      return {
        blockedApps: updated,
        lifetimeReelsScrolled: state.lifetimeReelsScrolled + 1,
        weekReelsScrolled: state.weekReelsScrolled + 1,
      };
    });
    get().evaluatePetState();
    get().refreshRoast(packageName);
    get().checkLockCondition();
  },

  updateScreenTime: (packageName, seconds) => {
    set((state) => {
      const prevSeconds =
        state.blockedApps.find((a) => a.packageName === packageName)
          ?.timeSpentSecondsToday || 0;
      const diffMinutes = Math.max(0, Math.floor((seconds - prevSeconds) / 60));

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
      return {
        blockedApps: updated,
        lifetimeMinutesLost: state.lifetimeMinutesLost + diffMinutes,
        weekMinutesLost: state.weekMinutesLost + diffMinutes,
      };
    });
    get().evaluatePetState();
    get().refreshRoast(packageName);
    get().checkLockCondition();
  },

  checkLockCondition: () => {
    const { blockedApps, isLockActive } = get();
    const shouldLock = blockedApps.some((app) => app.isBlocked);
    if (shouldLock && !isLockActive) {
      set({ isLockActive: true });
    }
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
