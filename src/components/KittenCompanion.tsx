import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useAppStore, KittenStage } from '../store';
import { RootStackParamList } from '../navigation/types';
import { AnimatedKitten } from './AnimatedKitten';
import { DoodleCatHead, DoodleFlame } from './DoodleIcons';

export const KittenCompanion: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { pet, reviveKitten, blockedApps } = useAppStore();

  const totalReelsToday = blockedApps.reduce(
    (acc, app) => acc + app.reelsScrolledToday,
    0,
  );

  if (!pet.hasAppeared) {
    return (
      <View style={styles.dormantCard}>
        <DoodleCatHead color={theme.colors.textMuted} size={42} />
        <View style={styles.dormantTextContainer}>
          <Text style={styles.dormantTitle}>Companion Asleep in Safety 💤</Text>
          <Text style={styles.dormantDesc}>
            Your kitten rests peacefully. Scrolling reels or shorts will awaken it and tie its vitality directly to your screen discipline.
          </Text>
          <TouchableOpacity
            style={styles.weeklyReportBtn}
            onPress={() => navigation.navigate('CatReport')}
            activeOpacity={0.8}
          >
            <Text style={styles.weeklyReportBtnText}>
              📊 View 7-Day Cat Report →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getStageDetails = (stage: KittenStage) => {
    switch (stage) {
      case 'healthy':
        return {
          status: 'HEALTHY & ENERGETIC',
          color: theme.colors.primary,
          speech: '“Purring softly... Thank you for staying present with me!”',
        };
      case 'tired':
        return {
          status: 'TIRED & DROOPING',
          color: theme.colors.warning,
          speech: '“*Yawn*... That is a lot of flicking. Can we put the phone down?”',
        };
      case 'sick':
        return {
          status: 'SICK & WEAKENED',
          color: theme.colors.accent,
          speech: '“*Shivering*... The algorithm overload is making me sick...”',
        };
      case 'critical':
        return {
          status: 'CRITICAL CONDITION',
          color: theme.colors.error,
          speech: '“Fading fast! Approaching 700 reels... Please stop scrolling!”',
        };
      case 'dead':
        return {
          status: 'FALLEN COMPANION',
          color: theme.colors.textMuted,
          speech: '“Your kitten could not survive the 700-reel doom scroll. RIP.”',
        };
    }
  };

  const details = getStageDetails(pet.stage);

  return (
    <View style={[styles.card, { borderColor: details.color }]}>
      {/* Hand-drawn sketch border badge */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.titleWrap}>
            <DoodleFlame color={details.color} size={18} />
            <Text style={[styles.statusBadge, { color: details.color }]}>
              {details.status}
            </Text>
          </View>
          <Text style={styles.reelCounterText}>
            {totalReelsToday} / 700 Reels Scrolled
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Interactive Animated Character (Breathing + Tap-reactive) */}
        <View style={styles.avatarContainer}>
          <AnimatedKitten
            stage={pet.stage}
            healthPercent={pet.healthPercent}
            size={95}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{details.speech}</Text>
          </View>

          {/* Health Bar */}
          <View style={styles.healthHeader}>
            <Text style={styles.healthLabel}>COMPANION VITALITY</Text>
            <Text style={[styles.healthValue, { color: details.color }]}>
              {pet.healthPercent}% HP
            </Text>
          </View>
          <View style={styles.healthBarBg}>
            <View
              style={[
                styles.healthBarFill,
                {
                  width: `${pet.healthPercent}%`,
                  backgroundColor: details.color,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Weekly Report Trigger Button */}
      <TouchableOpacity
        style={styles.catReportPill}
        onPress={() => navigation.navigate('CatReport')}
        activeOpacity={0.8}
      >
        <Text style={styles.catReportPillText}>
          🐱 View Weekly Cat Report Chronicle →
        </Text>
      </TouchableOpacity>

      {/* Dead / Revive CTA */}
      {pet.isDead && (
        <View style={styles.reviveContainer}>
          <Text style={styles.gameOverText}>
            GAME OVER • 700 REELS REACHED
          </Text>
          {pet.revivesRemaining > 0 ? (
            <TouchableOpacity
              style={styles.reviveButton}
              onPress={reviveKitten}
              activeOpacity={0.8}
            >
              <Text style={styles.reviveButtonText}>
                💖 Use Phoenix Elixir (Revives Left: {pet.revivesRemaining})
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noRevivesText}>
              No elixirs left. Stay under 50 reels tomorrow to naturally resurrect your companion.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'solid',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dormantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dormantTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  dormantTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  dormantDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  weeklyReportBtn: {
    marginTop: 6,
  },
  weeklyReportBtnText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  header: {
    marginBottom: theme.spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  reelCounterText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  avatarContainer: {
    marginRight: theme.spacing.sm,
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  speechBubble: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xs + 2,
    marginBottom: theme.spacing.xs,
  },
  speechText: {
    fontSize: 11,
    color: theme.colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 15,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  healthLabel: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
  },
  healthValue: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
  },
  healthBarBg: {
    height: 6,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  catReportPill: {
    marginTop: theme.spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  catReportPillText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  reviveContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.error,
    letterSpacing: 0.8,
    marginBottom: theme.spacing.xs,
  },
  reviveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs + 4,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  reviveButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    textTransform: 'uppercase',
  },
  noRevivesText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
});
