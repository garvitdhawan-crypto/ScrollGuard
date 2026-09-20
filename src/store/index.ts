import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoastEngine, RoastIntensity, RoastResult } from '../services/RoastEngine';

export type KittenStage = 'healthy' | 'tired' | 'sick' | 'critical' | 'dead';

export interface DailyPetLog {
  date: string;
  dayName: string;
  finalStage: KittenStage;
  healthPercent: number;
  reelsScrolled: number;
  died: boolean;
  revived: boolean;
}

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

export type ChallengeType =
  | 'daily_reel_cap'
  | 'daily_time_cap'
  | 'kitten_vitality'
  | 'streak_milestone'
  | 'zero_overrides';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: 'daily' | 'weekly';
  targetValue: number;
  currentValue: number;
  completed: boolean;
  rewardClaimed: boolean;
  xpReward: number;
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

  // Kitten Companion & Weekly Report
  pet: PetState;
  weeklyPetHistory: DailyPetLog[];
  kittenDeathsThisWeek: number;
  kittenRevivesThisWeek: number;
  reviveKitten: () => void;

  // Challenge Mode & 1-Year Reward
  challenges: Challenge[];
  lifetimeChallengesCompleted: number;
  isPremiumRewardUnlocked: boolean;
  showCelebrationModal: boolean;
  claimChallengeReward: (challengeId: string) => void;
  dismissCelebrationModal: () => void;
  evaluateChallenges: () => void;

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

const getDayName = (dateStr: string): string => {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch_1',
    title: 'Sub-300 Reel Discipline',
    description: 'Keep your total reels scrolled across all apps under 300 today.',
    type: 'daily_reel_cap',
    category: 'daily',
    targetValue: 300,
    currentValue: 0,
    completed: false,
    rewardClaimed: false,
    xpReward: 150,
  },
  {
    id: 'ch_2',
    title: 'Detox Under 20m',
    description: 'Stay under 20 total minutes of short-form feed time today.',
    type: 'daily_time_cap',
    category: 'daily',
    targetValue: 20,
    currentValue: 0,
    completed: false,
    rewardClaimed: false,
    xpReward: 150,
  },
  {
    id: 'ch_3',
    title: 'Kitten Guardian',
    description: 'Keep your kitten companion vitality at or above 50% HP today.',
    type: 'kitten_vitality',
    category: 'daily',
    targetValue: 50,
    currentValue: 100,
    completed: false,
    rewardClaimed: false,
    xpReward: 200,
  },
  {
    id: 'ch_4',
    title: 'Fortress Momentum',
    description: 'Reach or sustain an active streak of at least 3 days.',
    type: 'streak_milestone',
    category: 'weekly',
    targetValue: 3,
    currentValue: 0,
    completed: false,
    rewardClaimed: false,
    xpReward: 350,
  },
  {
    id: 'ch_5',
    title: 'Zero Overrides Day',
    description: 'Complete the day without using any "5 more minutes" overrides.',
    type: 'zero_overrides',
    category: 'daily',
    targetValue: 0,
    currentValue: 0,
    completed: false,
    rewardClaimed: false,
    xpReward: 175,
  },
];

// Meaningful baseline history for initial render & preview
const INITIAL_WEEKLY_PET_HISTORY: DailyPetLog[] = [
  {
    date: '2026-09-14',
    dayName: 'Mon',
    finalStage: 'healthy',
    healthPercent: 88,
    reelsScrolled: 84,
    died: false,
    revived: false,
  },
  {
    date: '2026-09-15',
    dayName: 'Tue',
    finalStage: 'tired',
    healthPercent: 65,
    reelsScrolled: 245,
    died: false,
    revived: false,
  },
  {
    date: '2026-09-16',
    dayName: 'Wed',
    finalStage: 'sick',
    healthPercent: 42,
    reelsScrolled: 406,
    died: false,
    revived: false,
  },
  {
    date: '2026-09-17',
    dayName: 'Thu',
    finalStage: 'critical',
    healthPercent: 18,
    reelsScrolled: 574,
    died: false,
    revived: false,
  },
  {
    date: '2026-09-18',
    dayName: 'Fri',
    finalStage: 'dead',
    healthPercent: 0,
    reelsScrolled: 712,
    died: true,
    revived: false,
  },
  {
    date: '2026-09-19',
    dayName: 'Sat',
    finalStage: 'healthy',
    healthPercent: 80,
    reelsScrolled: 140,
    died: false,
    revived: true,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      completeOnboarding: () => set({ hasOnboarded: true }),

      lastActiveDate: getTodayDateString(),

      currentStreak: 0,
      longestStreak: 0,
      dailyReelThreshold: 50,
      dailyTimeThresholdMinutes: 25,

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
        get().evaluateChallenges();
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

      // Weekly Pet History & Cat Report Data
      weeklyPetHistory: INITIAL_WEEKLY_PET_HISTORY,
      kittenDeathsThisWeek: 1,
      kittenRevivesThisWeek: 1,

      challenges: INITIAL_CHALLENGES,
      lifetimeChallengesCompleted: 0,
      isPremiumRewardUnlocked: false,
      showCelebrationModal: false,

      dismissCelebrationModal: () => set({ showCelebrationModal: false }),

      claimChallengeReward: (challengeId: string) => {
        set((state) => {
          const ch = state.challenges.find((c) => c.id === challengeId);
          if (!ch || !ch.completed || ch.rewardClaimed) {
            return state;
          }

          const newTotalCompleted = state.lifetimeChallengesCompleted + 1;
          const unlocksPremium = newTotalCompleted >= 10 && !state.isPremiumRewardUnlocked;

          const updatedChallenges = state.challenges.map((c) =>
            c.id === challengeId ? { ...c, rewardClaimed: true } : c,
          );

          return {
            challenges: updatedChallenges,
            xp: state.xp + ch.xpReward,
            lifetimeChallengesCompleted: newTotalCompleted,
            isPremiumRewardUnlocked: state.isPremiumRewardUnlocked || unlocksPremium,
            showCelebrationModal: unlocksPremium ? true : state.showCelebrationModal,
          };
        });
      },

      evaluateChallenges: () => {
        const {
          blockedApps,
          pet,
          currentStreak,
          overridesToday,
          challenges,
        } = get();

        const totalReelsToday = blockedApps.reduce(
          (acc, a) => acc + a.reelsScrolledToday,
          0,
        );
        const totalMinutesToday = blockedApps.reduce(
          (acc, a) => acc + Math.floor(a.timeSpentSecondsToday / 60),
          0,
        );

        const updated = challenges.map((ch) => {
          let currentVal = ch.currentValue;
          let isComplete = ch.completed;

          switch (ch.type) {
            case 'daily_reel_cap':
              currentVal = totalReelsToday;
              isComplete = totalReelsToday <= ch.targetValue;
              break;

            case 'daily_time_cap':
              currentVal = totalMinutesToday;
              isComplete = totalMinutesToday <= ch.targetValue;
              break;

            case 'kitten_vitality':
              currentVal = pet.healthPercent;
              isComplete = pet.healthPercent >= ch.targetValue && !pet.isDead;
              break;

            case 'streak_milestone':
              currentVal = currentStreak;
              isComplete = currentStreak >= ch.targetValue;
              break;

            case 'zero_overrides':
              currentVal = overridesToday;
              isComplete = overridesToday === 0;
              break;
          }

          return {
            ...ch,
            currentValue: currentVal,
            completed: isComplete,
          };
        });

        set({ challenges: updated });
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
          weeklyPetHistory,
          kittenDeathsThisWeek,
          kittenRevivesThisWeek,
        } = get();

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

        if (lastActiveDate === yesterday) {
          const stayedUnderLimit =
            totalReelsYesterday <= dailyReelThreshold &&
            totalMinutesYesterday <= dailyTimeThresholdMinutes;

          if (stayedUnderLimit) {
            newStreak = currentStreak + 1;
          } else {
            newStreak = 0;
          }
        } else {
          newStreak = 0;
        }

        const newLongest = Math.max(longestStreak, newStreak);

        // Archive yesterday's pet history into rolling weekly log
        const yesterdayLog: DailyPetLog = {
          date: lastActiveDate,
          dayName: getDayName(lastActiveDate),
          finalStage: pet.stage,
          healthPercent: pet.healthPercent,
          reelsScrolled: totalReelsYesterday,
          died: pet.isDead,
          revived: false,
        };

        const updatedHistory = [...weeklyPetHistory, yesterdayLog].slice(-7);

        const resetApps = blockedApps.map((app) => ({
          ...app,
          timeSpentSecondsToday: 0,
          reelsScrolledToday: 0,
          isBlocked: false,
        }));

        let updatedPet = { ...pet };
        let newRevives = kittenRevivesThisWeek;
        if (pet.isDead && newStreak > 0) {
          updatedPet = {
            ...pet,
            isDead: false,
            healthPercent: 60,
            stage: 'healthy',
          };
          newRevives += 1;
        } else if (!pet.isDead) {
          updatedPet = {
            ...pet,
            healthPercent: 100,
            stage: 'healthy',
          };
        }

        const refreshedChallenges = INITIAL_CHALLENGES.map((ch) => ({
          ...ch,
          currentValue: 0,
          completed: false,
          rewardClaimed: false,
        }));

        set({
          lastActiveDate: today,
          currentStreak: newStreak,
          longestStreak: newLongest,
          overridesToday: 0,
          blockedApps: resetApps,
          pet: updatedPet,
          isLockActive: false,
          challenges: refreshedChallenges,
          weeklyPetHistory: updatedHistory,
          kittenDeathsThisWeek: pet.isDead ? kittenDeathsThisWeek + 1 : kittenDeathsThisWeek,
          kittenRevivesThisWeek: newRevives,
        });

        get().evaluateChallenges();
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
        get().evaluateChallenges();
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
        get().evaluateChallenges();
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
        const { blockedApps, pet, kittenDeathsThisWeek } = get();
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

        const wasAlive = !pet.isDead;
        const newDeaths = wasAlive && isDead ? kittenDeathsThisWeek + 1 : kittenDeathsThisWeek;

        set({
          kittenDeathsThisWeek: newDeaths,
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
            kittenRevivesThisWeek: state.kittenRevivesThisWeek + 1,
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
        get().evaluateChallenges();
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
        weeklyPetHistory: state.weeklyPetHistory,
        kittenDeathsThisWeek: state.kittenDeathsThisWeek,
        kittenRevivesThisWeek: state.kittenRevivesThisWeek,
        blockedApps: state.blockedApps,
        challenges: state.challenges,
        lifetimeChallengesCompleted: state.lifetimeChallengesCompleted,
        isPremiumRewardUnlocked: state.isPremiumRewardUnlocked,
      }),
    },
  ),
);
