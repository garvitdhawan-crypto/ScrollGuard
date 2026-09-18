import { NativeModules, Platform } from 'react-native';

interface ScrollGuardNativeModule {
  checkUsageStatsPermission: () => Promise<boolean>;
  requestUsageStatsPermission: () => void;
  checkOverlayPermission: () => Promise<boolean>;
  requestOverlayPermission: () => void;
  startGuardService: () => Promise<boolean>;
  stopGuardService: () => Promise<boolean>;
}

const { ScrollGuardModule } = NativeModules;

export const NativeScrollGuard: ScrollGuardNativeModule = {
  checkUsageStatsPermission: async () => {
    if (Platform.OS !== 'android') return false;
    return ScrollGuardModule?.checkUsageStatsPermission?.() ?? false;
  },
  requestUsageStatsPermission: () => {
    if (Platform.OS === 'android') {
      ScrollGuardModule?.requestUsageStatsPermission?.();
    }
  },
  checkOverlayPermission: async () => {
    if (Platform.OS !== 'android') return false;
    return ScrollGuardModule?.checkOverlayPermission?.() ?? false;
  },
  requestOverlayPermission: () => {
    if (Platform.OS === 'android') {
      ScrollGuardModule?.requestOverlayPermission?.();
    }
  },
  startGuardService: async () => {
    if (Platform.OS !== 'android') return false;
    return ScrollGuardModule?.startGuardService?.() ?? false;
  },
  stopGuardService: async () => {
    if (Platform.OS !== 'android') return false;
    return ScrollGuardModule?.stopGuardService?.() ?? false;
  },
};
