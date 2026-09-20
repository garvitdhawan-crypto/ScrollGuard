import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useAppStore, KittenStage } from '../store';

export const CatReportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isSharing, setIsSharing] = useState(false);

  const {
    pet,
    weeklyPetHistory,
    kittenDeathsThisWeek,
    kittenRevivesThisWeek,
  } = useAppStore();

  const healthyDaysCount = weeklyPetHistory.filter(
    (h) => h.finalStage === 'healthy',
  ).length;

  const criticalOrDeadDaysCount = weeklyPetHistory.filter(
    (h) => h.finalStage === 'critical' || h.finalStage === 'dead',
  ).length;

  // Narrative summary generator
  const getNarrativeSummary = () => {
    if (criticalOrDeadDaysCount >= 3 || kittenDeathsThisWeek >= 2) {
      return {
        title: 'AN AGONIZING WEEK FOR YOUR COMPANION',
        badgeColor: theme.colors.error,
        emoji: '😿💔',
        text: 'Your kitten had a brutal week — trapped in critical condition for multiple days under relentless reels. It took serious emotional damage, but it lives on thanks to Phoenix elixirs.',
      };
    } else if (kittenDeathsThisWeek === 1) {
      return {
        title: 'A CLOSE CALL WITH THE REEL VOID',
        badgeColor: theme.colors.warning,
        emoji: '🙀⚡',
        text: 'Your kitten flatlined once this week after a 700-reel spike, but bounced back. Your willpower rescued it from becoming a permanent tombstone.',
      };
    } else if (healthyDaysCount >= 5) {
      return {
        title: 'TRUE GUARDIAN ANGEL',
        badgeColor: theme.colors.primary,
        emoji: '🐱👑✨',
        text: 'Incredible mindfulness! Your companion spent nearly the entire week healthy, energetic, and purring happily. Your dopamine discipline is a fortress.',
      };
    } else {
      return {
        title: 'SURVIVED WITH TIRED PAWS',
        badgeColor: theme.colors.warning,
        emoji: '🐱💤',
        text: 'Your kitten spent most of the week yawning and fatigued from periodic scroll sprees, but you successfully prevented total dopamine collapse.',
      };
    }
  };

  const narrative = getNarrativeSummary();

  const getStageEmoji = (stage: KittenStage) => {
    switch (stage) {
      case 'healthy':
        return '🐱✨';
      case 'tired':
        return '🐱💤';
      case 'sick':
        return '😿🌡️';
      case 'critical':
        return '🙀💔';
      case 'dead':
        return '🪦👻';
    }
  };

  const getStageColor = (stage: KittenStage) => {
    switch (stage) {
      case 'healthy':
        return theme.colors.primary;
      case 'tired':
        return theme.colors.warning;
      case 'sick':
        return theme.colors.accent;
      case 'critical':
      case 'dead':
        return theme.colors.error;
    }
  };

  const handleShare = async () => {
    if (isSharing) {
      return;
    }
    setIsSharing(true);

    try {
      const timelineText = weeklyPetHistory
        .map((h) => `${h.dayName}: ${h.finalStage.toUpperCase()} ${getStageEmoji(h.finalStage)} (${h.healthPercent}% HP)`)
        .join('\n');

      await Share.share({
        title: 'Weekly Kitten Companion Chronicle',
        message: `🐱 ScrollGuard Weekly Cat Report:\n\n${narrative.title} ${narrative.emoji}\n\n"${narrative.text}"\n\n📊 7-Day Timeline:\n${timelineText}\n\n❤️ Healthy Days: ${healthyDaysCount} | ☠️ Critical/Dead: ${criticalOrDeadDaysCount}\n💖 Revives Used: ${kittenRevivesThisWeek}\n\n🛡️ Defend your focus on ScrollGuard: scrollguard.app`,
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Story Card */}
        <View style={styles.storyCard}>
          <View style={styles.header}>
            <Text style={styles.logoText}>🛡️ SCROLLGUARD</Text>
            <Text style={styles.subtitle}>WEEKLY CAT REPORT • 7-DAY CHRONICLE</Text>
          </View>

          {/* Hero Narrative Assessment */}
          <View style={styles.heroBox}>
            <Text style={styles.heroEmoji}>{narrative.emoji}</Text>
            <Text style={[styles.heroTitle, { color: narrative.badgeColor }]}>
              {narrative.title}
            </Text>
            <Text style={styles.heroText}>"{narrative.text}"</Text>
          </View>

          {/* Current State & Vitality */}
          <View style={styles.currentStateCard}>
            <View style={styles.currentStateHeader}>
              <Text style={styles.currentLabel}>CURRENT COMPANION STATE</Text>
              <Text style={[styles.currentValue, { color: getStageColor(pet.stage) }]}>
                {pet.stage.toUpperCase()} ({pet.healthPercent}% HP)
              </Text>
            </View>
            <View style={styles.hpBarBg}>
              <View
                style={[
                  styles.hpBarFill,
                  {
                    width: `${pet.healthPercent}%`,
                    backgroundColor: getStageColor(pet.stage),
                  },
                ]}
              />
            </View>
          </View>

          {/* 7-Day Day-by-Day Timeline */}
          <Text style={styles.timelineHeading}>📅 7-DAY COMPANION TIMELINE</Text>
          <View style={styles.timelineList}>
            {weeklyPetHistory.map((item, index) => (
              <View key={`${item.date}-${index}`} style={styles.timelineRow}>
                <View style={styles.dayCol}>
                  <Text style={styles.dayName}>{item.dayName}</Text>
                  <Text style={styles.dayDate}>{item.date.slice(5)}</Text>
                </View>

                <View style={styles.stateCol}>
                  <Text style={styles.stageEmoji}>{getStageEmoji(item.finalStage)}</Text>
                  <View style={styles.stageDetails}>
                    <Text
                      style={[
                        styles.stageName,
                        { color: getStageColor(item.finalStage) },
                      ]}
                    >
                      {item.finalStage.toUpperCase()}
                    </Text>
                    <Text style={styles.stageSub}>
                      {item.reelsScrolled} reels • {item.healthPercent}% HP
                    </Text>
                  </View>
                </View>

                <View style={styles.tagCol}>
                  {item.died && <Text style={styles.diedTag}>DIED</Text>}
                  {item.revived && <Text style={styles.revivedTag}>REVIVED</Text>}
                  {!item.died && !item.revived && (
                    <Text style={styles.normalTag}>SURVIVED</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Summary Metric Counters */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={[styles.metricNum, { color: theme.colors.primary }]}>
                {healthyDaysCount}d
              </Text>
              <Text style={styles.metricLabel}>HEALTHY DAYS</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={[styles.metricNum, { color: theme.colors.error }]}>
                {criticalOrDeadDaysCount}d
              </Text>
              <Text style={styles.metricLabel}>CRITICAL / DEAD</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={[styles.metricNum, { color: theme.colors.accent }]}>
                {kittenDeathsThisWeek}
              </Text>
              <Text style={styles.metricLabel}>DEATHS</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={[styles.metricNum, { color: theme.colors.xpGold }]}>
                {kittenRevivesThisWeek}
              </Text>
              <Text style={styles.metricLabel}>REVIVES</Text>
            </View>
          </View>

          <View style={styles.storyFooter}>
            <Text style={styles.watermark}>
              Emotional accountability for your digital health • scrollguard.app
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: theme.colors.primary }]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.shareBtnText}>
            {isSharing ? 'Sharing...' : '📤 Share Weekly Cat Report'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>Return to Fortress</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  storyCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.xs,
  },
  logoText: {
    fontSize: 12,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  heroBox: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize.sm + 1,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 1,
    textAlign: 'center',
  },
  heroText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
    lineHeight: 16,
    maxWidth: 270,
  },
  currentStateCard: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm + 2,
    marginBottom: theme.spacing.md,
  },
  currentStateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  currentLabel: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
  },
  currentValue: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
  },
  hpBarBg: {
    height: 6,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  hpBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  timelineHeading: {
    alignSelf: 'flex-start',
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: theme.spacing.xs,
  },
  timelineList: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 4,
  },
  dayCol: {
    width: 36,
  },
  dayName: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  dayDate: {
    fontSize: 9,
    color: theme.colors.textMuted,
  },
  stateCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  stageEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  stageDetails: {
    flex: 1,
  },
  stageName: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
  },
  stageSub: {
    fontSize: 9,
    color: theme.colors.textSecondary,
  },
  tagCol: {
    alignItems: 'flex-end',
  },
  diedTag: {
    fontSize: 8,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.error,
    backgroundColor: 'rgba(255, 51, 102, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  revivedTag: {
    fontSize: 8,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
    backgroundColor: 'rgba(0, 255, 163, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  normalTag: {
    fontSize: 8,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  metricCard: {
    flex: 0.23,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 6,
    alignItems: 'center',
  },
  metricNum: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.heavy,
  },
  metricLabel: {
    fontSize: 7,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  storyFooter: {
    marginTop: 2,
  },
  watermark: {
    fontSize: 9,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  shareBtn: {
    width: '100%',
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  shareBtnText: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textInverse,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  backBtn: {
    paddingVertical: theme.spacing.sm,
  },
  backBtnText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
