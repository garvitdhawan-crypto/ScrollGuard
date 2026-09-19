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
import { useAppStore } from '../store';

export const WrappedScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isSharing, setIsSharing] = useState(false);

  const {
    weekReelsScrolled,
    weekMinutesLost,
    pet,
    currentStreak,
    longestStreak,
  } = useAppStore();

  const weekHours = (weekMinutesLost / 60).toFixed(1);

  // Personality archetype based on weekly volume
  const getWeeklyArchetype = () => {
    if (weekReelsScrolled >= 600) {
      return {
        title: 'THE DOOMSCROLL GLADIATOR',
        tagline: 'You spent half the week in an algorithmic gladiator arena.',
        emoji: '⚔️🧟',
        badgeColor: theme.colors.error,
      };
    } else if (weekReelsScrolled >= 300) {
      return {
        title: 'THE ALGORITHM EXPLORER',
        tagline: 'Your thumb has traveled miles through infinite vertical video loops.',
        emoji: '🧭⚡',
        badgeColor: theme.colors.warning,
      };
    } else {
      return {
        title: 'THE MINDFUL GUARDIAN',
        tagline: 'You preserved your attention fortress and protected your kitten.',
        emoji: '🏰✨',
        badgeColor: theme.colors.primary,
      };
    }
  };

  const archetype = getWeeklyArchetype();

  const handleShare = async () => {
    if (isSharing) {
      return;
    }
    setIsSharing(true);

    try {
      await Share.share({
        title: 'My Weekly Scroll Wrapped',
        message: `📊 My Weekly Scroll Wrapped on ScrollGuard:\n\n⚡ ${weekReelsScrolled} reels flicked\n⏱️ ${weekHours} hrs buried\n🐱 Companion: ${pet.isDead ? 'Fallen' : 'Alive & Safe'}\n🔥 Active Streak: ${currentStreak} days (Best ${longestStreak}d)\n\nRank: ${archetype.title}\n\n🛡️ Reclaim your focus with ScrollGuard: scrollguard.app`,
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Vertical Story-Format Spotify-Wrapped Style Card */}
        <View style={styles.storyCard}>
          <View style={styles.storyHeader}>
            <Text style={styles.logoText}>🛡️ SCROLLGUARD</Text>
            <Text style={styles.periodText}>WEEKLY WRAPPED • 2026</Text>
          </View>

          {/* Hero Archetype */}
          <View style={styles.archetypeBox}>
            <Text style={styles.archetypeEmoji}>{archetype.emoji}</Text>
            <Text style={[styles.archetypeBadge, { color: archetype.badgeColor }]}>
              {archetype.title}
            </Text>
            <Text style={styles.archetypeTagline}>{archetype.tagline}</Text>
          </View>

          {/* Stat Highlights */}
          <View style={styles.statGrid}>
            <View style={styles.statCell}>
              <Text style={styles.statNum}>{weekReelsScrolled}</Text>
              <Text style={styles.statTitle}>REELS FLICKED</Text>
              <Text style={styles.statFootnote}>Shorts & Clips</Text>
            </View>

            <View style={styles.statCell}>
              <Text style={[styles.statNum, { color: theme.colors.warning }]}>
                {weekHours}h
              </Text>
              <Text style={styles.statTitle}>TIME BURIED</Text>
              <Text style={styles.statFootnote}>In the Graveyard</Text>
            </View>
          </View>

          {/* Kitten Fate Callout */}
          <View style={styles.kittenFateBox}>
            <Text style={styles.kittenFateIcon}>
              {pet.isDead ? '🪦' : '🐱'}
            </Text>
            <View style={styles.kittenFateText}>
              <Text style={styles.kittenFateTitle}>
                KITTEN STATUS: {pet.isDead ? 'FALLEN ANGEL' : 'THRIVING & SAFE'}
              </Text>
              <Text style={styles.kittenFateDesc}>
                {pet.isDead
                  ? 'Exceeded 700 reels. Requires Phoenix resurrection.'
                  : `Protected with ${pet.healthPercent}% vitality intact.`}
              </Text>
            </View>
          </View>

          {/* Streak & Level */}
          <View style={styles.streakBar}>
            <Text style={styles.streakText}>
              🔥 ACTIVE STREAK: {currentStreak} DAYS (BEST {longestStreak}D)
            </Text>
          </View>

          {/* Story Card Footer */}
          <View style={styles.storyFooter}>
            <Text style={styles.watermark}>Reclaim your mind • scrollguard.app</Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>
            {isSharing ? 'Sharing...' : '📤 Share Weekly Wrapped'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.closeBtnText}>Return to Fortress</Text>
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
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.lg,
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
  periodText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  archetypeBox: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  archetypeEmoji: {
    fontSize: 48,
    marginBottom: 6,
  },
  archetypeBadge: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 1,
    textAlign: 'center',
  },
  archetypeTagline: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  statGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statCell: {
    flex: 0.48,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statNum: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
  },
  statTitle: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  statFootnote: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  kittenFateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.sm + 2,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  kittenFateIcon: {
    fontSize: 26,
    marginRight: theme.spacing.sm,
  },
  kittenFateText: {
    flex: 1,
  },
  kittenFateTitle: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  kittenFateDesc: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  streakBar: {
    width: '100%',
    backgroundColor: theme.colors.card,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  streakText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.streakFire,
    letterSpacing: 0.8,
  },
  storyFooter: {
    marginTop: theme.spacing.xs,
  },
  watermark: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  actionBtn: {
    width: '100%',
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionBtnText: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textInverse,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  closeBtn: {
    paddingVertical: theme.spacing.sm,
  },
  closeBtnText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
