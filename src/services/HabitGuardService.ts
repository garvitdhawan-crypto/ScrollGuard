import { NativeScrollGuard } from '../native';

export class HabitGuardService {
  static async verifyAndroidPermissions(): Promise<{ usageStats: boolean; overlay: boolean }> {
    const usageStats = await NativeScrollGuard.checkUsageStatsPermission();
    const overlay = await NativeScrollGuard.checkOverlayPermission();
    return { usageStats, overlay };
  }

  static async enableHabitShield(): Promise<boolean> {
    return await NativeScrollGuard.startGuardService();
  }

  static async disableHabitShield(): Promise<boolean> {
    return await NativeScrollGuard.stopGuardService();
  }
}
