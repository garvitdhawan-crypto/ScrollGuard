import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useAppStore } from '../store';

export const TimeGraveyard: React.FC = () => {
  const { lifetimeMinutesLost, weekMinutesLost } = useAppStore();

  const lifetimeHours = (lifetimeMinutesLost / 60).toFixed(1);
  const weekHours = (weekMinutesLost / 60).toFixed(1);

  // Relatable scroll debt conversions
  const sleepLostDays = (lifetimeMinutesLost / 480).toFixed(1); // 8-hour sleep blocks
  const novelsMissed = Math.floor(lifetimeMinutesLost / 300); // 5 hours per novel
  const workoutsSkipped = Math.floor(lifetimeMinutesLost / 45); // 45m per workout
  const moviesMissed = (lifetimeMinutesLost / 120).toFixed(1); // 2 hours per movie

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🪦 The Time Graveyard</Text>
        <Text style={styles.subtitle}>
          Buried hours and the physical toll of algorithmic dopamine
        </Text>
      </View>

      {/* Primary Debt Counter */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>THIS WEEK BURIED</Text>
          <Text style={[styles.summaryVal, { color: theme.colors.warning }]}>
            ⏳ {weekHours} hrs
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>LIFETIME LOSS</Text>
          <Text style={[styles.summaryVal, { color: theme.colors.error }]}>
            💀 {lifetimeHours} hrs
          </Text>
        </View>
      </View>

      <Text style={styles.sectionHeading}>YOUR SCROLL DEBT (EQUIVALENTS)</Text>

      {/* Tombstone Milestone Cards */}
      <View style={styles.tombstoneGrid}>
        <View style={styles.tombstone}>
          <Text style={styles.tombIcon}>💤</Text>
          <Text style={styles.tombHeadline}>{sleepLostDays} Days</Text>
          <Text style={styles.tombDesc}>Deep, restorative sleep flushed away</Text>
        </View>

        <View style={styles.tombstone}>
          <Text style={styles.tombIcon}>📚</Text>
          <Text style={styles.tombHeadline}>{novelsMissed} Books</Text>
          <Text style={styles.tombDesc}>Unread masterworks replaced by 15s clips</Text>
        </View>

        <View style={styles.tombstone}>
          <Text style={styles.tombIcon}>🏋️</Text>
          <Text style={styles.tombHeadline}>{workoutsSkipped} Workouts</Text>
          <Text style={styles.tombDesc}>Skipped gym sessions while sitting paralyzed</Text>
        </View>

        <View style={styles.tombstone}>
          <Text style={styles.tombIcon}>🎬</Text>
          <Text style={styles.tombHeadline}>{moviesMissed} Films</Text>
          <Text style={styles.tombDesc}>Full cinematic stories you "didn't have time" for</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  summaryLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 1,
  },
  summaryVal: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.heavy,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xs,
  },
  tombstoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tombstone: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  tombIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  tombHeadline: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  tombDesc: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
});
