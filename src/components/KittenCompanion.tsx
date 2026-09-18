import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { useAppStore, KittenStage } from '../store';

export const KittenCompanion: React.FC = () => {
  const { pet, reviveKitten, blockedApps } = useAppStore();

  const totalReelsToday = blockedApps.reduce(
    (acc, app) => acc + app.reelsScrolledToday,
    0,
  );

  if (!pet.hasAppeared) {
    return (
      <View style={styles.dormantCard}>
        <Text style={styles.dormantIcon}>💤</Text>
        <View style={styles.dormantTextContainer}>
          <Text style={styles.dormantTitle}>Companion Asleep in Safety</Text>
          <Text style={styles.dormantDesc}>
            Your kitten rests peacefully. Scrolling short-form reels will awaken it and tie its vitality directly to your screen discipline.
          </Text>
        </View>
      </View>
    );
  }

  const getStageDetails = (stage: KittenStage) => {
    switch (stage) {
      case 'healthy':
        return {
          emoji: '🐱✨',
          status: 'HEALTHY & ENERGETIC',
          color: theme.colors.primary,
          speech: '“Purring softly... Thank you for staying present with me!”',
        };
      case 'tired':
        return {
          emoji: '🐱💤',
          status: 'TIRED & DROOPING',
          color: theme.colors.warning,
          speech: '“*Yawn*... That is a lot of flicking. Can we put the phone down?”',
        };
      case 'sick':
        return {
          emoji: '😿🌡️',
          status: 'SICK & WEAKENED',
          color: theme.colors.accent,
          speech: '“*Shivering*... The algorithm overload is making me sick...”',
        };
      case 'critical':
        return {
          emoji: '🙀💔',
          status: 'CRITICAL CONDITION',
          color: theme.colors.error,
          speech: '“Fading fast! Approaching 700 reels... Please stop scrolling!”',
        };
      case 'dead':
        return {
          emoji: '🪦👻',
          status: 'FALLEN COMPANION',
          color: theme.colors.textMuted,
          speech: '“Your kitten could not survive the 700-reel doom scroll. RIP.”',
        };
    }
  };

  const details = getStageDetails(pet.stage);

  return (
    <View style={[styles.card, { borderColor: details.color }]}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={[styles.statusBadge, { color: details.color }]}>
            {details.status}
          </Text>
          <Text style={styles.reelCounterText}>
            {totalReelsToday} / 700 Reels Scrolled
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>{details.emoji}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.speechText}>{details.speech}</Text>

          {/* Health Bar */}
          <View style={styles.healthHeader}>
            <Text style={styles.healthLabel}>VITALITY</Text>
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
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dormantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dormantIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  dormantTextContainer: {
    flex: 1,
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
  header: {
    marginBottom: theme.spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 0.5,
  },
  reelCounterText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
  },
  speechText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 16,
    marginBottom: theme.spacing.xs,
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
