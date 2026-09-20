import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { TimeGraveyard } from '../components';
import { RootStackParamList } from '../navigation/types';

export const StatsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentStreak, longestStreak, xp, level } = useAppStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Gamified Arena & Debt</Text>
      <Text style={styles.subtitle}>
        Track dopamine resets, XP milestones, and lifetime lost hours
      </Text>

      {/* Tier Card */}
      <View style={styles.levelCard}>
        <Text style={styles.levelLabel}>CURRENT TIER</Text>
        <Text style={styles.levelValue}>Level {level}: Dopamine Monk</Text>
        <Text style={styles.xpText}>{xp} / 2000 XP to Level {level + 1}</Text>
      </View>

      {/* Badges Grid */}
      <View style={styles.badgeGrid}>
        <View style={styles.badgeItem}>
          <Text style={styles.badgeIcon}>🛡️</Text>
          <Text style={styles.badgeTitle}>Fortress</Text>
          <Text style={styles.badgeDesc}>{currentStreak}d (Best {longestStreak}d)</Text>
        </View>
        <View style={styles.badgeItem}>
          <Text style={styles.badgeIcon}>⚡</Text>
          <Text style={styles.badgeTitle}>Willpower</Text>
          <Text style={styles.badgeDesc}>50 Intercepts</Text>
        </View>
      </View>

      {/* Weekly Reports Row */}
      <View style={styles.reportsRow}>
        {/* Trigger Weekly Wrapped Story Card */}
        <TouchableOpacity
          style={styles.reportCard}
          onPress={() => navigation.navigate('Wrapped')}
          activeOpacity={0.8}
        >
          <Text style={styles.reportTag}>ANNUAL & WEEKLY</Text>
          <Text style={styles.reportTitle}>✨ Scroll Wrapped</Text>
          <Text style={styles.reportDesc}>
            Summary of reels flicked and buried time
          </Text>
        </TouchableOpacity>

        {/* Trigger Weekly Cat Report */}
        <TouchableOpacity
          style={[styles.reportCard, styles.catReportCard]}
          onPress={() => navigation.navigate('CatReport')}
          activeOpacity={0.8}
        >
          <Text style={[styles.reportTag, { color: theme.colors.warning }]}>
            PET CHRONICLE
          </Text>
          <Text style={styles.reportTitle}>🐱 Cat Report</Text>
          <Text style={styles.reportDesc}>
            7-day journey of kitten health & revivals
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Graveyard & Scroll Debt Section */}
      <TimeGraveyard />
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
    paddingBottom: theme.spacing.xl,
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
    marginBottom: theme.spacing.md,
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
  reportsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  reportCard: {
    flex: 0.48,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm + 2,
  },
  catReportCard: {
    borderColor: theme.colors.warning,
  },
  reportTag: {
    fontSize: 8,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
    letterSpacing: 0.8,
  },
  reportTitle: {
    fontSize: theme.typography.fontSize.xs + 2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  reportDesc: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
});
