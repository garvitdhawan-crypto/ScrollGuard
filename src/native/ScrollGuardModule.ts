import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

export interface ReelScrolledEvent {
  source: 'com.instagram.android' | 'com.google.android.youtube' | string;
  timestamp: number;
  totalScrollsToday?: number;
}

export interface ScreenTimeUpdateEvent {
  source: 'com.instagram.android' | 'com.google.android.youtube' | string;
  secondsSpent: number;
  sessionDurationSeconds?: number;
}

export interface AppLifecycleEvent {
  source: 'com.instagram.android' | 'com.google.android.youtube' | string;
  timestamp: number;
  sessionDurationSeconds?: number;
}

export interface SessionStats {
  reelsScrolled: number;
  timeSpentSeconds: number;
}

interface ScrollGuardNativeModuleInterface {
  isAccessibilityServiceEnabled: () => Promise<boolean>;
  openAccessibilitySettings: () => void;
  getSessionStats: (packageName: string) => Promise<SessionStats>;
  playSoundEffect: (soundType: 'success' | 'warning' | 'danger' | 'tap' | 'milestone') => void;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

const { ScrollGuardModule } = NativeModules;

export const NativeScrollGuardModule: ScrollGuardNativeModuleInterface = {
  isAccessibilityServiceEnabled: async () => {
    if (Platform.OS !== 'android') return false;
    return ScrollGuardModule?.isAccessibilityServiceEnabled?.() ?? false;
  },
  openAccessibilitySettings: () => {
    if (Platform.OS === 'android') {
      ScrollGuardModule?.openAccessibilitySettings?.();
    }
  },
  playSoundEffect: (soundType) => {
    if (Platform.OS === 'android') {
      ScrollGuardModule?.playSoundEffect?.(soundType);
    }
  },
  getSessionStats: async (packageName: string) => {
    if (Platform.OS !== 'android') {
      return { reelsScrolled: 0, timeSpentSeconds: 0 };
    }
    return (
      ScrollGuardModule?.getSessionStats?.(packageName) ?? {
        reelsScrolled: 0,
        timeSpentSeconds: 0,
      }
    );
  },
  addListener: (eventName: string) => {
    ScrollGuardModule?.addListener?.(eventName);
  },
  removeListeners: (count: number) => {
    ScrollGuardModule?.removeListeners?.(count);
  },
};

export const ScrollGuardEventEmitter =
  Platform.OS === 'android' && ScrollGuardModule
    ? new NativeEventEmitter(ScrollGuardModule)
    : null;
