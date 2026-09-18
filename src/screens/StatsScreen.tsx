import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useAppStore } from '../store';

export const StatsScreen: React.FC = () => {
  const { streakDays, xp, level } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gamified Arena</Text>
      <Text style={styles.subtitle}>Track dopamine resets, XP bonuses, and milestones</Text>

      <View style={styles.levelCard}>
        <Text style={styles.levelLabel}>CURRENT TIER</Text>
        <Text style={styles.levelValue}>Level {level}: Dopamine Monk</Text>
        <Text style={styles.xpText}>{xp} / 2000 XP to Level {level + 1}</Text>
      </View>

      <View style={styles.badgeGrid}>
        <View style={styles.badgeItem}>
          <Text style={styles.badgeIcon}>🛡️</Text>
          <Text style={styles.badgeTitle}>Fortress</Text>
          <Text style={styles.badgeDesc}>{streakDays} Day Streak</Text>
        </View>
        <View style={styles.badgeItem}>
          <Text style={styles.badgeIcon}>⚡</Text>
          <Text style={styles.badgeTitle}>Willpower</Text>
          <Text style={styles.badgeDesc}>50 Intercepts</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  levelCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  levelLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.xpGold,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 1.5,
  },
  levelValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  xpText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  badgeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItem: {
    flex: 0.48,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: theme.spacing.xs,
  },
  badgeTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  badgeDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
});
