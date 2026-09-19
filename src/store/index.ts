import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // Calendar date tracking (YYYY-MM-DD)
  lastActiveDate: string;

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
  checkAndPerformDailyRollover: () => void;
}

const MAX_DEADLY_REELS = 700;

const getTodayDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Item 3: Initial onboarding flag set back to false for first-time launch
      hasOnboarded: false,
      completeOnboarding: () => set({ hasOnboarded: true }),

      lastActiveDate: getTodayDateString(),

      currentStreak: 0,
      longestStreak: 0,
      dailyReelThreshold: 50,
      dailyTimeThresholdMinutes: 25,

      // Historical Graveyard & Debt
      lifetimeMinutesLost: 0,
      lifetimeReelsScrolled: 0,
      weekMinutesLost: 0,
      weekReelsScrolled: 0,

      isLockActive: false,
      overridesToday: 0,
      triggerLock: () => set({ isLockActive: true }),
      dismissLock: () => set({ isLockActive: false }),
      requestOverride: (extraMinutes: number) => {
        set((state) => {
          const newOverrides = state.overridesToday + 1;
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

      xp: 0,
      level: 1,
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

      // Item 2: Streak Rollover & Daily Reset Logic
      checkAndPerformDailyRollover: () => {
        const today = getTodayDateString();
        const yesterday = getYesterdayDateString();
        const {
          lastActiveDate,
          blockedApps,
          dailyReelThreshold,
          dailyTimeThresholdMinutes,
          currentStreak,
          longestStreak,
          pet,
        } = get();

        // If already evaluated today, nothing to roll over
        if (lastActiveDate === today) {
          return;
        }

        const totalReelsYesterday = blockedApps.reduce(
          (acc, a) => acc + a.reelsScrolledToday,
          0,
        );
        const totalMinutesYesterday = blockedApps.reduce(
          (acc, a) => acc + Math.floor(a.timeSpentSecondsToday / 60),
          0,
        );

        let newStreak = currentStreak;

        // Check if yesterday was disciplined
        if (lastActiveDate === yesterday) {
          const stayedUnderLimit =
            totalReelsYesterday <= dailyReelThreshold &&
            totalMinutesYesterday <= dailyTimeThresholdMinutes;

          if (stayedUnderLimit) {
            newStreak = currentStreak + 1;
          } else {
            newStreak = 0; // Broke discipline
          }
        } else {
          // Missed one or more days entirely -> streak reset
          newStreak = 0;
        }

        const newLongest = Math.max(longestStreak, newStreak);

        // Reset today's app metrics for the fresh new day
        const resetApps = blockedApps.map((app) => ({
          ...app,
          timeSpentSecondsToday: 0,
          reelsScrolledToday: 0,
          isBlocked: false,
        }));

        // Naturally resurrect or refresh kitten if disciplined
        let updatedPet = { ...pet };
        if (pet.isDead && newStreak > 0) {
          updatedPet = {
            ...pet,
            isDead: false,
            healthPercent: 60,
            stage: 'healthy',
          };
        } else if (!pet.isDead) {
          updatedPet = {
            ...pet,
            healthPercent: 100,
            stage: 'healthy',
          };
        }

        set({
          lastActiveDate: today,
          currentStreak: newStreak,
          longestStreak: newLongest,
          overridesToday: 0,
          blockedApps: resetApps,
          pet: updatedPet,
          isLockActive: false,
        });
      },

      recordReelScroll: (packageName) => {
        get().checkAndPerformDailyRollover();
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
        get().checkAndPerformDailyRollover();
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
    }),
    {
      name: 'scrollguard-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasOnboarded: state.hasOnboarded,
        lastActiveDate: state.lastActiveDate,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lifetimeMinutesLost: state.lifetimeMinutesLost,
        lifetimeReelsScrolled: state.lifetimeReelsScrolled,
        weekMinutesLost: state.weekMinutesLost,
        weekReelsScrolled: state.weekReelsScrolled,
        roastIntensity: state.roastIntensity,
        xp: state.xp,
        level: state.level,
        pet: state.pet,
        blockedApps: state.blockedApps,
      }),
    },
  ),
);
