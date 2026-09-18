import {
  NativeScrollGuardModule,
  ScrollGuardEventEmitter,
  ReelScrolledEvent,
  ScreenTimeUpdateEvent,
  AppLifecycleEvent,
  SessionStats,
} from '../native';

export class HabitGuardService {
  static async isAccessibilityEnabled(): Promise<boolean> {
    return await NativeScrollGuardModule.isAccessibilityServiceEnabled();
  }

  static openSettings(): void {
    NativeScrollGuardModule.openAccessibilitySettings();
  }

  static async getStats(packageName: string): Promise<SessionStats> {
    return await NativeScrollGuardModule.getSessionStats(packageName);
  }

  static subscribeToEvents(callbacks: {
    onReelScrolled?: (event: ReelScrolledEvent) => void;
    onScreenTimeUpdate?: (event: ScreenTimeUpdateEvent) => void;
    onAppForeground?: (event: AppLifecycleEvent) => void;
    onAppBackground?: (event: AppLifecycleEvent) => void;
  }) {
    if (!ScrollGuardEventEmitter) {
      return () => {};
    }

    const subs = [
      callbacks.onReelScrolled &&
        ScrollGuardEventEmitter.addListener(
          'onReelScrolled',
          (rawEvent: any) => callbacks.onReelScrolled?.(rawEvent as ReelScrolledEvent),
        ),
      callbacks.onScreenTimeUpdate &&
        ScrollGuardEventEmitter.addListener(
          'onScreenTimeUpdate',
          (rawEvent: any) => callbacks.onScreenTimeUpdate?.(rawEvent as ScreenTimeUpdateEvent),
        ),
      callbacks.onAppForeground &&
        ScrollGuardEventEmitter.addListener(
          'onAppForeground',
          (rawEvent: any) => callbacks.onAppForeground?.(rawEvent as AppLifecycleEvent),
        ),
      callbacks.onAppBackground &&
        ScrollGuardEventEmitter.addListener(
          'onAppBackground',
          (rawEvent: any) => callbacks.onAppBackground?.(rawEvent as AppLifecycleEvent),
        ),
    ].filter(Boolean);

    return () => {
      subs.forEach((sub) => sub?.remove());
    };
  }
}
