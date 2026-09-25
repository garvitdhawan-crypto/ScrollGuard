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
import {
  DoodleShield,
  DoodleCatHead,
  DoodleStar,
  DoodleFlame,
  DoodleTombstone,
} from '../components/DoodleIcons';

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
    if (weekReelsScrolled === 0 && weekMinutesLost === 0) {
      return {
        title: 'FIRST WEEK IN PROGRESS 🌱',
        tagline: 'No reel debt logged this week yet! Your attention fortress is pristine.',
        badgeColor: theme.colors.primary,
      };
    } else if (weekReelsScrolled >= 600) {
      return {
        title: 'THE DOOMSCROLL GLADIATOR',
        tagline: 'You spent half the week in an algorithmic gladiator arena.',
        badgeColor: theme.colors.error,
      };
    } else if (weekReelsScrolled >= 300) {
      return {
        title: 'THE ALGORITHM EXPLORER',
        tagline: 'Your thumb has traveled miles through infinite vertical video loops.',
        badgeColor: theme.colors.warning,
      };
    } else {
      return {
        title: 'THE MINDFUL GUARDIAN',
        tagline: 'You preserved your attention fortress and protected your kitten.',
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
        {/* Hand-Drawn Doodle Story Card */}
        <View style={styles.storyCard}>
          {/* Header */}
          <View style={styles.storyHeader}>
            <View style={styles.logoGroup}>
              <DoodleShield color={theme.colors.primary} size={24} />
              <Text style={styles.logoText}>SCROLLGUARD</Text>
            </View>
            <View style={styles.periodPill}>
              <Text style={styles.periodText}>WEEKLY WRAPPED • 2026</Text>
            </View>
          </View>

          {/* Hero Archetype with Doodle Star */}
          <View style={styles.archetypeBox}>
            <DoodleStar color={archetype.badgeColor} size={42} />
            <Text style={[styles.archetypeBadge, { color: archetype.badgeColor }]}>
              {archetype.title}
            </Text>
            <Text style={styles.archetypeTagline}>"{archetype.tagline}"</Text>
          </View>

          {/* Sketch Stat Highlights */}
          <View style={styles.statGrid}>
            <View style={styles.statCell}>
              <DoodleFlame color={theme.colors.primary} size={22} />
              <Text style={styles.statNum}>{weekReelsScrolled}</Text>
              <Text style={styles.statTitle}>REELS FLICKED</Text>
              <Text style={styles.statFootnote}>Shorts & Clips</Text>
            </View>

            <View style={styles.statCell}>
              <DoodleTombstone color={theme.colors.warning} size={22} />
              <Text style={[styles.statNum, { color: theme.colors.warning }]}>
                {weekHours}h
              </Text>
              <Text style={styles.statTitle}>TIME BURIED</Text>
              <Text style={styles.statFootnote}>In the Graveyard</Text>
            </View>
          </View>

          {/* Kitten Fate Callout with Hand-Drawn Cat */}
          <View style={styles.kittenFateBox}>
            <DoodleCatHead
              color={pet.isDead ? theme.colors.error : theme.colors.primary}
              size={36}
            />
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

          {/* First-Time Empty / In-Progress Note */}
          {weekReelsScrolled === 0 && (
            <View style={styles.firstTimeWrappedNote}>
              <Text style={styles.firstTimeWrappedTitle}>✨ Welcome to your first week!</Text>
              <Text style={styles.firstTimeWrappedDesc}>
                Scroll Wrapped automatically aggregates Sunday recaps as you browse Instagram or YouTube. Stay under your daily limit to preserve your Mindful Guardian tier.
              </Text>
            </View>
          )}

          {/* Streak Bar with Sketch Border */}
          <View style={styles.streakBar}>
            <Text style={styles.streakText}>
              🔥 ACTIVE STREAK: {currentStreak} DAYS (BEST {longestStreak}D)
            </Text>
          </View>

          {/* Story Card Footer */}
          <View style={styles.storyFooter}>
            <Text style={styles.watermark}>
              Doodle summary • Reclaim your mind • scrollguard.app
            </Text>
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
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 12,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
    letterSpacing: 1,
    marginLeft: 6,
  },
  periodPill: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodText: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  archetypeBox: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  archetypeBadge: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 6,
  },
  archetypeTagline: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
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
    backgroundColor: '#0E131F',
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statNum: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
    marginTop: 2,
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
    backgroundColor: '#0E131F',
    padding: theme.spacing.sm + 4,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  kittenFateText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
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
    marginTop: 2,
    lineHeight: 14,
  },
  streakBar: {
    width: '100%',
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
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
    fontSize: 9,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  actionBtn: {
    width: '100%',
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: 14,
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
  firstTimeWrappedNote: {
    backgroundColor: 'rgba(0, 255, 163, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.25)',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  firstTimeWrappedTitle: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  firstTimeWrappedDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
