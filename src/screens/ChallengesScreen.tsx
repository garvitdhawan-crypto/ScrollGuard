import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { theme } from '../theme';
import { useAppStore, Challenge } from '../store';

export const ChallengesScreen: React.FC = () => {
  const {
    challenges,
    lifetimeChallengesCompleted,
    isPremiumRewardUnlocked,
    showCelebrationModal,
    dismissCelebrationModal,
    claimChallengeReward,
    evaluateChallenges,
  } = useAppStore();

  useEffect(() => {
    evaluateChallenges();
  }, [evaluateChallenges]);

  const targetMilestone = 10;
  const progressToPremium = Math.min(
    100,
    (lifetimeChallengesCompleted / targetMilestone) * 100,
  );

  const dailyQuests = challenges.filter((c) => c.category === 'daily');
  const weeklyQuests = challenges.filter((c) => c.category === 'weekly');

  const renderChallengeCard = (ch: Challenge) => {
    let progressRatio = 0;
    if (ch.type === 'daily_reel_cap' || ch.type === 'daily_time_cap') {
      progressRatio = Math.min(1, ch.currentValue / ch.targetValue);
    } else {
      progressRatio = Math.min(1, ch.currentValue / ch.targetValue);
    }

    const canClaim = ch.completed && !ch.rewardClaimed;

    return (
      <View
        key={ch.id}
        style={[
          styles.card,
          ch.completed && styles.cardCompleted,
          ch.rewardClaimed && styles.cardClaimed,
        ]}
      >
        <View style={styles.cardTop}>
          <View style={styles.titleCol}>
            <Text style={styles.cardTitle}>{ch.title}</Text>
            <Text style={styles.cardDesc}>{ch.description}</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{ch.xpReward} XP</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {ch.type === 'kitten_vitality'
                ? `Vitality: ${ch.currentValue}% / ${ch.targetValue}%`
                : ch.type === 'streak_milestone'
                ? `Streak: ${ch.currentValue} / ${ch.targetValue} days`
                : ch.type === 'zero_overrides'
                ? `Overrides used: ${ch.currentValue}`
                : `${ch.currentValue} / ${ch.targetValue}`}
            </Text>
            <Text
              style={[
                styles.statusText,
                { color: ch.completed ? theme.colors.primary : theme.colors.warning },
              ]}
            >
              {ch.completed ? 'COMPLETED' : 'IN PROGRESS'}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressRatio * 100}%`,
                  backgroundColor: ch.completed
                    ? theme.colors.primary
                    : theme.colors.warning,
                },
              ]}
            />
          </View>
        </View>

        {/* Claim Reward Button */}
        {canClaim && (
          <TouchableOpacity
            style={styles.claimButton}
            onPress={() => claimChallengeReward(ch.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.claimButtonText}>
              🎁 Claim +{ch.xpReward} XP Reward
            </Text>
          </TouchableOpacity>
        )}

        {ch.rewardClaimed && (
          <View style={styles.claimedBadge}>
            <Text style={styles.claimedText}>✓ Reward Claimed</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Challenge Arena</Text>
      <Text style={styles.headerSubtitle}>
        Conquer dopamine challenges & unlock 1 Year Free Premium
      </Text>

      {/* The 1-Year Premium Milestone Fortress Card */}
      <View
        style={[
          styles.premiumCard,
          isPremiumRewardUnlocked && styles.premiumCardUnlocked,
        ]}
      >
        <View style={styles.premiumHeader}>
          <Text style={styles.crownIcon}>
            {isPremiumRewardUnlocked ? '👑' : '🏆'}
          </Text>
          <View style={styles.premiumTextCol}>
            <Text style={styles.premiumTag}>GRANDMASTER REWARD</Text>
            <Text style={styles.premiumTitle}>
              {isPremiumRewardUnlocked
                ? '1 Year Free Premium Unlocked!'
                : '1 Year Free Premium Access'}
            </Text>
            <Text style={styles.premiumDesc}>
              Complete 10 challenges to permanently unlock full premium powers for 365 days.
            </Text>
          </View>
        </View>

        {/* Milestone Progress */}
        <View style={styles.milestoneSection}>
          <View style={styles.milestoneRow}>
            <Text style={styles.milestoneLabel}>CHALLENGES COMPLETED</Text>
            <Text style={styles.milestoneValue}>
              {lifetimeChallengesCompleted} / {targetMilestone}
            </Text>
          </View>
          <View style={styles.milestoneBarBg}>
            <View
              style={[
                styles.milestoneBarFill,
                {
                  width: `${progressToPremium}%`,
                  backgroundColor: isPremiumRewardUnlocked
                    ? theme.colors.xpGold
                    : theme.colors.primary,
                },
              ]}
            />
          </View>
          <Text style={styles.milestoneFootnote}>
            {isPremiumRewardUnlocked
              ? '✨ Claimed! Your 365-day premium membership is active.'
              : `${Math.max(0, targetMilestone - lifetimeChallengesCompleted)} more challenges until 1 year free unlock.`}
          </Text>
        </View>
      </View>

      {/* Daily Challenges */}
      <Text style={styles.sectionHeading}>📅 DAILY CHALLENGES</Text>
      {dailyQuests.map(renderChallengeCard)}

      {/* Weekly Challenges */}
      <Text style={[styles.sectionHeading, { marginTop: theme.spacing.md }]}>
        🛡️ WEEKLY SPRINT QUESTS
      </Text>
      {weeklyQuests.map(renderChallengeCard)}

      {/* 1-Year Premium Celebration Modal */}
      <Modal
        visible={showCelebrationModal}
        transparent
        animationType="fade"
        onRequestClose={dismissCelebrationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.celebrationEmoji}>🎉👑✨</Text>
            <Text style={styles.celebrationTitle}>
              MILESTONE ACHIEVED!
            </Text>
            <Text style={styles.celebrationSubtitle}>
              10 Challenges Completed
            </Text>
            <Text style={styles.celebrationBody}>
              You have displayed incredible digital discipline. As a true Focus Guardian, you have unlocked 1 Full Year of Free ScrollGuard Premium!
            </Text>
            <TouchableOpacity
              style={styles.celebrationButton}
              onPress={dismissCelebrationModal}
              activeOpacity={0.8}
            >
              <Text style={styles.celebrationButtonText}>
                Accept Reward & Reign Supreme 🏰
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.xs + 1,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: theme.spacing.md,
  },
  premiumCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  premiumCardUnlocked: {
    borderColor: theme.colors.xpGold,
    backgroundColor: '#161B22',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  crownIcon: {
    fontSize: 36,
    marginRight: theme.spacing.sm,
  },
  premiumTextCol: {
    flex: 1,
  },
  premiumTag: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.xpGold,
    letterSpacing: 1,
  },
  premiumTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: 1,
  },
  premiumDesc: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  milestoneSection: {
    marginTop: theme.spacing.xs,
  },
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  milestoneLabel: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
  },
  milestoneValue: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
  },
  milestoneBarBg: {
    height: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  milestoneBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  milestoneFootnote: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  cardCompleted: {
    borderColor: theme.colors.primary,
  },
  cardClaimed: {
    opacity: 0.7,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  titleCol: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  cardDesc: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  xpBadge: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.xpGold,
  },
  xpText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.xpGold,
  },
  progressContainer: {
    marginTop: theme.spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  statusText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  claimButton: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs + 4,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    textTransform: 'uppercase',
  },
  claimedBadge: {
    marginTop: theme.spacing.xs,
    alignItems: 'flex-end',
  },
  claimedText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.xpGold,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.xs,
  },
  celebrationTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.xpGold,
    letterSpacing: 1,
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: 2,
    marginBottom: theme.spacing.sm,
  },
  celebrationBody: {
    fontSize: theme.typography.fontSize.xs + 1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  celebrationButton: {
    backgroundColor: theme.colors.xpGold,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  celebrationButtonText: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.heavy,
    color: '#000',
    textTransform: 'uppercase',
  },
});
