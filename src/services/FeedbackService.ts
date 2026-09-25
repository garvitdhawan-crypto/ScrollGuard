import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { NativeScrollGuardModule } from '../native/ScrollGuardModule';
import type { KittenStage } from '../store';

const HAPTIC_OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type HapticType =
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError';

class FeedbackServiceClass {
  private isHapticEnabled = true;
  private isSoundEnabled = false;

  public setHapticEnabled(val: boolean): void {
    this.isHapticEnabled = val;
  }

  public setSoundEnabled(val: boolean): void {
    this.isSoundEnabled = val;
  }

  /**
   * Triggers haptic feedback if enabled in settings
   */
  public triggerHaptic(type: HapticType = 'impactLight'): void {
    if (!this.isHapticEnabled) return;

    try {
      ReactNativeHapticFeedback.trigger(type, HAPTIC_OPTIONS);
    } catch {
      // Gracefully ignore on unsupported hardware
    }
  }

  /**
   * Triggers short, non-intrusive sound effect if enabled in settings (default OFF)
   */
  public triggerSound(
    soundType: 'success' | 'warning' | 'danger' | 'tap' | 'milestone',
  ): void {
    if (!this.isSoundEnabled) return;

    try {
      NativeScrollGuardModule.playSoundEffect(soundType);
    } catch {
      // Non-critical sound failure
    }
  }

  /**
   * Key interaction: Challenge completed
   */
  public onChallengeCompleted(): void {
    this.triggerHaptic('notificationSuccess');
    this.triggerSound('success');
  }

  /**
   * Key interaction: Streak milestone reached
   */
  public onStreakMilestone(): void {
    this.triggerHaptic('notificationSuccess');
    this.triggerSound('milestone');
  }

  /**
   * Key interaction: Roast revealed / generated
   */
  public onRoastRevealed(): void {
    this.triggerHaptic('impactMedium');
    this.triggerSound('tap');
  }

  /**
   * Key interaction: Kitten health state changes
   */
  public onKittenStateChange(stage: KittenStage): void {
    switch (stage) {
      case 'healthy':
        this.triggerHaptic('impactLight');
        this.triggerSound('tap');
        break;
      case 'tired':
        this.triggerHaptic('impactMedium');
        this.triggerSound('tap');
        break;
      case 'sick':
        this.triggerHaptic('notificationWarning');
        this.triggerSound('warning');
        break;
      case 'critical':
        this.triggerHaptic('notificationWarning');
        this.triggerSound('danger');
        break;
      case 'dead':
        this.triggerHaptic('notificationError');
        this.triggerSound('danger');
        break;
    }
  }

  /**
   * Key interaction: Kitten revived
   */
  public onKittenRevived(): void {
    this.triggerHaptic('notificationSuccess');
    this.triggerSound('success');
  }
}

export const FeedbackService = new FeedbackServiceClass();
