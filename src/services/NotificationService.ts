import notifee, { AndroidImportance, TriggerType, TimestampTrigger } from '@notifee/react-native';
import { Platform } from 'react-native';

const CHANNEL_ALERTS = 'scrollguard_alerts';
const CHANNEL_REPORTS = 'scrollguard_reports';
const CHANNEL_REMINDERS = 'scrollguard_reminders';

class NotificationServiceClass {
  private isInitialized = false;

  public async init(): Promise<void> {
    if (this.isInitialized || Platform.OS !== 'android') return;

    try {
      // Request permission on Android 13+ (POST_NOTIFICATIONS)
      await notifee.requestPermission();

      // Create notification channels
      await notifee.createChannel({
        id: CHANNEL_ALERTS,
        name: 'ScrollGuard Limit Alerts',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });

      await notifee.createChannel({
        id: CHANNEL_REPORTS,
        name: 'Weekly Reports & Wrapped',
        importance: AndroidImportance.DEFAULT,
        sound: 'default',
      });

      await notifee.createChannel({
        id: CHANNEL_REMINDERS,
        name: 'Daily Check-in Reminders',
        importance: AndroidImportance.DEFAULT,
        sound: 'default',
      });

      this.isInitialized = true;
    } catch (e) {
      // Graceful fallback if permission or channel creation fails
      console.warn('[NotificationService] Channel initialization error:', e);
    }
  }

  /**
   * Threshold-warning notification when approaching 80% of daily reel/time limit
   */
  public async sendThresholdWarningNotification(
    reelsScrolled: number,
    limit: number,
  ): Promise<void> {
    if (Platform.OS !== 'android') return;
    await this.init();

    try {
      await notifee.displayNotification({
        id: 'threshold_warning',
        title: '⚠️ 80% Scroll Limit Approaching!',
        body: `You've scrolled ${reelsScrolled} of your ${limit} reel limit today. Your kitten is getting anxious! 😿`,
        android: {
          channelId: CHANNEL_ALERTS,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (e) {
      console.warn('[NotificationService] Error sending threshold notification:', e);
    }
  }

  /**
   * Daily reminder notification if user hasn't opened app ("Your kitten misses you 🐱")
   */
  public async sendDailyReminderNotification(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await this.init();

    try {
      await notifee.displayNotification({
        id: 'daily_reminder',
        title: 'Your kitten misses you 🐱',
        body: "You haven't checked in with ScrollGuard today. Keep your streak alive and save your time!",
        android: {
          channelId: CHANNEL_REMINDERS,
          importance: AndroidImportance.DEFAULT,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (e) {
      console.warn('[NotificationService] Error sending daily reminder:', e);
    }
  }

  /**
   * Weekly Wrapped ready notification
   */
  public async sendWeeklyWrappedNotification(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await this.init();

    try {
      await notifee.displayNotification({
        id: 'weekly_wrapped_ready',
        title: '✨ Your Weekly Scroll Wrapped is Ready!',
        body: 'See how many hours and reels you conquered this week in your custom doodle story report.',
        android: {
          channelId: CHANNEL_REPORTS,
          importance: AndroidImportance.DEFAULT,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (e) {
      console.warn('[NotificationService] Error sending wrapped notification:', e);
    }
  }

  /**
   * Weekly Cat Report ready notification
   */
  public async sendWeeklyCatReportNotification(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await this.init();

    try {
      await notifee.displayNotification({
        id: 'weekly_cat_report_ready',
        title: '🐾 Weekly Cat Journey Report Ready!',
        body: "Your kitten's 7-day survival ledger has been recorded. Check their health report!",
        android: {
          channelId: CHANNEL_REPORTS,
          importance: AndroidImportance.DEFAULT,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (e) {
      console.warn('[NotificationService] Error sending cat report notification:', e);
    }
  }

  /**
   * Schedules a daily inactivity reminder for 8:00 PM if app is idle
   */
  public async scheduleDailyCheckin(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await this.init();

    try {
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(20, 0, 0, 0); // 8:00 PM today

      // If already past 8 PM, schedule for tomorrow
      if (now.getTime() > scheduledTime.getTime()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: scheduledTime.getTime(),
      };

      await notifee.createTriggerNotification(
        {
          id: 'scheduled_daily_checkin',
          title: 'Your kitten misses you 🐱',
          body: "Don't let the algorithm win tonight. Check your daily scroll stats before bed!",
          android: {
            channelId: CHANNEL_REMINDERS,
            importance: AndroidImportance.DEFAULT,
            pressAction: {
              id: 'default',
            },
          },
        },
        trigger,
      );
    } catch (e) {
      console.warn('[NotificationService] Error scheduling trigger notification:', e);
    }
  }
}

export const NotificationService = new NotificationServiceClass();
